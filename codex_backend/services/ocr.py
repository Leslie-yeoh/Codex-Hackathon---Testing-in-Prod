"""OCR service logic."""

from __future__ import annotations

import base64
import os
import re
import tempfile
import time
from pathlib import Path
from typing import Optional

import httpx
from fastapi import HTTPException, UploadFile
from pydantic import BaseModel, Field

from codex_backend.ai import DoctorHandwritingWorkflow, ProcessingResult, create_workflow

workflow: DoctorHandwritingWorkflow | None = None


class OCRResponse(BaseModel):
    """OCR result returned to clients."""

    success: bool = Field(..., description="Whether the OCR was successful")
    natural_language: str = Field(..., description="Extracted text in natural medical language")
    raw_text: str = Field(..., description="Raw extracted text from the image")
    confidence: float = Field(..., description="Confidence score (0-1), flagged if < 0.8")
    low_confidence_flag: bool = Field(..., description="True if confidence < 0.8")
    processing_time_ms: float = Field(..., description="Processing time in milliseconds")
    preprocessed_image_saved: bool = Field(False, description="Whether preprocessed image was saved")
    metadata: dict = Field(default_factory=dict)


class Base64ImageRequest(BaseModel):
    """Base64 image OCR request."""

    image_base64: str = Field(..., description="Base64 encoded image (data URL or raw base64)")
    enhance: bool = Field(True, description="Apply full preprocessing pipeline")
    custom_prompt: Optional[str] = Field(None, description="Custom prompt for VLM")
    filename: Optional[str] = Field("web_upload.jpg", description="Original filename")


class URLImageRequest(BaseModel):
    """URL image OCR request."""

    image_url: str = Field(..., description="Public URL to image")
    enhance: bool = Field(True, description="Apply full preprocessing pipeline")
    custom_prompt: Optional[str] = Field(None, description="Custom prompt for VLM")


class BatchOCRResponse(BaseModel):
    """Batch OCR result."""

    results: list[OCRResponse]
    total_processed: int
    successful: int
    failed: int
    total_time_ms: float


class HealthResponse(BaseModel):
    """API health result."""

    status: str
    model: str
    api_configured: bool


def init_workflow() -> None:
    """Initialize the shared OCR workflow."""

    global workflow
    workflow = create_workflow()


def get_workflow() -> DoctorHandwritingWorkflow:
    """Return the shared OCR workflow, creating it on first use."""

    global workflow
    if workflow is None:
        workflow = create_workflow()
    return workflow


def convert_result_to_response(result: ProcessingResult) -> OCRResponse:
    """Convert an internal OCR result into the API response model."""

    return OCRResponse(
        success=result.success,
        natural_language=result.extracted_text,
        raw_text=result.raw_text,
        confidence=round(result.confidence, 3),
        low_confidence_flag=result.confidence < 0.8,
        processing_time_ms=round(result.processing_time_ms, 1),
        preprocessed_image_saved=result.preprocessed_path is not None,
        metadata={
            "image_path": result.image_path,
            "preprocessed_path": result.preprocessed_path,
            "reasoning": result.reasoning,
            "usage": result.usage,
            "timestamp": result.timestamp,
            "error": result.error,
        },
    )


def process_image_path(image_path: str, enhance: bool = True, custom_prompt: str | None = None) -> OCRResponse:
    """Process an image already available on the server filesystem."""

    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail=f"File not found: {image_path}")

    wf = get_workflow()
    wf.custom_prompt = custom_prompt
    wf.preprocess = enhance
    result = wf.process_single(image_path)
    wf._save_result(result)
    return convert_result_to_response(result)


async def process_upload(file: UploadFile, enhance: bool = True, custom_prompt: str | None = None) -> OCRResponse:
    """Process one uploaded image."""

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    suffix = Path(file.filename or "upload.jpg").suffix or ".jpg"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        return process_image_path(tmp_path, enhance, custom_prompt)
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


async def process_upload_batch(
    files: list[UploadFile], enhance: bool = True, custom_prompt: str | None = None
) -> BatchOCRResponse:
    """Process multiple uploaded images."""

    results: list[OCRResponse] = []
    start_time = time.time()

    for file in files:
        if not file.content_type or not file.content_type.startswith("image/"):
            results.append(
                OCRResponse(
                    success=False,
                    natural_language="",
                    raw_text="",
                    confidence=0.0,
                    low_confidence_flag=True,
                    processing_time_ms=0,
                    metadata={"error": "Invalid file type", "filename": file.filename},
                )
            )
            continue
        results.append(await process_upload(file, enhance, custom_prompt))

    successful = sum(1 for result in results if result.success)
    return BatchOCRResponse(
        results=results,
        total_processed=len(results),
        successful=successful,
        failed=len(results) - successful,
        total_time_ms=round((time.time() - start_time) * 1000, 1),
    )


def process_base64(request: Base64ImageRequest) -> OCRResponse:
    """Decode and process a base64 image."""

    try:
        if request.image_base64.startswith("data:image"):
            header, encoded = request.image_base64.split(",", 1)
            mime_match = re.search(r"data:image/(\w+);base64", header)
            ext = f".{mime_match.group(1)}" if mime_match else ".jpg"
        else:
            encoded = request.image_base64
            ext = Path(request.filename or "web_upload.jpg").suffix or ".jpg"
        image_data = base64.b64decode(encoded)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid base64 image: {exc}") from exc

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        tmp.write(image_data)
        tmp_path = tmp.name

    try:
        return process_image_path(tmp_path, request.enhance, request.custom_prompt)
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


async def process_url(request: URLImageRequest) -> OCRResponse:
    """Fetch and process an image URL."""

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(request.image_url)
            response.raise_for_status()

        ext_map = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/bmp": ".bmp"}
        ext = ext_map.get(response.headers.get("content-type", ""), Path(request.image_url).suffix or ".jpg")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Failed to fetch image: {exc}") from exc

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        tmp.write(response.content)
        tmp_path = tmp.name

    try:
        return process_image_path(tmp_path, request.enhance, request.custom_prompt)
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


def get_health() -> HealthResponse:
    """Return OCR service health details."""

    wf = get_workflow()
    return HealthResponse(status="healthy", model=wf.gemini_model, api_configured=bool(wf.gemini_api_key and wf.api_key))


def get_upload_form_html() -> str:
    """Return the simple upload test page."""

    return """
<!DOCTYPE html>
<html>
<head>
    <title>Doctor Handwriting OCR - Web Upload</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, select, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
        button:hover { background: #0056b3; }
        button:disabled { background: #ccc; cursor: not-allowed; }
        .result { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 4px; white-space: pre-wrap; }
        .error { background: #f8d7da; color: #721c24; }
        .success { background: #d4edda; color: #155724; }
        .confidence { font-weight: bold; }
        .confidence.low { color: #dc3545; }
        .confidence.ok { color: #28a745; }
        pre { background: #fff; padding: 10px; border-radius: 4px; overflow-x: auto; }
        .preview { max-width: 300px; max-height: 300px; margin-top: 10px; display: none; }
    </style>
</head>
<body>
    <h1>Doctor Handwriting OCR</h1>
    <p>Upload a handwritten medical note/prescription image for AI interpretation</p>

    <form id="uploadForm" enctype="multipart/form-data">
        <div class="form-group">
            <label>Image File</label>
            <input type="file" id="imageFile" name="file" accept="image/*" required>
            <img id="preview" class="preview" alt="Preview">
        </div>

        <div class="form-group">
            <label>Enhance Image (Preprocessing)</label>
            <select name="enhance" id="enhance">
                <option value="true">Yes (Full pipeline - CLAHE, denoise, sharpen, deskew)</option>
                <option value="false">No (Raw image)</option>
            </select>
        </div>

        <div class="form-group">
            <label>Custom Prompt (Optional)</label>
            <textarea name="custom_prompt" id="custom_prompt" rows="3" placeholder="Custom instructions for the VLM..."></textarea>
        </div>

        <button type="submit" id="submitBtn">Analyze Handwriting</button>
    </form>

    <div id="result" class="result" style="display: none;"></div>

    <script>
        const fileInput = document.getElementById('imageFile');
        const preview = document.getElementById('preview');
        const form = document.getElementById('uploadForm');
        const resultDiv = document.getElementById('result');
        const submitBtn = document.getElementById('submitBtn');

        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';
            resultDiv.style.display = 'none';

            const formData = new FormData(form);

            try {
                const response = await fetch('/ocr/handwriting', { method: 'POST', body: formData });
                const data = await response.json();

                let html = '';
                if (data.success) {
                    html += '<div class="success">';
                    html += '<h3>Success</h3>';
                    html += `<p class="confidence ${data.low_confidence_flag ? 'low' : 'ok'}">Confidence: ${(data.confidence * 100).toFixed(1)}% ${data.low_confidence_flag ? 'LOW' : 'OK'}</p>`;
                    html += `<p>Processing time: ${data.processing_time_ms.toFixed(0)}ms</p>`;
                    html += '<h4>Extracted Medical Notes:</h4>';
                    html += `<pre>${data.natural_language}</pre>`;
                    html += '</div>';
                } else {
                    html += '<div class="error">';
                    html += '<h3>Failed</h3>';
                    html += `<p>${data.metadata?.error || 'Unknown error'}</p>`;
                    html += '</div>';
                }

                resultDiv.innerHTML = html;
                resultDiv.style.display = 'block';
            } catch (err) {
                resultDiv.innerHTML = '<div class="error"><h3>Error</h3><p>' + err.message + '</p></div>';
                resultDiv.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Analyze Handwriting';
            }
        });
    </script>
</body>
</html>
"""

