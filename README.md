# Doctor Handwriting OCR

A full-stack application for extracting handwritten medical notes. The Next.js interface supports authenticated uploads, review and confirmation of OCR records, and an admin dashboard. The FastAPI backend runs the OCR workflow, stores uploads in MongoDB GridFS, and exposes the dashboard data.

## Stack

- Frontend: JavaScript, Next.js 16, React 19, Tailwind CSS
- Backend: FastAPI, Python 3.13+
- Storage and auth: MongoDB, GridFS, JWT
- OCR: Mistral, then Gemini, with NVIDIA NIM fallback

## Repository layout

```text
legacy-bridge/  Next.js web application
codex_backend/  FastAPI service, OCR workflow, MongoDB access
images/         Sample input images
```

## Prerequisites

- Python 3.13+
- Node.js 20+
- MongoDB
- `NVIDIA_NIM_API_KEY` for the OCR workflow

`MISTRAL_API_KEY` and `GEMINI_API_KEY` are optional OCR provider keys. When configured, OCR tries Mistral first, then Gemini, then NVIDIA NIM as the fallback.

## Configure

Create `codex_backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET=replace-with-a-long-random-secret
MISTRAL_API_KEY=your-key-optional
NVIDIA_NIM_API_KEY=your-key
GEMINI_API_KEY=your-key-optional
JWT_EXPIRE_MINUTES=30
```

Create `legacy-bridge/.env.local` from its `.env.example`:

```env
NEXT_PUBLIC_LEGACY_BRIDGE_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_MOCK_DISPLAY_ACTIONS=false
```

## OCR provider order

Set `MISTRAL_API_KEY` to enable the first provider. The backend attempts:

1. Mistral `mistral-small-latest` when configured
2. Gemini when configured or after Mistral fails
3. NVIDIA NIM as the required final fallback

A failed provider automatically advances to the next one.

## Run locally

Start the API from the repository root:

```powershell
uv sync --project codex_backend
uv run --project codex_backend uvicorn codex_backend.route:app --reload --host 0.0.0.0 --port 8000
```

In a second terminal, start the web app:

```powershell
npm --prefix legacy-bridge install
npm --prefix legacy-bridge run dev
```

Open http://localhost:3000. API documentation is available at http://localhost:8000/docs.

## Features

- Sign-up, login, JWT-protected user routes, and admin-only user listing
- Single and batch image/PDF OCR uploads
- Review and confirmation flow for OCR records stored in GridFS
- Personal confirmed-record list and protected file download
- Admin dashboard for weekly OCR volume, dependency health, and OCR conditions
- Audit-log endpoint for OCR activity

## Dashboard cache

Mongo-backed dashboard results are held in an in-process key/value cache:

- `dashboard:weekly-ocr-volume`
- `dashboard:ocr-system-conditions`

Each endpoint reads its cache key before querying MongoDB. Uploads, record confirmations, and OCR extraction saves clear the cache so the next dashboard request fetches fresh data.

## API highlights

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/auth/signup` | Create an account |
| `POST` | `/auth/login` | Receive a Bearer token |
| `GET` | `/auth/me` | Get the signed-in user |
| POST | /ocr/handwriting | Upload one image or PDF for OCR |
| `POST` | `/ocr/handwriting/cli` | CLI OCR upload stored as `CLI_USER` |
| `POST` | `/ocr/handwriting/batch` | Upload multiple files |
| `POST` | `/ocr/handwriting/{file_id}/confirm` | Confirm reviewed OCR metadata |
| `GET` | `/ocr/records` | List the signed-in user's confirmed records |
| `GET` | `/dashboard/weekly-volume` | Seven-day OCR volume |
| `GET` | `/dashboard/system-health` | Admin dependency checks |
| `GET` | `/dashboard/system-conditions` | Admin OCR metrics |

Protected endpoints require `Authorization: Bearer <token>`. Dashboard health and condition routes require an account whose MongoDB `role` is `Admin`.

## Checks

Run the local regression checks:

```powershell
codex_backend\.venv\Scripts\python.exe -m unittest codex_backend.test_dashboard_cache codex_backend.test_mistral_fallback
```

With the API and MongoDB running, the auth smoke test creates and removes its own account:

```powershell
codex_backend\.venv\Scripts\python.exe codex_backend\test_auth_live.py
```

More request examples are in [codex_backend/api_usage.md](codex_backend/api_usage.md).

## Docker

Set `JWT_SECRET` and `NVIDIA_NIM_API_KEY` (optionally `MISTRAL_API_KEY` and `GEMINI_API_KEY`) in `codex_backend/.env`, then run:

```powershell
docker compose up --build
```

The frontend is available at http://localhost:3000 and the API at http://localhost:8000. The container reads `codex_backend/.env`, connects to the existing MongoDB specified by `MONGODB_URI`, and builds the frontend with mock actions disabled.
