import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import ReactMarkdown from "react-markdown";

type Note = { id: string; title: string; text: string; date?: string };

export default function Notes(){
  const [notes, setNotes] = useState<Note[]>([
    { id:"n1", title:"2ВкШ-11 — Домашки", text:"Собрать фото в папку `КПК/…/Домашние задания`.\n- проверить 3 работы\n- отметить комментарии" },
    { id:"n2", title:"Идеи к занятию", text:"- кейсы\n- дискуссия в парах\n- рефлексия" },
  ]);
  const [draft, setDraft] = useState<Note>({ id:"new", title:"", text:"" });

  const allForSidebar = useMemo(()=>notes, [notes]);

  function saveNote(){
    if(!draft.title && !draft.text) return;
    const nn = { ...draft, id: `n${Date.now()}` };
    setNotes([nn, ...notes]);
    setDraft({ id:"new", title:"", text:"" });
  }

  function makeBold(){
    setDraft(d => ({...d, text: d.text + (d.text.endsWith(" ") ? "**жирный** " : " **жирный** ")}));
  }
  function makeList(){
    setDraft(d => ({...d, text: d.text + "\n- пункт 1\n- пункт 2"}));
  }

  return (
    <Layout title="Заметки" allNotes={allForSidebar}>
      <div style={{display:"grid", gap:16}}>
        <div style={{border:"1px solid #eee", borderRadius:16, padding:12}}>
          <div style={{display:"flex", gap:8, alignItems:"center", marginBottom:8}}>
            <input
              placeholder="Заголовок"
              value={draft.title}
              onChange={e=>setDraft({...draft, title:e.target.value})}
              style={{flex:1, padding:8, border:"1px solid #ddd", borderRadius:10}}
            />
            <button onClick={makeBold} style={{padding:"8px 10px"}}><b>B</b></button>
            <button onClick={makeList} style={{padding:"8px 10px"}}>•</button>
            <button onClick={saveNote} style={{padding:"8px 12px", background:"#10b981", color:"#fff", border:"none", borderRadius:10}}>Сохранить</button>
          </div>
          <textarea
            placeholder="Текст заметки (поддерживается markdown: **жирный**, списки, заголовки)"
            value={draft.text}
            onChange={e=>setDraft({...draft, text:e.target.value})}
            rows={8}
            style={{width:"100%", padding:10, border:"1px solid #ddd", borderRadius:10}}
          />
        </div>

        <div style={{border:"1px solid #eee", borderRadius:16, padding:12}}>
          <div style={{fontWeight:600, marginBottom:8}}>Превью</div>
          <div style={{padding:12, border:"1px dashed #ddd", borderRadius:10}}>
            <ReactMarkdown>{draft.text || "_пока пусто_"}</ReactMarkdown>
          </div>
        </div>

        <div style={{border:"1px solid #eee", borderRadius:16, padding:12}}>
          <div style={{fontWeight:600, marginBottom:8}}>Мои заметки</div>
          <div style={{display:"grid", gap:8}}>
            {notes.map(n=>(
              <div key={n.id} style={{border:"1px solid #f1f1f1", borderRadius:12, padding:10}}>
                <div style={{fontWeight:600, marginBottom:4}}>{n.title || "Без названия"}</div>
                <div style={{opacity:.75, whiteSpace:"pre-wrap"}}><ReactMarkdown>{n.text}</ReactMarkdown></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
