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
