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
