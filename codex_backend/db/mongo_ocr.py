import hashlib
from datetime import datetime
from typing import Optional, Dict, Any
from dataclasses import asdict

from pymongo import MongoClient
from gridfs import GridFS, GridFSBucket
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file


class MongoDBClient:
    def __init__(self, uri: Optional[str] = None, database: str = "doctor_ocr"):
        self.uri = uri or os.getenv("MONGODB_URI", "mongodb://localhost:27017")
        self.database_name = os.getenv("GRIDFS_DATABASE_NAME", database)
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

    def _compute_hash(self, image_bytes: bytes) -> str:
        return hashlib.sha256(image_bytes).hexdigest()

    def _find_by_hash(self, image_hash: str):
        return self.fs.find_one({"filename": image_hash})

    def save_extraction(
        self,
        image_bytes: bytes,
        original_path: str,
        content_type: str,
        result,
    ) -> str:
        if not self.connected:
            self.connect()

        image_hash = self._compute_hash(image_bytes)
        result_dict = asdict(result)

        existing = self._find_by_hash(image_hash)
        action = "replaced" if existing else "inserted"

        if existing:
            self.bucket.delete(existing._id)

        metadata = {
            "original_filename": os.path.basename(original_path),
            "image_hash": image_hash,
            "processed_at": datetime.now().isoformat(),
            "content_type": content_type,
            "action": action,
            "extraction": result_dict,
        }

        file_id = self.bucket.upload_from_stream(
            filename=image_hash,
            source=image_bytes,
            metadata=metadata,
        )

        print(f"MongoDB: {action} extraction (hash={image_hash[:12]}..., id={file_id})")
        return str(file_id)

    def get_extraction(self, image_hash: str) -> Optional[Dict[str, Any]]:
        if not self.connected:
            self.connect()
        grid_file = self.fs.find_one({"filename": image_hash})
        if grid_file is None:
            return None
        return {
            "file_id": str(grid_file._id),
            "metadata": grid_file.metadata,
            "upload_date": grid_file.upload_date,
        }

    def list_extractions(self, limit: int = 20, skip: int = 0) -> list:
        if not self.connected:
            self.connect()
        files = self.fs.find().sort("uploadDate", -1).skip(skip).limit(limit)
        results = []
        for f in files:
            results.append({
                "file_id": str(f._id),
                "image_hash": f.filename,
                "metadata": f.metadata,
                "upload_date": f.upload_date,
            })
        return results

    def delete_extraction(self, image_hash: str) -> bool:
        if not self.connected:
            self.connect()
        grid_file = self.fs.find_one({"filename": image_hash})
        if grid_file is None:
            return False
        self.bucket.delete(grid_file._id)
        return True
