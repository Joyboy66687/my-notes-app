import React from "react";
import { useNavigate } from "react-router-dom";
import { useNotes } from "../state/NotesContext";

export default function GraphView() {
  const { state, edges } = useNotes();
  const nav = useNavigate();
  const W = 960, H = 560, R = Math.min(W, H) / 2 - 60;

  const nodes = state.notes.map((n, i) => ({
    id: n.id, label: n.title, slug: n.slug,
    x: W/2 + R * Math.cos((i / state.notes.length) * Math.PI * 2),
    y: H/2 + R * Math.sin((i / state.notes.length) * Math.PI * 2),
  }));
  const map = new Map(nodes.map(n => [n.id, n]));

  return (
    <div className="p-4">
      <svg width={W} height={H} className="rounded border border-gray-200 dark:border-gray-800">
        {edges.map((e, i) => {
          const a = map.get(e.from), b = map.get(e.to);
          if (!a || !b) return null;
          return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="currentColor" strokeOpacity="0.25" />;
        })}
        {nodes.map(n => (
          <g key={n.id} onClick={() => nav(`/note/${n.slug}`)} style={{ cursor: "pointer" }}>
            <circle cx={n.x} cy={n.y} r="18" fill="currentColor" opacity="0.15" />
            <text x={n.x} y={n.y + 4} textAnchor="middle" className="text-xs fill-current">{n.label}</text>
          </g>
        ))}
      </svg>
      <div className="text-sm text-gray-500 mt-2">Связи берутся из ссылок вида [[Название заметки]] в тексте.</div>
    </div>
  );
}
