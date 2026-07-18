FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim

WORKDIR /app
COPY codex_backend /app/codex_backend
RUN uv sync --project /app/codex_backend --frozen --no-dev --no-install-project

ENV PATH="/app/codex_backend/.venv/bin:$PATH"
CMD ["uvicorn", "codex_backend.route:app", "--host", "0.0.0.0", "--port", "8000"]