# Stassy Planner (MVP без Docker)

## Запуск
1) Вставь ключи в .env (OPENAI_API_KEY, TELEGRAM_BOT_TOKEN)
2) Открой три вкладки Git Bash:

### Вкладка 1 — сервер API:
python -m venv .venv && source .venv/bin/activate
pip install -r server/requirements.txt
uvicorn server.app:app --reload --port 8000

### Вкладка 2 — Telegram-бот:
source .venv/bin/activate
pip install -r bot/requirements.txt
python bot/main.py

### Вкладка 3 — веб-клиент:
cd web
npm install
npm run dev

Открой http://localhost:3000
Напиши своему боту любое сообщение — ответит ассистент.

_______________________________________________
Запускайте скрипты из папки проекта, а не копируя их содержимое. Например, чтобы поднять сервер:

Как запустить весь проект

Открой три отдельные вкладки/окна PowerShell и в каждой сделай:

1) API-сервер
cd C:\Users\anert\Desktop\plan\St_Planner
.\start_server.ps1


Ожидаешь в логах что-то вроде:

Uvicorn running on http://127.0.0.1:8000
Application startup complete.


Проверка в браузере: http://127.0.0.1:8000/health
 → {"ok":true}

_____________________________________-
Аналогично, во втором окне PowerShell:

2) Телеграм-бот
cd C:\Users\anert\Desktop\plan\St_Planner
.\start_bot.ps1


Ожидаешь в выводе: Bot started

__________________________________
И в третьем — веб‑клиент:

3) Веб-клиент (Next.js)
cd C:\Users\anert\Desktop\plan\St_Planner
# только если не ставила пакеты ранее:
npm install --prefix .\web
.\start_web.ps1


Ожидаешь:

Local: http://localhost:3000


Проверка: http://localhost:3000/assistant

__________________________--
Скрипт start_server.ps1 сам активирует виртуальное окружение и запускает Uvicorn; start_bot.ps1 — бота; start_web.ps1 — Next.js‑клиент. Поэтому не нужно вручную вызывать .\.venv\Scripts\Activate.ps1 и python -m uvicorn….