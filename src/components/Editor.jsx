import React, { useEffect, useMemo, useState } from "react";
import { useNotes } from "../state/NotesContext";

export default function Editor({ note, onChange }) {
  const { dispatch } = useNotes();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  useEffect(() => { setTitle(note.title); setContent(note.content); }, [note.id]);

  // автосейв (debounce 300мс)
  useEffect(() => {
    const t = setTimeout(() => {
      onChange && onChange({ title, content });
    }, 300);
    return () => clearTimeout(t);
  }, [title, content]);

  const toggleStar = () => dispatch({ type: "TOGGLE_STAR", id: note.id });

  return (
    <div className="h-full w-full p-6">
      <div className="flex items-center gap-2 mb-4">
        <input
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          className="flex-1 text-xl md:text-2xl font-semibold bg-transparent outline-none px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10"
          placeholder="Заголовок…"
        />
        <button
          onClick={toggleStar}
          className="px-3 py-1 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20"
          title="Закладка (Ctrl+B)"
        >⭐</button>
      </div>

      <textarea
        value={content}
        onChange={(e)=>setContent(e.target.value)}
        className="w-full h-[calc(100vh-140px)] resize-none leading-7 outline-none bg-transparent px-2 py-2 rounded hover:bg-black/5 dark:hover:bg-white/10"
        placeholder="Пишите здесь… Поддерживаются [[wiki-ссылки]] для графа."
      />
    </div>
  );
}
