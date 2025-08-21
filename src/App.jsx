import React, { useMemo } from "react";
import { NotesProvider, useNotes } from "./state/NotesContext";
import Editor from "./components/Editor";
import "./index.css";

function Shell() {
  const { state, dispatch } = useNotes();
  const current = useMemo(
    () => state.notes.find((n) => n.id === state.currentId) || state.notes[0],
    [state]
  );

  return (
    <div className="app">
      <main className="main">
        <Editor
          note={current}
          onChange={(patch) => dispatch({ type: "UPDATE_NOTE", id: current.id, patch })}
          onToggleStar={() => dispatch({ type: "TOGGLE_STAR", id: current.id })}
          fontSize={16}
        />
      </main>
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
