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
