# 🚀 Настройка идеальной среды разработки

## ✅ Что уже работает

- **Backend API**: http://localhost:8000/docs (Swagger UI)
- **PostgreSQL**: порт 5433 (изменили с 5432 из-за конфликта)
- **База данных**: создается автоматически
- **Frontend**: http://localhost:3000 (React + Vite + Redux)

## 🛠️ Рекомендуемые расширения VS Code

### Обязательные для vibe-coding:
1. **Live Server** - для hot-reload HTML/CSS
2. **Auto Rename Tag** - автоматическое переименование тегов
3. **Bracket Pair Colorizer** - цветные скобки
4. **Indent Rainbow** - цветные отступы
5. **Prettier** - автоформатирование кода
6. **ESLint** - проверка JavaScript/TypeScript
7. **Thunder Client** - тестирование API прямо в VS Code
8. **REST Client** - альтернатива Postman
9. **GitLens** - улучшенная работа с Git
10. **Error Lens** - показ ошибок прямо в коде

### Дополнительные для комфорта:
- **Material Icon Theme** - красивые иконки файлов
- **One Dark Pro** - темная тема
- **Power Mode** - эффекты при печати
- **Rainbow CSV** - цветные CSV файлы
- **Todo Tree** - отслеживание TODO в коде

## 🎯 Настройка рабочего пространства

### Вариант 1: VS Code Workspace (рекомендуется)
1. Создайте файл `framework.code-workspace`:
```json
{
  "folders": [
    {
      "path": "."
    }
  ],
  "settings": {
    "workbench.colorTheme": "One Dark Pro",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    },
    "liveServer.settings.port": 3000,
    "liveServer.settings.root": "/frontend",
    "files.exclude": {
      "**/node_modules": true,
      "**/.venv": true,
      "**/__pycache__": true
    }
  },
  "extensions": {
    "recommendations": [
      "ritwickdey.liveserver",
      "formulahendry.auto-rename-tag",
      "coenraads.bracket-pair-colorizer-2",
      "oderwat.indent-rainbow",
      "esbenp.prettier-vscode",
      "dbaeumer.vscode-eslint",
      "rangav.vscode-thunder-client",
      "humao.rest-client",
      "eamodio.gitlens",
      "usernamehw.errorlens"
    ]
  }
}
```

### Вариант 2: Split View в VS Code
1. Откройте папку `D:\framework`
2. Нажмите `Ctrl+Shift+P` → "View: Split Editor Right"
3. В левой панели откройте файлы бэкенда
4. В правой панели откройте файлы фронтенда
5. Используйте `Ctrl+1` и `Ctrl+2` для переключения между панелями

## 🔥 Hot Reload настройка

### Backend (FastAPI)
- Автоматическая перезагрузка при изменении файлов
- Swagger UI обновляется автоматически
- Логи в реальном времени

### Frontend (Vite + React)
- Мгновенная перезагрузка при изменении CSS
- Hot Module Replacement для React компонентов
- Сохранение состояния при изменениях

## 🎨 Стили и CSS

Все стили находятся в `frontend/src/styles/index.css`:
- Современный дизайн с градиентами
- Адаптивная верстка
- Анимации и переходы
- Темная тема с прозрачностью

### Быстрые изменения стилей:
1. Откройте `frontend/src/styles/index.css`
2. Изменения применяются мгновенно
3. Используйте браузерные DevTools для экспериментов
4. Копируйте CSS из DevTools в файл

## 🚀 Команды для запуска

### Полный стек (Docker)
```bash
docker compose up --build
```

### Локальная разработка
```bash
# Backend (в одном терминале)
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend (в другом терминале)
cd frontend
npm install
npm run dev
```

## 🎯 Workflow для vibe-coding

1. **Откройте VS Code** с workspace файлом
2. **Запустите сервисы** (Docker или локально)
3. **Откройте браузер** на http://localhost:3000
4. **Настройте окна**:
   - VS Code слева (код)
   - Браузер справа (результат)
   - Терминал снизу (логи)
5. **Начинайте кодить** - изменения видны мгновенно!

## 🔧 Полезные команды

### Backend
```bash
# Запуск тестов
cd backend
python -m pytest

# Создание миграции
alembic revision --autogenerate -m "description"

# Применение миграций
alembic upgrade head
```

### Frontend
```bash
# Установка зависимостей
npm install

# Сборка для продакшена
npm run build

# Предварительный просмотр сборки
npm run preview
```

## 🎨 Тестовые аккаунты

- **manager/managerpass** - Менеджер (полный доступ)
- **engineer/engineerpass** - Инженер (создание дефектов)
- **observer/observerpass** - Наблюдатель (только просмотр)

## 🚨 Решение проблем

### Порт 5432 занят
```bash
# Остановить PostgreSQL
net stop postgresql-x64-13
# или изменить порт в docker-compose.yml на 5433
```

### Frontend не запускается
```bash
# Очистить кэш
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Backend ошибки
```bash
# Переустановить зависимости
cd backend
pip install -r requirements.txt --force-reinstall
```

## 🎯 Готово к vibe-coding!

Теперь у вас есть:
- ✅ Полнофункциональное приложение
- ✅ Hot-reload для всех изменений
- ✅ Красивый современный UI
- ✅ Автоматические тесты
- ✅ API документация
- ✅ Идеальная среда разработки

**Начинайте кодить и наслаждайтесь процессом! 🚀**
