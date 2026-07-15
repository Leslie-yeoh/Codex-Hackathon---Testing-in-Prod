"""Combined backend routers."""

from __future__ import annotations

from fastapi import APIRouter

from backend.routers.auth_router import router as auth_router
from backend.routers.ocr_router import router as ocr_router

router = APIRouter()
router.include_router(auth_router)
router.include_router(ocr_router)
