import React, { useMemo, useState } from "react";
import { useNotes } from "../state/NotesContext";

// маленькая кнопка-иконка
function IconBtn({ title, onClick, children }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:scale-[1.03] transition-transform hover:bg-black/5 dark:hover:bg-white/10"
    >
      {children}
    </button>
  );
}

// простые «иконки» через эмодзи, чтобы не тянуть пакеты
const I = {
  plus: "➕",
  today: "🗓",
  graph: "🌐",
  canvas: "🧩",
  search: "🔍",
  star: "⭐",
  gear: "⚙️",
};

export default function Sidebar({
  onOpenSettings,
  onOpenGraph,
  onOpenCanvas,
  onOpenSearch,
}) {
  const { state, dispatch } = useNotes();
  const [q, setQ] = useState("");

  const starred = useMemo(() => state.notes.filter(n => n.starred), [state.notes]);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return state.notes;
    return state.notes.filter(n =>
      n.title.toLowerCase().includes(s) || n.content.toLowerCase().includes(s)
    );
  }, [q, state.notes]);

  const open = (id) => dispatch({ type: "SET_CURRENT", id });

  return (
    <aside className="w-72 h-screen border-r border-black/10 dark:border-white/10 p-3 flex flex-col bg-white/80 dark:bg-black/40 backdrop-blur-md">
      {/* header */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-base font-semibold">Vault</div>
        <div className="flex gap-1">
          <IconBtn title="Поиск (Ctrl+K)" onClick={onOpenSearch}>{I.search}</IconBtn>
          <IconBtn title="Настройки" onClick={onOpenSettings}>{I.gear}</IconBtn>
        </div>
      </div>

      {/* actions */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <button
          onClick={() => dispatch({ type: "ADD_NOTE" })}
          className="px-2 py-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition"
          title="Новая (Ctrl+N)"
        >{I.plus} Новая</button>

        <button
          onClick={() => dispatch({ type: "ADD_TODAY" })}
          className="px-2 py-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition col-span-1"
          title="Сегодня (Ctrl+Shift+D)"
        >{I.today}</button>

        <button
          onClick={onOpenCanvas}
          className="px-2 py-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition col-span-1"
          title="Холст"
        >{I.canvas}</button>

        <button
          onClick={onOpenGraph}
          className="px-2 py-2 rounded-xl bg-black/5 dark:bg:white/10 hover:bg-black/10 dark:hover:bg-white/20 transition col-span-1"
          title="Граф"
        >{I.graph}</button>
      </div>

      {/* поиск */}
      <input
        value={q}
        onChange={(e)=>setQ(e.target.value)}
        placeholder="Фильтр заметок…"
        className="mb-3 w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 outline-none focus:ring-2 ring-black/20 dark:ring-white/20"
      />

      {/* starred */}
      {starred.length > 0 && (
        <div className="mb-2">
          <div className="text-xs uppercase tracking-wide opacity-60 mb-1">{I.star} Закладки</div>
          <div className="space-y-1">
            {starred.map(n=>(
              <button
                key={n.id}
                onClick={()=>open(n.id)}
                className={`w-full text-left px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition
                  ${state.currentId===n.id ? "bg-black/5 dark:bg-white/10" : ""}`}
              >{n.title}</button>
            ))}
          </div>
        </div>
      )}

      {/* список */}
      <div className="text-xs uppercase tracking-wide opacity-60 mt-2 mb-1">Заметки</div>
      <div className="flex-1 overflow-auto space-y-1">
        {filtered.map(n=>(
          <div key={n.id} className={`group rounded-lg ${state.currentId===n.id ? "bg-black/5 dark:bg-white/10" : ""}`}>
            <button onClick={()=>open(n.id)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition">
              {n.title}
            </button>
            <div className="px-2 pb-2 hidden group-hover:flex gap-2">
              <button
                title="Закладка"
                onClick={()=>dispatch({type:"TOGGLE_STAR", id:n.id})}
                className="px-2 py-1 text-xs rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20"
              >{n.starred? "Убрать ⭐" : "В закладки ⭐"}</button>
              <button
                title="Удалить"
                onClick={()=>dispatch({type:"DELETE_NOTE", id:n.id})}
                className="px-2 py-1 text-xs rounded bg-black/5 dark:bg-white/10 hover:bg-red-500/20"
              >Удалить</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="opacity-60 px-2 py-3 text-sm">Ничего не найдено…</div>
        )}
      </div>

      <div className="pt-2 text-[11px] opacity-60 text-center">Ctrl+K — палитра команд</div>
    </aside>
  );
}
