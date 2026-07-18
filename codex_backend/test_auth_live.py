"""Run a live signup, login, and current-user authentication smoke check."""

from __future__ import annotations

import os
from pathlib import Path
from uuid import uuid4

import httpx
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv(Path(__file__).with_name(".env"))

base_url = os.getenv("AUTH_BASE_URL", "http://127.0.0.1:8000").rstrip("/")
mongo_uri = os.getenv("MONGO_URI") or os.getenv("MONGODB_URI")
if not mongo_uri:
    raise RuntimeError("MONGO_URI or MONGODB_URI must be set")

suffix = uuid4().hex
email = f"auth-smoke-{suffix}@example.test"
password = "AuthSmoke!123"
username = f"auth-smoke-{suffix}"
users = MongoClient(mongo_uri)["codex"]["users"]

try:
    signup = httpx.post(
        f"{base_url}/auth/signup",
        json={
            "username": username,
            "email": email,
            "password": password,
            "confirm_password": password,
        },
        timeout=10,
    )
    assert signup.status_code == 201, signup.text
    assert users.find_one({"email": email})["role"] == "User"

    login = httpx.post(
        f"{base_url}/auth/login",
        json={"email": email, "password": password},
        timeout=10,
    )
    assert login.status_code == 200, login.text
    token = login.json()["access_token"]

    current_user = httpx.get(
        f"{base_url}/auth/me",
        headers={"Authorization": f"Bearer {token}"},
        timeout=10,
    )
    assert current_user.status_code == 200, current_user.text
    assert current_user.json() == {"username": username, "email": email, "role": "User"}
    assert httpx.get(
        f"{base_url}/dashboard/system-health",
        headers={"Authorization": f"Bearer {token}"},
        timeout=10,
    ).status_code == 403
    users.update_one({"email": email}, {"$set": {"role": "Admin"}})
    admin_login = httpx.post(
        f"{base_url}/auth/login",
        json={"email": email, "password": password},
        timeout=10,
    )
    admin_user = httpx.get(
        f"{base_url}/auth/me",
        headers={"Authorization": f"Bearer {admin_login.json()['access_token']}"},
        timeout=10,
    )
    assert admin_user.status_code == 200, admin_user.text
    assert admin_user.json()["role"] == "Admin"
    user_list = httpx.get(
        f"{base_url}/auth/users",
        headers={"Authorization": f"Bearer {admin_login.json()['access_token']}"},
        timeout=10,
    )
    assert user_list.status_code == 200, user_list.text
    assert {"username": username, "email": email, "role": "Admin"} in user_list.json()
    system_health = httpx.get(
        f"{base_url}/dashboard/system-health",
        headers={"Authorization": f"Bearer {admin_login.json()['access_token']}"},
        timeout=10,
    )
    assert system_health.status_code == 200, system_health.text
    assert {item["name"] for item in system_health.json()} == {
        "Backend API", "MongoDB", "Gemini", "NVIDIA"
    }

    assert httpx.post(
        f"{base_url}/auth/login",
        json={"email": email, "password": "wrong-password"},
        timeout=10,
    ).status_code == 401
    assert httpx.get(f"{base_url}/auth/me", timeout=10).status_code == 401
finally:
    users.delete_one({"email": email})
    users.database.client.close()

print("Auth smoke check passed.")