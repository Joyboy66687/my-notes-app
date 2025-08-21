import React, { useEffect, useMemo, useState } from "react";
import { useNotes } from "../state/NotesContext";

export default function CommandPalette({ isOpen, onClose }) {
  const { state, dispatch } = useNotes();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") { e.preventDefault(); setSel(s => Math.min(s+1, items.length-1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setSel(s => Math.max(s-1, 0)); }
      if (e.key === "Enter") {
        if (items[sel]) open(items[sel].id);
        else create(q || "Новая заметка");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, sel, q]);

  const items = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return state.notes;
    return state.notes.filter(n => n.title.toLowerCase().includes(s) || n.content.toLowerCase().includes(s));
  }, [q, state.notes]);

  const open = (id) => { dispatch({ type: "SET_CURRENT", id }); onClose(); };
  const create = (title) => { dispatch({ type: "ADD_NOTE", title }); onClose(); };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-20" onClick={onClose}>
      <div className="w-[680px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden" onClick={(e)=>e.stopPropagation()}>
        <div className="p-3 border-b border-black/10 dark:border-white/10">
          <input
            autoFocus
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder="Поиск или имя новой заметки…"
            className="w-full bg-transparent outline-none"
          />
        </div>
        <div className="max-h-80 overflow-auto">
          {items.map((n,i)=>(
            <button
              key={n.id}
              onClick={()=>open(n.id)}
              className={`w-full text-left px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10 ${i===sel?"bg-black/5 dark:bg-white/10":""}`}
            >
              {n.title}
            </button>
          ))}
          {items.length===0 && (
            <div className="p-3 text-sm opacity-70">Нажмите <b>Enter</b>, чтобы создать «{q}»</div>
          )}
        </div>
        <div className="p-2 border-t border-black/10 dark:border-white/10 text-right">
          <button onClick={()=>create(q||"Новая заметка")} className="px-3 py-1 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20">
            Создать «{q||"Новая заметка"}»
          </button>
        </div>
      </div>
    </div>
  );
}
