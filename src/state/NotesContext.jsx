import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const NotesCtx = createContext();

const initial = () => {
  // загрузка из localStorage
  try {
    const raw = localStorage.getItem("notes-state-v1");
    if (raw) return JSON.parse(raw);
  } catch {}
  const n1 = { id: "1", title: "Первая заметка", content: "Привет! Это [[Вторая заметка]].", starred: false, links: [] };
  const n2 = { id: "2", title: "Вторая заметка", content: "Связь с [[Первая заметка]].", starred: true, links: [] };
  return { notes: [n1, n2], currentId: "1" };
};

function slugifyTitle(t) {
  return t.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_CURRENT":
      return { ...state, currentId: action.id };

    case "ADD_NOTE": {
      const id = String(Date.now());
      const title = action.title || "Новая заметка";
      const note = { id, title, content: "", starred: false, links: [] };
      return { ...state, notes: [note, ...state.notes], currentId: id };
    }

    case "ADD_TODAY": {
      const d = new Date();
      const title = `Сегодня (${d.toLocaleDateString()})`;
      const id = String(Date.now());
      const note = { id, title, content: "", starred: false, links: [] };
      return { ...state, notes: [note, ...state.notes], currentId: id };
    }

    case "UPDATE_NOTE": {
      const { id, patch } = action;
      return {
        ...state,
        notes: state.notes.map(n => (n.id === id ? { ...n, ...patch } : n)),
      };
    }

    case "TOGGLE_STAR": {
      const id = action.id;
      return {
        ...state,
        notes: state.notes.map(n => (n.id === id ? { ...n, starred: !n.starred } : n)),
      };
    }

    case "DELETE_NOTE": {
      const id = action.id;
      const left = state.notes.filter(n => n.id !== id);
      const currentId = state.currentId === id ? (left[0]?.id || null) : state.currentId;
      return { ...state, notes: left, currentId };
    }

    default:
      return state;
  }
}

export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, initial);

  useEffect(() => {
    localStorage.setItem("notes-state-v1", JSON.stringify(state));
  }, [state]);

  const api = useMemo(() => ({ state, dispatch, slugifyTitle }), [state]);

  return <NotesCtx.Provider value={api}>{children}</NotesCtx.Provider>;
}

export function useNotes() {
  return useContext(NotesCtx);
}
