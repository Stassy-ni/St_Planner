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
