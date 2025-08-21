import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const Ctx = createContext(null);
const uid = () => String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8);

const slugify = (s) =>
  (s || "note").toString().trim().toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

function uniqueSlug(base, notes, selfId){
  let s = slugify(base || "note"); let i=2;
  while (notes.some(n => n.slug === s && n.id !== selfId)) s = `${slugify(base)}-${i++}`;
  return s || "note";
}

const now = Date.now();
const defaultNotes = [
  { id:"1", title:"Первая заметка", slug:"pervaya-zametka", content:"Добро пожаловать!\n\nЭто первая заметка.", starred:false, createdAt:now, updatedAt:now },
  { id:"2", title:"Вторая заметка", slug:"vtoraya-zametka", content:"А это — вторая.", starred:false, createdAt:now, updatedAt:now },
];

const initial = (() => {
  const saved = localStorage.getItem("notes");
  return { notes: saved ? JSON.parse(saved) : defaultNotes, currentId: "1" };
})();

function reducer(state, action){
  switch(action.type){
    case "SET_CURRENT": return { ...state, currentId: action.id };
    case "ADD_NOTE": {
      const title = action.title || "Новая заметка";
      const note = { id:uid(), title, slug:uniqueSlug(title, state.notes), content:"", starred:false, createdAt:Date.now(), updatedAt:Date.now() };
      return { ...state, notes:[note, ...state.notes], currentId:note.id };
    }
    case "ADD_TODAY": {
      const title = `Дневник ${new Date().toLocaleDateString()}`;
      const note = { id:uid(), title, slug:uniqueSlug(title, state.notes), content:`# ${title}\n\n`, starred:false, createdAt:Date.now(), updatedAt:Date.now() };
      return { ...state, notes:[note, ...state.notes], currentId:note.id };
    }
    case "UPDATE_NOTE": {
      const notes = state.notes.map(n => {
        if (n.id !== action.id) return n;
        const patch = { ...action.patch, updatedAt:Date.now() };
        if (patch.title && patch.title !== n.title)
          patch.slug = uniqueSlug(patch.title, state.notes, n.id);
        return { ...n, ...patch };
      });
      return { ...state, notes };
    }
    case "TOGGLE_STAR":
      return { ...state, notes: state.notes.map(n => n.id === action.id ? { ...n, starred:!n.starred } : n) };
    default: return state;
  }
}

export function NotesProvider({ children }){
  const [state, dispatch] = useReducer(reducer, initial);
  useEffect(() => { localStorage.setItem("notes", JSON.stringify(state.notes)); }, [state.notes]);

  const current = useMemo(() => state.notes.find(n => n.id === state.currentId) || state.notes[0], [state]);
  const slugToId = useMemo(() => {
    const m = new Map(); state.notes.forEach(n => m.set(n.slug, n.id)); return m;
  }, [state.notes]);

  return <Ctx.Provider value={{ state, dispatch, current, slugToId }}>{children}</Ctx.Provider>;
}
export const useNotes = () => useContext(Ctx);
