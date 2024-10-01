# Construction Defects System

Монолитное веб-приложение для учёта дефектов на строительных объектах.

## Стек
- Backend: FastAPI, SQLAlchemy, PostgreSQL (или SQLite для локального dev)
- Frontend: React + Vite + TypeScript
- Тесты: pytest, FastAPI TestClient

## Быстрый старт (локально)
1. Скопировать репозиторий.
2. Создать `.env` из `.env.example`.
3. Запустить backend:
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
