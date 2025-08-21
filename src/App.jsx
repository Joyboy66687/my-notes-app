import React, { useEffect, useMemo, useState } from "react";
import { NotesProvider, useNotes } from "./state/NotesContext";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import CommandPalette from "./components/CommandPalette";
import GraphView from "./components/GraphView";
import CanvasBoard from "./components/CanvasBoard";
import "./index.css";

function Shell() {
  const { state, dispatch } = useNotes();
  const [view, setView] = useState("editor"); // editor | graph | canvas
  const [cmd, setCmd] = useState(false);

  const current = useMemo(
    () => state.notes.find(n => n.id===state.currentId) || state.notes[0] || null,
    [state]
  );

  // горячие клавиши
  useEffect(() => {
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();
      if (mod && key === "k") { e.preventDefault(); setCmd(true); }
      if (mod && key === "n") { e.preventDefault(); dispatch({ type:"ADD_NOTE" }); setView("editor"); }
      if (mod && e.shiftKey && key === "d") { e.preventDefault(); dispatch({ type:"ADD_TODAY" }); setView("editor"); }
      if (mod && key === "b" && state.currentId) { e.preventDefault(); dispatch({ type:"TOGGLE_STAR", id:state.currentId }); }
      if (mod && key === "1") setView("editor");
      if (mod && key === "2") setView("graph");
      if (mod && key === "3") setView("canvas");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.currentId]);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar
        onOpenSettings={()=>alert("Настройки подключим позже")}
        onOpenGraph={()=>setView("graph")}
        onOpenCanvas={()=>setView("canvas")}
        onOpenSearch={()=>setCmd(true)}
      />

      <main className="flex-1">
        {view==="editor" && current && (
          <Editor
            note={current}
            onChange={(patch)=>dispatch({ type:"UPDATE_NOTE", id:current.id, patch })}
          />
        )}
        {view==="editor" && !current && (
          <div className="h-full grid place-items-center opacity-70">Заметок нет. Нажмите «Новая» или Ctrl+N.</div>
        )}
        {view==="graph" && <GraphView />}
        {view==="canvas" && <CanvasBoard />}
      </main>

      <CommandPalette isOpen={cmd} onClose={()=>setCmd(false)} />
    </div>
  );
}

export default function App() {
  return (
    <NotesProvider>
      <Shell />
    </NotesProvider>
  );
}

<div className="flex h-screen app-fade">
  {/* … */}
  <aside className="w-72 p-3 glass hidden lg:flex flex-col">…</aside>
  <main className="flex-1 glass">…</main>
</div>
