from openai import OpenAI
from .config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def ask_gpt(prompt: str) -> str:
    """
    Пытаемся сначала через Responses API (если доступен),
    иначе надёжно пользуемся Chat Completions API.
    """
    # 1) Responses API (новый), если доступен в твоей среде
    try:
        if hasattr(client, "responses"):
            resp = client.responses.create(
                model="gpt-4.1-mini",
                input=[
                    {"role": "system", "content": "Ты встроенный ассистент Stassy Planner. Отвечай кратко и по делу."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2
            )
            # у Responses есть удобное поле:
            return (getattr(resp, "output_text", "") or "").strip()
    except Exception:
        # просто упадём во 2-й путь
        pass

    # 2) Chat Completions API (стабильный и везде есть)
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Ты встроенный ассистент Stassy Planner. Отвечай кратко и по делу."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2
    )
    return resp.choices[0].message.content.strip()
