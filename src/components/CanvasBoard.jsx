import React, { useEffect, useRef, useState } from "react";

export default function CanvasBoard() {
  const [items, setItems] = useState([
    { id: "a", x: 120, y: 120, text: "Блок A" },
    { id: "b", x: 360, y: 220, text: "Блок B" },
  ]);
  const [links, setLinks] = useState([]);
  const [connectMode, setConnectMode] = useState(false);
  const [first, setFirst] = useState(null);
  const wrapRef = useRef(null);

  // перетаскивание
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let dragId = null, offX=0, offY=0;

    const onDown = (e) => {
      const t = e.target.closest("[data-node]");
      if (!t) return;
      dragId = t.dataset.node;
      const rect = t.getBoundingClientRect();
      offX = e.clientX - rect.left;
      offY = e.clientY - rect.top;
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };
    const onMove = (e) => {
      if (!dragId) return;
      const r = wrapRef.current.getBoundingClientRect();
      const nx = e.clientX - r.left - offX;
      const ny = e.clientY - r.top  - offY;
      setItems(prev => prev.map(it => it.id===dragId ? {...it, x:nx, y:ny} : it));
    };
    const onUp = () => {
      dragId = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    el.addEventListener("mousedown", onDown);
    return () => el.removeEventListener("mousedown", onDown);
  }, []);

  const addBlock = () => {
    const id = String(Date.now());
    setItems(prev => [...prev, { id, x: 200, y: 100, text: "Новый блок" }]);
  };

  const clickNode = (id) => {
    if (!connectMode) return;
    if (!first) { setFirst(id); return; }
    if (first && first !== id) {
      setLinks(prev => [...prev, { from:first, to:id }]);
      setFirst(null);
    }
  };

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <button onClick={addBlock} className="px-3 py-1 rounded bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20">+ Блок</button>
        <button onClick={()=>setConnectMode(v=>!v)} className={`px-3 py-1 rounded ${connectMode?"bg-blue-500/20":"bg-black/5 dark:bg-white/10"} hover:bg-black/10 dark:hover:bg-white/20`}>
          {connectMode ? "Режим соединений: ВКЛ" : "Режим соединений: ВЫКЛ"}
        </button>
      </div>

      {/* линии как SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {links.map((l, i) => {
          const a = items.find(it => it.id===l.from);
          const b = items.find(it => it.id===l.to);
          if (!a || !b) return null;
          const x1=a.x+80, y1=a.y+28, x2=b.x+80, y2=b.y+28;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeOpacity="0.3" strokeWidth="2"/>;
        })}
      </svg>

      {/* узлы */}
      <div ref={wrapRef} className="absolute inset-0">
        {items.map(it=>(
          <div
            key={it.id}
            data-node={it.id}
            onDoubleClick={()=>clickNode(it.id)}
            style={{ left: it.x, top: it.y }}
            className="absolute select-none w-40 px-3 py-2 rounded-xl bg-white/80 dark:bg-gray-900/80 border border-black/10 dark:border-white/10 shadow hover:shadow-lg transition-shadow cursor-grab"
          >
            <input
              value={it.text}
              onChange={(e)=>setItems(prev => prev.map(x => x.id===it.id ? {...x, text:e.target.value} : x))}
              className="w-full bg-transparent outline-none"
            />
            <div className="text-[11px] opacity-60">двойной клик — выбрать для связи</div>
          </div>
        ))}
      </div>
    </div>
  );
}
