# Construction Defects System

Монолитное веб‑приложение для учёта дефектов на строительных объектах: от регистрации и назначения до контроля статусов и отчётности.

## Стек

- Backend: FastAPI, SQLAlchemy, PostgreSQL (или SQLite для dev)
- Frontend: React + Vite + TypeScript + Redux Toolkit
- Auth: OAuth2 Password (JWT)
- Docker: docker compose (db, backend, frontend)

## Возможности

- Регистрация/вход, хранение паролей в bcrypt
- Роли и доступы: admin, manager, engineer, observer
- Проекты: создание (manager/admin), список
- Дефекты: создание (любой авторизованный), изменение (manager/engineer)
- Пользователи:
  - Список: admin/manager
  - Создание: admin/manager
  - Смена роли: только admin
  - Удаление: только admin; нельзя удалять себя и любого `admin`
- UI:
  - Светлая/тёмная тема (переключатель в шапке, сохраняется)
  - Страница логина всегда светлая
  - Читаемые уведомления в обоих режимах
  - Управление ролями с поиском, бейджами, аккуратным UI

## Быстрый старт

### Вариант 1: Docker (рекомендуется)

Требуется Docker Desktop (Windows/macOS) или Docker + Compose (Linux).

```bash
docker compose up --build
```

По умолчанию:
- Frontend: http://localhost:3000
- Backend (Swagger): http://localhost:9000/docs
- PostgreSQL внутри compose (порт хоста 5433)

Если порты заняты — исправьте `docker-compose.yml` (3000/9000/5433).

### Вариант 2: Локальная разработка

Backend:
```bash
cd backend
python -m venv .venv
# PowerShell:
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# SQLite dev:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend:
```bash
cd frontend
npm install
npm run dev
# Vite поднимет http://localhost:3000
```

Переменные окружения:
- Backend:
  - `DATABASE_URL` (по умолчанию `sqlite:///./dev.db`, в Docker — Postgres)
  - `SECRET_KEY`
- Frontend:
  - `VITE_API_URL` (по умолчанию `http://localhost:9000` в Docker compose)

## Тестовые аккаунты

- admin / admin123 — Администратор
- manager / admin123 — Менеджер
- engineer / user123 — Инженер
- observer / view123 — Наблюдатель

## Матрица доступов (сжатая)

- Пользователи:
  - Список, создание: admin, manager
  - Смена роли: только admin
  - Удаление: только admin; запрет — себя и любого `admin`
- Проекты:
  - Создание: manager, admin
  - Список: все авторизованные
- Дефекты:
  - Создание: все авторизованные
  - Обновление: manager, engineer

## API — основные эндпоинты

- Auth
  - `POST /auth/token` — вход (form-urlencoded)
  - `POST /auth/register` — регистрация (всегда создаёт observer)
- Users
  - `GET /users/` — список (admin/manager)
  - `POST /users/` — создать (admin/manager)
  - `GET /users/me` — текущий пользователь
  - `PUT /users/{id}/role` — смена роли (admin)
  - `DELETE /users/{id}` — удалить (admin; нельзя удалить admin и себя)
- Projects
  - `POST /projects/` — создать (manager/admin)
  - `GET /projects/` — список
- Defects
  - `POST /defects/` — создать
  - `GET /defects/` — список (фильтры по статусу/проекту)
  - `PUT /defects/{id}` — обновить (manager/engineer)

## Темы и UI

- Тёмная/светлая тема через CSS‑переменные:
  - `:root` — светлая, `body.alt-theme` — тёмная
  - Переключатель в шапке, сохраняется в `localStorage`
- Страница логина всегда светлая
- Уведомления читаемы (фон/текст зависят от переменных темы)

## Скрипты

Frontend:
```bash
npm run dev        # dev server
npm run build      # prod сборка
# при наличии скриптов:
npm run lint       # линт
npm run type-check # проверка типов
```

Backend:
```bash
uvicorn app.main:app --reload
python -m pytest   # тесты (если настроены)
```

## Резервное копирование БД (пример)

Postgres (из хоста):
```bash
docker exec -t framework-db-1 pg_dump -U defects_user defects_db > backup.sql
```

SQLite dev:
```bash
# файл backend/dev.db скопируйте как артефакт
```

## Траблшутинг

- Docker не стартует: проверьте, запущен ли Docker Desktop.
- 401 при логине:
  - Неверный логин/пароль — сообщение выводится без перезагрузки.
- “qсgit” в терминале:
  - Смените раскладку клавиатуры на EN (иногда вводится "qсgit" вместо "git").

## Безопасность

- Пароли — bcrypt
- Запрет критичных операций: удаление admin, удаление себя
- JWT токены
- Рекомендовано: ограничить CORS доменами, включить rate‑limit (по задачам)

## Лицензия

Для учебных и демонстрационных целей.