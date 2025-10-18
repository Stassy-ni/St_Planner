#!/usr/bin/env bash
set -e

echo "📁 Создаю структуру проекта..."
mkdir -p server bot web/public/icons web/src/{pages,lib}

cat > .gitignore <<'EOF'
__pycache__/
.venv/
node_modules/
.next/
.env
*.log
EOF

cat > .env <<'EOF'
# ===== OpenAI =====
OPENAI_API_KEY=sk-ВСТАВЬ_СВОЙ_КЛЮЧ

# ===== Telegram =====
TELEGRAM_BOT_TOKEN=ВСТАВЬ_ТОКЕН_БОТА

# ===== Google (добавим позже, placeholders) =====
GOOGLE_APPLICATION_CREDENTIALS=./data/google-credentials.json
CALENDAR_ID=primary
GDRIVE_ROOT_FOLDER_NAME=КПК
GSPREAD_SHEET_NAME=StassyPlanner_Master

# ===== General =====
TZ=Europe/Moscow
TEACHER_NAME=Нигматуллина А.Р.

# ===== Web/Server =====
NEXT_PUBLIC_API_BASE=http://localhost:8000
EOF

cat > README.md <<'EOF'
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
EOF

echo "🧠 Пишу сервер (FastAPI + OpenAI)..."
cat > server/requirements.txt <<'EOF'
fastapi==0.115.2
uvicorn==0.32.0
python-dotenv==1.0.1
openai==1.52.0
pydantic==2.9.2
EOF

cat > server/__init__.py <<'EOF'
# empty
EOF

cat > server/config.py <<'EOF'
import os
from dotenv import load_dotenv
load_dotenv()

class Settings:
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY","")
settings = Settings()
EOF

cat > server/assistant.py <<'EOF'
from openai import OpenAI
from .config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def ask_gpt(prompt: str) -> str:
    resp = client.responses.create(
        model="gpt-4.1-mini",
        input=[
            {"role":"system","content":"Ты встроенный ассистент Stassy Planner. Отвечай кратко и по делу."},
            {"role":"user","content":prompt}
        ],
        temperature=0.2
    )
    return resp.output_text.strip()
EOF

cat > server/app.py <<'EOF'
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .assistant import ask_gpt

app = FastAPI(title="Stassy Planner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"], allow_credentials=True
)

class AskBody(BaseModel):
    message: str

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/assistant/ask")
def assistant_ask(body: AskBody):
    answer = ask_gpt(body.message)
    return {"answer": answer}
EOF

echo "🤖 Пишу Telegram-бота (aiogram v3)..."
cat > bot/requirements.txt <<'EOF'
aiogram==3.6.0
python-dotenv==1.0.1
aiohttp==3.10.10
EOF

cat > bot/main.py <<'EOF'
import os, asyncio, aiohttp
from aiogram import Bot, Dispatcher, F
from aiogram.types import Message
from dotenv import load_dotenv

load_dotenv()
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
API_BASE = os.getenv("NEXT_PUBLIC_API_BASE","http://localhost:8000")
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

@dp.message(F.text)
async def on_text(m: Message):
    async with aiohttp.ClientSession() as s:
        r = await s.post(f"{API_BASE}/assistant/ask", json={"message": m.text})
        data = await r.json()
    await m.reply(data.get("answer","(нет ответа)"))

async def main():
    print("Bot started")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
EOF

echo "🕸️ Пишу веб-клиент (Next.js PWA, минимально)..."
cat > web/package.json <<'EOF'
{
  "name": "stassy-web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000"
  },
  "dependencies": {
    "next": "14.2.7",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "type": "module"
}
EOF

cat > web/next.config.mjs <<'EOF'
export default {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"
  }
};
EOF

cat > web/public/manifest.webmanifest <<'EOF'
{
  "name": "Stassy Planner",
  "short_name": "Stassy",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F9F9FB",
  "theme_color": "#F9CC3D",
  "icons": [
    {"src": "/icons/icon-192.png","sizes": "192x192","type":"image/png"},
    {"src": "/icons/icon-512.png","sizes": "512x512","type":"image/png"}
  ]
}
EOF

cat > web/public/sw.js <<'EOF'
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
EOF

# простые пустые иконки-заглушки
: > web/public/icons/icon-192.png
: > web/public/icons/icon-512.png

cat > web/src/lib/api.ts <<'EOF'
const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
export async function askAssistant(msg: string) {
  const r = await fetch(`${BASE}/assistant/ask`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({message: msg})
  });
  return r.json();
}
EOF

cat > web/src/pages/index.tsx <<'EOF'
export default function Today(){
  return (
    <main style={{padding:"16px", paddingBottom: 80}}>
      <h1>Сегодня</h1>
      <p>Здесь появится лента пар/дедлайнов.</p>
      <nav style={{position:'fixed', bottom:0, left:0, right:0, padding:12, borderTop:"1px solid #eee", background:"#fff"}}>
        <a href="/">Сегодня</a> · <a href="/calendar">Календарь</a> · <a href="/notes">Заметки</a> · <a href="/files">Файлы</a> · <a href="/assistant">Ассистент</a>
      </nav>
    </main>
  );
}
EOF

cat > web/src/pages/assistant.tsx <<'EOF'
import { useState } from "react";
import { askAssistant } from "../lib/api";

export default function Assistant(){
  const [messages,setMessages] = useState<{role:"user"|"assistant",text:string}[]>([]);
  const [input,setInput] = useState("");

  async function send(){
    if(!input.trim()) return;
    setMessages(m=>[...m,{role:"user",text:input}]);
    const res = await askAssistant(input);
    setMessages(m=>[...m,{role:"assistant",text:res.answer||"(без ответа)"}]);
    setInput("");
  }

  return (
    <main style={{padding:"16px", paddingBottom: 80, maxWidth: 720, margin: "0 auto"}}>
      <h1>Ассистент</h1>
      <div style={{display:"flex", flexDirection:"column", gap:8}}>
        {messages.map((m,i)=><div key={i} style={{alignSelf:m.role==="user"?"flex-end":"flex-start", background:m.role==="user"?"#fde68a":"#f3f4f6", padding:12, borderRadius:16, maxWidth:"80%"}}>{m.text}</div>)}
      </div>
      <div style={{position:'fixed', bottom:56, left:0, right:0, padding:12}}>
        <div style={{display:"flex", gap:8, maxWidth:720, margin:"0 auto"}}>
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Спроси…" style={{flex:1, padding:12, borderRadius:12, border:"1px solid #ddd"}}/>
          <button onClick={send} style={{padding:"12px 16px", borderRadius:12, background:"#f59e0b", color:"#fff", border:"none"}}>Отправить</button>
        </div>
      </div>
      <nav style={{position:'fixed', bottom:0, left:0, right:0, padding:12, borderTop:"1px solid #eee", background:"#fff"}}>
        <a href="/">Сегодня</a> · <a href="/calendar">Календарь</a> · <a href="/notes">Заметки</a> · <a href="/files">Файлы</a> · <a href="/assistant">Ассистент</a>
      </nav>
    </main>
  );
}
EOF

cat > web/src/pages/calendar.tsx <<'EOF'
export default function Cal(){ return <main style={{padding:16}}>Календарь (скоро)</main>; }
EOF
cat > web/src/pages/notes.tsx <<'EOF'
export default function Notes(){ return <main style={{padding:16}}>Заметки (скоро)</main>; }
EOF
cat > web/src/pages/files.tsx <<'EOF'
export default function Files(){ return <main style={{padding:16}}>Файлы (скоро)</main>; }
EOF

echo "✅ Готово. Теперь:
1) Открой файл .env и вставь свои ключи (OPENAI_API_KEY, TELEGRAM_BOT_TOKEN).
2) Запускай:
   # вкладка 1
   python -m venv .venv && source .venv/bin/activate
   pip install -r server/requirements.txt
   uvicorn server.app:app --reload --port 8000

   # вкладка 2
   source .venv/bin/activate
   pip install -r bot/requirements.txt
   python bot/main.py

   # вкладка 3
   cd web
   npm install
   npm run dev

http://localhost:3000 откроется веб-клиент.
В Telegram напиши своему боту — ассистент ответит.
"
