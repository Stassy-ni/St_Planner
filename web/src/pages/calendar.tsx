import Layout from "../components/Layout";

export default function CalendarPage(){
  return (
    <Layout title="Календарь">
      <div style={{border:"1px solid #eee", borderRadius:16, padding:12}}>
        Здесь будет календарь занятий и дедлайнов (синхрон с Apple/Google — на следующих шагах).
      </div>
    </Layout>
  );
}
