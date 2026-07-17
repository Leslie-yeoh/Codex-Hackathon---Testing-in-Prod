import hashlib
import os
from dataclasses import asdict
from datetime import datetime
from typing import Any, Dict, Optional
from uuid import uuid4

from bson import ObjectId
from dotenv import load_dotenv
from gridfs import GridFS, GridFSBucket
from pymongo import MongoClient

load_dotenv()


class MongoDBClient:
    def __init__(self, uri: Optional[str] = None, database: str = "doctor_ocr"):
        self.uri = uri or os.getenv("MONGODB_URI", "mongodb://localhost:27017")
        self.database_name = database
        self.client: Optional[MongoClient] = None
        self.db = None
        self.fs: Optional[GridFS] = None
        self.bucket: Optional[GridFSBucket] = None

    def connect(self):
        if self.client is not None:
            return
        self.client = MongoClient(self.uri)
        self.db = self.client[self.database_name]
        self.bucket = GridFSBucket(self.db)
        self.fs = GridFS(self.db)

    def close(self):
        if self.client:
            self.client.close()
            self.client = None
            self.db = None
            self.fs = None
            self.bucket = None

    @property
    def connected(self) -> bool:
        return self.client is not None

    @staticmethod
    def _compute_hash(image_bytes: bytes) -> str:
        return hashlib.sha256(image_bytes).hexdigest()

    def _find_by_hash(self, image_hash: str):
        return self.fs.find_one({"filename": image_hash})

    def save_ocr_upload(self, image_bytes: bytes, original_filename: str, content_type: str, user_id: str, result) -> str:
        if not self.connected:
            self.connect()

        image_hash = self._compute_hash(image_bytes)
        metadata = {
            "user_id": user_id,
            "patientID": "",
            "findings": [],
            "totalFindings": 0,
            "context": "",
            "timeTaken": round(result.processing_time_ms, 1),
            "success": result.success,
            "status": "pending_review" if result.success else "failed",
            "original_filename": original_filename,
            "image_hash": image_hash,
            "content_type": content_type,
            "processed_at": datetime.now().isoformat(),
        }
        file_id = self.bucket.upload_from_stream(
            filename=f"{image_hash}-{uuid4().hex}",
            source=image_bytes,
            metadata=metadata,
        )
        return str(file_id)

    def finalize_ocr_upload(
        self,
        file_id: str,
        user_id: str,
        patient_id: str,
        findings: list[dict[str, str]],
        context_markdown: str,
    ) -> bool:
        if not self.connected:
            self.connect()

        try:
            object_id = ObjectId(file_id)
        except Exception as exc:
            raise ValueError("Invalid GridFS file ID") from exc

        result = self.db.fs.files.update_one(
            {"_id": object_id, "metadata.user_id": user_id, "metadata.status": "pending_review"},
            {
                "$set": {
                    "metadata.patientID": patient_id,
                    "metadata.findings": findings,
                    "metadata.totalFindings": len(findings),
                    "metadata.context": context_markdown,
                    "metadata.success": True,
                    "metadata.status": "confirmed",
                    "metadata.confirmed_at": datetime.now().isoformat(),
                }
            },
        )
        return result.modified_count == 1

    def save_extraction(self, image_bytes: bytes, original_path: str, content_type: str, result) -> str:
        if not self.connected:
            self.connect()

        image_hash = self._compute_hash(image_bytes)
        result_dict = asdict(result)
        existing = self._find_by_hash(image_hash)
        if existing:
            self.bucket.delete(existing._id)

        file_id = self.bucket.upload_from_stream(
            filename=image_hash,
            source=image_bytes,
            metadata={
                "original_filename": os.path.basename(original_path),
                "image_hash": image_hash,
                "processed_at": datetime.now().isoformat(),
                "content_type": content_type,
                "extraction": result_dict,
            },
        )
        return str(file_id)

    def get_extraction(self, image_hash: str) -> Optional[Dict[str, Any]]:
        if not self.connected:
            self.connect()
        grid_file = self._find_by_hash(image_hash)
        if grid_file is None:
            return None
        return {"file_id": str(grid_file._id), "metadata": grid_file.metadata, "upload_date": grid_file.upload_date}

    def list_extractions(self, limit: int = 20, skip: int = 0) -> list:
        if not self.connected:
            self.connect()
        files = self.fs.find().sort("uploadDate", -1).skip(skip).limit(limit)
        return [
            {
                "file_id": str(file._id),
                "image_hash": file.filename,
                "metadata": file.metadata,
                "upload_date": file.upload_date,
            }
            for file in files
        ]

    def delete_extraction(self, image_hash: str) -> bool:
        if not self.connected:
            self.connect()
        grid_file = self._find_by_hash(image_hash)
        if grid_file is None:
            return False
        self.bucket.delete(grid_file._id)
        return True