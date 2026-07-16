"""OCR routes."""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import HTMLResponse

from codex_backend.services.ocr import (
    Base64ImageRequest,
    BatchOCRResponse,
    HealthResponse,
    OCRResponse,
    URLImageRequest,
    get_health,
    get_upload_form_html,
    process_base64,
    process_image_path,
    process_upload,
    process_upload_batch,
    process_url,
)

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Return OCR service health."""

    return get_health()


@router.post("/ocr/handwriting", response_model=OCRResponse)
async def ocr_handwriting(
    file: UploadFile = File(..., description="Doctor handwriting image (JPG, PNG)"),
    enhance: bool = Form(True, description="Apply full preprocessing pipeline"),
    custom_prompt: Optional[str] = Form(None, description="Custom prompt for VLM"),
) -> OCRResponse:
    """Process one uploaded handwriting image."""

    return await process_upload(file, enhance, custom_prompt)


@router.post("/ocr/handwriting/batch", response_model=BatchOCRResponse)
async def ocr_handwriting_batch(
    files: list[UploadFile] = File(..., description="Multiple doctor handwriting images"),
    enhance: bool = Form(True, description="Apply full preprocessing pipeline"),
    custom_prompt: Optional[str] = Form(None, description="Custom prompt for VLM"),
) -> BatchOCRResponse:
    """Process multiple uploaded handwriting images."""

    return await process_upload_batch(files, enhance, custom_prompt)


@router.post("/ocr/handwriting/filepath", response_model=OCRResponse)
async def ocr_handwriting_filepath(
    image_path: str = Form(..., description="Path to image file on server"),
    enhance: bool = Form(True),
    custom_prompt: Optional[str] = Form(None),
) -> OCRResponse:
    """Process an image already present on the server."""

    return process_image_path(image_path, enhance, custom_prompt)


@router.post("/ocr/handwriting/base64", response_model=OCRResponse)
async def ocr_handwriting_base64(request: Base64ImageRequest) -> OCRResponse:
    """Process a base64 encoded image."""

    return process_base64(request)


@router.post("/ocr/handwriting/url", response_model=OCRResponse)
async def ocr_handwriting_url(request: URLImageRequest) -> OCRResponse:
    """Fetch and process an image URL."""

    return await process_url(request)


@router.get("/upload", response_class=HTMLResponse)
async def upload_form() -> str:
    """Return a simple HTML form for testing uploads."""

    return get_upload_form_html()
