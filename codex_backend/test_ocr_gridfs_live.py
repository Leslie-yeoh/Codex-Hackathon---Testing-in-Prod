"""Run the OCR GridFS upload and confirmation smoke check against MongoDB."""

from __future__ import annotations

import asyncio
import os
import tempfile
from datetime import datetime
from io import BytesIO
from types import SimpleNamespace

from dotenv import load_dotenv
from fastapi import UploadFile
from starlette.datastructures import Headers

from codex_backend.db.mongo_ocr import MongoDBClient
from codex_backend.services import ocr


class FakeWorkflow:
    def __init__(self, mongo_client: MongoDBClient, success: bool):
        self.mongo_client = mongo_client
        self.success = success
        self.custom_prompt = None
        self.preprocess = True

    def process_single(self, image_path: str):
        return SimpleNamespace(
            image_path=image_path,
            preprocessed_path=None,
            extracted_text="OCR context",
            raw_text="OCR context",
            reasoning=None,
            usage=None,
            confidence=0.9,
            timestamp=datetime.now().isoformat(),
            processing_time_ms=12.5,
            success=self.success,
            error=None if self.success else "OCR failed",
        )


async def upload(image: bytes, success: bool, mongo_client: MongoDBClient) -> str:
    ocr.workflow = FakeWorkflow(mongo_client, success)
    response = await ocr.process_upload(
        UploadFile(
            filename="prescription.png",
            file=BytesIO(image),
            headers=Headers({"content-type": "image/png"}),
        ),
        user_id="jwt-user-id",
    )
    assert response.file_id
    assert response.success is success
    return response.file_id


async def upload_pdf(mongo_client: MongoDBClient) -> str:
    ocr.workflow = FakeWorkflow(mongo_client, True)
    original_renderer = ocr._render_pdf_first_page
    rendered_path = ""

    def render_pdf(_: str) -> str:
        nonlocal rendered_path
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as rendered:
            rendered.write(b"rendered-page")
            rendered_path = rendered.name
        return rendered_path

    ocr._render_pdf_first_page = render_pdf
    try:
        response = await ocr.process_upload(
            UploadFile(
                filename="prescription.pdf",
                file=BytesIO(b"%PDF-1.4"),
                headers=Headers({"content-type": "application/pdf"}),
            ),
            user_id="jwt-user-id",
        )
        assert response.file_id
        return response.file_id
    finally:
        ocr._render_pdf_first_page = original_renderer
        if rendered_path and os.path.exists(rendered_path):
            os.unlink(rendered_path)

def main() -> None:
    load_dotenv("codex_backend/.env")
    mongo_client = MongoDBClient()
    mongo_client.connect()
    file_ids = []

    try:
        success_id = asyncio.run(upload(b"successful-image", True, mongo_client))
        file_ids.append(success_id)
        pending = mongo_client.db.fs.files.find_one({"_id": __import__("bson").ObjectId(success_id)})
        assert pending["metadata"]["user_id"] == "jwt-user-id"
        assert pending["metadata"]["success"] is True
        assert pending["metadata"]["status"] == "pending_review"

        confirmed = ocr.confirm_ocr_upload(
            success_id,
            ocr.ConfirmOCRRequest(
                patientID="Patient/MYKAD-950812-14-5567",
                findings=[ocr.Finding(observation="Heart rate", value="92", unit="beats/minute")],
                context="<h2>Assessment</h2><p><strong>Stable</strong></p><ul><li>Follow up</li></ul>",
            ),
            "jwt-user-id",
        )
        assert confirmed.success
        metadata = mongo_client.db.fs.files.find_one({"_id": __import__("bson").ObjectId(success_id)})["metadata"]
        assert metadata["patientID"] == "Patient/MYKAD-950812-14-5567"
        assert metadata["totalFindings"] == 1
        assert metadata["context"] == "## Assessment\n\n**Stable**\n\n- Follow up"
        assert metadata["success"] is True

        failed_id = asyncio.run(upload(b"failed-image", False, mongo_client))
        file_ids.append(failed_id)
        failed = mongo_client.db.fs.files.find_one({"_id": __import__("bson").ObjectId(failed_id)})
        assert failed["metadata"]["success"] is False
        assert failed["metadata"]["totalFindings"] == 0

        pdf_id = asyncio.run(upload_pdf(mongo_client))
        file_ids.append(pdf_id)
        pdf = mongo_client.db.fs.files.find_one({"_id": __import__("bson").ObjectId(pdf_id)})
        assert pdf["metadata"]["content_type"] == "application/pdf"
    finally:
        for file_id in file_ids:
            mongo_client.bucket.delete(__import__("bson").ObjectId(file_id))
        mongo_client.close()

    print("OCR GridFS smoke check passed.")


if __name__ == "__main__":
    main()