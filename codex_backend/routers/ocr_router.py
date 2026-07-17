"""OCR routes."""

from __future__ import annotations

from typing import Any, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Response, UploadFile
from fastapi.responses import HTMLResponse

from codex_backend.services.auth import get_current_user

from codex_backend.services.ocr import (
    Base64ImageRequest,
    BatchOCRResponse,
    ConfirmOCRRequest,
    ConfirmOCRResponse,
    HealthResponse,
    OCRResponse,
    URLImageRequest,
    confirm_ocr_upload,
    get_health,
    get_upload_form_html,
    get_workflow,
    process_base64,
    process_image_path,
    process_upload,
    process_upload_batch,
    process_url,
)

router = APIRouter()


def get_ocr_storage():
    mongo_client = get_workflow().mongo_client
    if mongo_client is None:
        raise HTTPException(status_code=503, detail="GridFS storage is not configured")
    return mongo_client


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Return OCR service health."""

    return get_health()


@router.get("/dashboard/weekly-volume")
async def get_weekly_ocr_volume(
    _: dict[str, Any] = Depends(get_current_user),
) -> list[dict[str, Any]]:
    """Return OCR process counts from doctor_ocr.fs.files for the last seven days."""
    return get_ocr_storage().get_weekly_ocr_volume()

@router.get("/ocr/records")
async def list_ocr_records(
    current_user: dict[str, Any] = Depends(get_current_user),
) -> list[dict[str, Any]]:
    """List the current user's confirmed OCR records."""

    return get_ocr_storage().list_confirmed_ocr_uploads(current_user["user_id"])


@router.get("/ocr/records/{file_id}/file")
async def get_ocr_record_file(
    file_id: str,
    current_user: dict[str, Any] = Depends(get_current_user),
) -> Response:
    """Return one confirmed OCR file owned by the current user."""

    try:
        record_file = get_ocr_storage().get_confirmed_ocr_upload(file_id, current_user["user_id"])
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if record_file is None:
        raise HTTPException(status_code=404, detail="OCR record not found")

    content, content_type = record_file
    return Response(content=content, media_type=content_type)


@router.post("/ocr/handwriting", response_model=OCRResponse)
async def ocr_handwriting(
    file: UploadFile = File(..., description="Doctor handwriting document (image or PDF)"),
    enhance: bool = Form(True, description="Apply full preprocessing pipeline"),
    custom_prompt: Optional[str] = Form(None, description="Custom prompt for VLM"),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> OCRResponse:
    """Process one uploaded handwriting image."""

    return await process_upload(file, current_user["user_id"], enhance, custom_prompt)


@router.post("/ocr/handwriting/batch", response_model=BatchOCRResponse)
async def ocr_handwriting_batch(
    files: list[UploadFile] = File(..., description="Multiple doctor handwriting images"),
    enhance: bool = Form(True, description="Apply full preprocessing pipeline"),
    custom_prompt: Optional[str] = Form(None, description="Custom prompt for VLM"),
    current_user: dict[str, Any] = Depends(get_current_user),
) -> BatchOCRResponse:
    """Process multiple uploaded images."""

    return await process_upload_batch(files, current_user["user_id"], enhance, custom_prompt)

@router.post("/ocr/handwriting/{file_id}/confirm", response_model=ConfirmOCRResponse)
async def confirm_ocr_handwriting(
    file_id: str,
    payload: ConfirmOCRRequest,
    current_user: dict[str, Any] = Depends(get_current_user),
) -> ConfirmOCRResponse:
    """Store reviewed OCR metadata for an uploaded image."""

    return confirm_ocr_upload(file_id, payload, current_user["user_id"])
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
