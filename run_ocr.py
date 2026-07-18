"""Run OCR for one local image and print an API-format JSON response."""

from __future__ import annotations

import argparse
import contextlib
import sys
from datetime import datetime
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from codex_backend.services.ocr import OCRResponse, process_image_path


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run OCR for one image file.")
    parser.add_argument(
        "--image-path",
        "--image_path",
        dest="image_path",
        required=True,
        help="Path to the image file to process.",
    )
    parser.add_argument(
        "--enhance-image",
        "--enhance_image",
        dest="enhance_image",
        action=argparse.BooleanOptionalAction,
        default=True,
        help="Apply image preprocessing (default: enabled).",
    )
    return parser.parse_args(argv)


def run_ocr(image_path: str, enhance_image: bool = True) -> OCRResponse:
    """Process one image with the same response shape as the OCR API."""
    path = Path(image_path).expanduser()
    if not path.is_file():
        raise FileNotFoundError("image_path must point to an existing file")

    return process_image_path(str(path.resolve()), enhance=enhance_image)


def error_response(image_path: str, error: Exception) -> OCRResponse:
    return OCRResponse(
        success=False,
        natural_language="",
        raw_text="",
        confidence=0.0,
        low_confidence_flag=True,
        processing_time_ms=0.0,
        metadata={
            "image_path": image_path,
            "preprocessed_path": None,
            "reasoning": None,
            "usage": None,
            "timestamp": datetime.now().isoformat(),
            "error": str(error),
        },
    )


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)

    try:
        with contextlib.redirect_stdout(sys.stderr):
            response = run_ocr(args.image_path, args.enhance_image)
    except Exception as error:
        response = error_response(args.image_path, error)

    print(response.model_dump_json(indent=2))
    return 0 if response.success else 1


if __name__ == "__main__":
    raise SystemExit(main())
