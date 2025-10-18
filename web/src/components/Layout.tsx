import React, { ReactNode, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Note = { id: string; title: string; text: string; date?: string };

type LayoutProps = {
  title: string;
  children: ReactNode;
  allNotes?: Note[];        // для блока «Похожие заметки»
};

function similarNotes(all: Note[] = [], q: string) {
  if (!q) return [];
  const s = q.toLowerCase();
  // примитивный скоринг: совпадение по словам > 3 символов
  return all
    .map(n => {
      const text = (n.title + " " + n.text).toLowerCase();
      const hits = s.split(/\s+/).filter(w => w.length > 3 && text.includes(w)).length;
      return { n, hits };
    })
    .filter(x => x.hits > 0)
    .sort((a,b) => b.hits - a.hits)
    .slice(0, 5)
    .map(x => x.n);
}

export default function Layout({ title, children, allNotes = [] }: LayoutProps) {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [query, setQuery] = useState("");

  const matches = useMemo(() => similarNotes(allNotes, query), [allNotes, query]);

  return (
    <div style={{display:"grid", gridTemplateColumns:"1fr 320px", gap:24, maxWidth:1200, margin:"0 auto", padding:"16px 16px 88px"}}>
      <main>
        <h1 style={{fontSize:24, fontWeight:700, marginBottom:12}}>{title}</h1>
        <div>{children}</div>
      </main>

      <aside style={{position:"sticky", top:16, height:"fit-content"}}>
        <div style={{border:"1px solid #eee", borderRadius:16, padding:12, marginBottom:12}}>
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8}}>
            <div style={{fontWeight:600}}>Календарь</div>
            {selected && <div style={{opacity:.7, fontSize:12}}>
              {selected.toLocaleDateString("ru-RU")}
            </div>}
          </div>
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={setSelected}
            weekStartsOn={1}
            showOutsideDays
          />
        </div>

        <div style={{border:"1px solid #eee", borderRadius:16, padding:12, marginBottom:12}}>
          <div style={{fontWeight:600, marginBottom:8}}>Похожие заметки</div>
          <input
            placeholder="Поиск по заметкам…"
            value={query}
            onChange={e=>setQuery(e.target.value)}
            style={{width:"100%", padding:"8px 10px", border:"1px solid #ddd", borderRadius:10, marginBottom:8}}
          />
          {matches.length === 0 ? (
            <div style={{opacity:.6, fontSize:13}}>Ничего похожего не нашли.</div>
          ) : (
            <ul style={{display:"grid", gap:8, listStyle:"none", padding:0, margin:0}}>
              {matches.map(n=>(
                <li key={n.id} style={{border:"1px solid #f1f1f1", borderRadius:12, padding:10}}>
                  <div style={{fontWeight:600, fontSize:14, marginBottom:4}}>{n.title || "Без названия"}</div>
                  <div style={{opacity:.7, fontSize:13, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
                    {n.text?.slice(0,120)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{border:"1px solid #eee", borderRadius:16, padding:12}}>
          <div style={{fontWeight:600, marginBottom:8}}>Меню</div>
          <div style={{display:"grid", gap:6, fontSize:14}}>
            <a href="/">Сегодня</a>
            <a href="/calendar">Календарь</a>
            <a href="/notes">Заметки</a>
            <a href="/files">Файлы</a>
            <a href="/assistant">Ассистент</a>
          </div>
        </div>
      </aside>

      <nav style={{position:"fixed", bottom:0, left:0, right:0, borderTop:"1px solid #eee", background:"#fff"}}>
        <div style={{display:"flex", gap:12, padding:12, justifyContent:"center"}}>
          <a href="/">Сегодня</a> · <a href="/calendar">Календарь</a> · <a href="/notes">Заметки</a> · <a href="/files">Файлы</a> · <a href="/assistant">Ассистент</a>
        </div>
      </nav>
    </div>
  );
}
