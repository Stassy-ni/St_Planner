const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
export async function askAssistant(msg: string) {
  const r = await fetch(`${BASE}/assistant/ask`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({message: msg})
  });
  return r.json();
}
