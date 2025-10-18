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
