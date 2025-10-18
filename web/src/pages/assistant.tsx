import Layout from "../components/Layout";
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
    <Layout title="Ассистент">
      <div style={{display:"flex", flexDirection:"column", gap:8}}>
        {messages.map((m,i)=>(
          <div key={i}
               style={{alignSelf:m.role==="user"?"flex-end":"flex-start",
                       background:m.role==="user"?"#eef6ff":"#f9fafb",
                       padding:12, borderRadius:16, maxWidth:"80%"}}>
            {m.text}
          </div>
        ))}
        <div style={{display:"flex", gap:8, marginTop:8}}>
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Спроси…"
                 style={{flex:1, padding:12, borderRadius:12, border:"1px solid #ddd"}}/>
          <button onClick={send} style={{padding:"12px 16px", borderRadius:12, background:"#f59e0b", color:"#fff", border:"none"}}>Отправить</button>
        </div>
      </div>
    </Layout>
  );
}
