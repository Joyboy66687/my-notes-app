import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useNotes } from "../state/NotesContext";

export default function CanvasBoard() {
  const { id } = useParams();
  const { state, dispatch } = useNotes();
  const canvas = state.canvases.find(c => c.id === id);

  const [items, setItems] = useState(canvas?.items || []);
  useEffect(() => { if (canvas) setItems(canvas.items || []); }, [id]); // при переключении холста

  useEffect(() => {
    if (!canvas) return;
    const t = setTimeout(() => dispatch({ type: "UPDATE_CANVAS", id, patch: { items } }), 200);
    return () => clearTimeout(t);
  }, [items]); // eslint-disable-line

  const addNode = (x, y) => setItems(prev => [...prev, { id: String(Date.now()), x, y, text: "Новый" }]);

  const boardRef = useRef(null);
  const [drag, setDrag] = useState(null); // {id, dx, dy}

  const onMouseDown = (e, node) => {
    const r = boardRef.current.getBoundingClientRect();
    setDrag({ id: node.id, dx: e.clientX - (r.left + node.x), dy: e.clientY - (r.top + node.y) });
  };
  const onMouseMove = (e) => {
    if (!drag) return;
    const r = boardRef.current.getBoundingClientRect();
    const x = e.clientX - r.left - drag.dx;
    const y = e.clientY - r.top - drag.dy;
    setItems(prev => prev.map(n => n.id === drag.id ? { ...n, x, y } : n));
  };
  const onMouseUp = () => setDrag(null);

  if (!canvas) return <div className="p-6">Холст не найден.</div>;

  return (
    <div className="h-full w-full">
      <div className="border-b border-gray-200 dark:border-gray-800 p-2 flex items-center gap-2">
        <button
          onClick={() => addNode(80 + Math.random()*300, 80 + Math.random()*200)}
          className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          ➕ Узел
        </button>
        <div className="text-sm text-gray-500">Перетаскивай узлы мышью</div>
      </div>

      <div
        ref={boardRef}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onDoubleClick={(e) => {
          const r = boardRef.current.getBoundingClientRect();
          addNode(e.clientX - r.left, e.clientY - r.top);
        }}
        className="relative h-[calc(100vh-48px)] overflow-hidden bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.08)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_1px)]"
        style={{ backgroundSize: "16px 16px" }}
      >
        {items.map(n => (
          <div
            key={n.id}
            onMouseDown={(e) => onMouseDown(e, n)}
            className="absolute select-none cursor-grab active:cursor-grabbing"
            style={{ left: n.x, top: n.y }}
          >
            <div className="px-3 py-2 rounded-xl shadow-md bg-white/90 dark:bg-gray-800/90 backdrop-blur">
              <input
                className="bg-transparent outline-none"
                value={n.text}
                onChange={(e)=>setItems(prev=>prev.map(x=>x.id===n.id?{...x,text:e.target.value}:x))}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
