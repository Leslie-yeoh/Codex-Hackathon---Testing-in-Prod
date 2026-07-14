import os
from typing import Optional

from db.mongo_db import MongoDBClient

_db_client: Optional[MongoDBClient] = None


def init_db(uri: Optional[str] = None, database: str = "doctor_ocr") -> MongoDBClient:
    global _db_client
    if _db_client is not None:
        return _db_client
    resolved_uri = uri or os.getenv("MONGODB_URI")
    _db_client = MongoDBClient(uri=resolved_uri, database=database)
    _db_client.connect()
    print("MongoDB client initialized and connected")
    return _db_client


def get_db() -> MongoDBClient:
    global _db_client
    if _db_client is None:
        return init_db()
    return _db_client


def close_db():
    global _db_client
    if _db_client is not None:
        _db_client.close()
        _db_client = None
        print("MongoDB client closed")
