"""Main backend entrypoint for frontend traffic."""

from __future__ import annotations

import os
import sys

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from codex_backend.routers import router
from codex_backend.services.ocr import init_workflow

app = FastAPI(
    title="Doctor Handwriting OCR API",
    description="VLM-based doctor handwriting recognition using NVIDIA Nemotron-3-Nano-Omni",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.on_event("startup")
async def startup_event() -> None:
    """Initialize backend services."""

    init_workflow()
    print("Doctor Handwriting OCR API started")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
