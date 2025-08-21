import React, { useEffect, useMemo, useState } from "react";

export default function CommandPalette({ isOpen, onClose, notes, onOpenNote, onCreate }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);

  const items = useMemo(()=>{
    const s = q.trim().toLowerCase();
    if(!s) return notes;
    return notes.filter(n=>(n.title||"").toLowerCase().includes(s) || (n.content||"").toLowerCase().includes(s));
  },[q, notes]);

  useEffect(()=>{
    if(!isOpen) return;
    const onKey=(e)=>{
      if(e.key==="Escape") onClose();
      if(e.key==="ArrowDown"){ e.preventDefault(); setSel(v=>Math.min(v+1, Math.max(0, items.length-1))); }
      if(e.key==="ArrowUp"){ e.preventDefault(); setSel(v=>Math.max(v-1, 0)); }
      if(e.key==="Enter"){
        const it = items[sel];
        if(it) onOpenNote(it.id); else onCreate(q||"Новая заметка");
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return ()=>window.removeEventListener("keydown", onKey);
  },[isOpen, items, sel, q, onOpenNote, onCreate, onClose]);

  useEffect(()=>setSel(0), [q]);

  if(!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="cp-box" onClick={(e)=>e.stopPropagation()}>
        <div className="cp-search">
          <input
            className="cp-input"
            autoFocus
            placeholder="Поиск… Введите имя и нажмите Enter, чтобы создать"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
          />
        </div>
        <div className="cp-list">
          {items.map((n,i)=>(
            <button
              key={n.id}
              className="cp-item"
              style={{background: i===sel ? "var(--panel)" : "transparent"}}
              onMouseEnter={()=>setSel(i)}
              onClick={()=>{ onOpenNote(n.id); onClose(); }}
            >
              {n.title||"Без названия"}
            </button>
          ))}
          {items.length===0 && <div className="cp-item">Ничего не найдено. Нажмите <b>Enter</b> чтобы создать «{q||"Новая заметка"}».</div>}
        </div>
        <div className="cp-footer">
          <button className="btn" onClick={()=>{ onCreate(q||"Новая заметка"); onClose(); }}>Создать</button>
          <button className="btn" onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
}
