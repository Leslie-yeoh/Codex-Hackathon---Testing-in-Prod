"""Authentication service logic."""

from __future__ import annotations

import hashlib
import os
from pathlib import Path
from datetime import datetime, timedelta, timezone
from typing import Any

from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

MONGO_URI = os.getenv("MONGO_URI") or os.getenv("MONGODB_URI", "mongodb://localhost:27017")
JWT_SECRET = os.getenv("JWT_SECRET")
if not JWT_SECRET:
    raise RuntimeError("JWT_SECRET must be set")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "30"))

client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=10000)
users_collection = client["codex"]["users"]

import bcrypt
from bson import ObjectId
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class SignupRequest(BaseModel):
    """Signup payload."""

    username: str = Field(min_length=1)
    email: str = Field(min_length=3)
    password: str = Field(min_length=8)
    confirm_password: str = Field(min_length=8)


class LoginRequest(BaseModel):
    """Login payload."""

    email: str = Field(min_length=3)
    password: str = Field(min_length=1)


class TokenResponse(BaseModel):
    """JWT token response."""

    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    """Public user response."""

    username: str
    email: str
    role: str = "User"


def hash_password(password: str) -> str:
    """Hash a plaintext password with bcrypt."""

    return bcrypt.hashpw(hashlib.sha256(password.encode("utf-8")).digest(), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against a stored bcrypt hash."""

    return bcrypt.checkpw(hashlib.sha256(plain_password.encode("utf-8")).digest(), hashed_password.encode("utf-8"))


def create_access_token(subject: str, user_id: str) -> str:
    """Create a signed JWT access token for a username."""

    expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTES)
    return jwt.encode({"sub": subject, "userID": user_id, "exp": expire}, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> dict[str, Any]:
    """Decode and validate a JWT access token."""

    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


async def signup_user(payload: SignupRequest) -> UserResponse:
    """Create a user if the username is available."""

    if payload.password != payload.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="passwords do not match")

    if await users_collection.find_one({"$or": [{"username": payload.username}, {"email": payload.email}]}):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="username already exists")

    await users_collection.insert_one(
        {
            "username": payload.username,
            "email": payload.email,
            "role": "User",
            "hashed_password": hash_password(payload.password),
        }
    )
    return UserResponse(username=payload.username, email=payload.email, role="User")


async def login_user(payload: LoginRequest) -> TokenResponse:
    """Authenticate a user and return an access token."""

    user = await users_collection.find_one({"$or": [{"email": payload.email}, {"username": payload.email}]})
    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return TokenResponse(access_token=create_access_token(user["username"], str(user["_id"])))


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict[str, Any]:
    """Return the current user from a Bearer token."""

    token_data = decode_access_token(token)
    username = token_data.get("sub")
    user_id = token_data.get("userID")
    if not username or not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        user_object_id = ObjectId(user_id)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    user = await users_collection.find_one(
        {"_id": user_object_id, "username": username}, {"_id": 0, "hashed_password": 0}
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user["user_id"] = user_object_id
    return user








