import React from "react";

export default function Sidebar({
  notes=[],
  currentId,
  onNewNote,
  onToday,
  onOpenCanvas,
  onOpenGraph,
  onOpenSettings,
  onOpenSearch,
  onOpenNote,
  onToggleStar,
  onToggleTheme,
  isDark,
}) {
  const starred = notes.filter(n=>n.starred);
  const others  = notes.filter(n=>!n.starred);

  return (
    <aside className="sidebar">
      <div className="s-head">
        <div className="s-title">📚 <b>Vault</b></div>
        <div className="s-actions" style={{display:"flex",gap:6}}>
          <button className="btn-icon" title="Сменить тему" onClick={onToggleTheme}>{isDark ? "☀️" : "🌙"}</button>
          <button className="btn-icon" title="Поиск (Ctrl/Cmd+K)" onClick={onOpenSearch}>🔎</button>
          <button className="btn-icon" title="Настройки" onClick={onOpenSettings}>⚙️</button>
        </div>
      </div>

      <div className="quick">
        <button className="btn" onClick={onNewNote}>➕ Новая</button>
        <button className="btn" onClick={onToday}>🗓 Сегодня</button>
        <button className="btn" onClick={onOpenCanvas}>🧩 Холст</button>
        <button className="btn" onClick={onOpenGraph}>🌐 Граф</button>
      </div>

      {starred.length>0 && (
        <div className="section">
          <div className="section-title">Закладки</div>
          <div className="list">
            {starred.map(n=>(
              <div className="note-row" key={n.id}>
                <button className={`note-btn ${n.id===currentId?"is-active":""}`} onClick={()=>onOpenNote(n.id)}>★ {n.title||"Без названия"}</button>
                <button className="star-btn" title="Убрать из закладок" onClick={()=>onToggleStar(n.id)}>☆</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="section">
        <div className="section-title">Заметки</div>
        <div className="list">
          {others.map(n=>(
            <div className="note-row" key={n.id}>
              <button className={`note-btn ${n.id===currentId?"is-active":""}`} onClick={()=>onOpenNote(n.id)}>{n.title||"Без названия"}</button>
              <button className="star-btn" title="В закладки" onClick={()=>onToggleStar(n.id)}>{n.starred ? "★":"☆"}</button>
            </div>
          ))}
        </div>
      </div>

      <div style={{marginTop:"auto",textAlign:"center",color:"var(--muted)",fontSize:11}}>
        dev • минимализм
      </div>
    </aside>
  );
}
