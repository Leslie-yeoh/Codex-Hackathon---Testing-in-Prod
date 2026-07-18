"""Authentication routes."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, status

from codex_backend.services.auth import (
    LoginRequest,
    SignupRequest,
    TokenResponse,
    UserResponse,
    get_current_user,
    list_users,
    login_user,
    signup_user,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(payload: SignupRequest) -> UserResponse:
    """Create a new user account."""

    return await signup_user(payload)


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest) -> TokenResponse:
    """Authenticate a user and return a JWT access token."""

    return await login_user(payload)

@router.get("/me", response_model=UserResponse)
async def me(current_user: dict[str, Any] = Depends(get_current_user)) -> UserResponse:
    """Return the current authenticated user."""

    return UserResponse(
        username=current_user["username"],
        email=current_user.get("email", ""),
        role=current_user.get("role", "User"),
    )



@router.get("/users", response_model=list[UserResponse])
async def users(current_user: dict[str, Any] = Depends(get_current_user)) -> list[UserResponse]:
    """List MongoDB users for administrators."""

    return await list_users(current_user)
