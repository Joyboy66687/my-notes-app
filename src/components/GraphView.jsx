import React, { useEffect, useMemo, useRef } from "react";
import { useNotes } from "../state/NotesContext";
import { Network } from "vis-network/standalone/esm/vis-network";

function extractWikiLinks(text="") {
  // [[Название заметки]]
  const re = /\[\[([^\]]+)\]\]/g;
  const out = [];
  let m;
  while ((m = re.exec(text))) out.push(m[1]);
  return out;
}

export default function GraphView() {
  const { state } = useNotes();
  const ref = useRef(null);

  const { nodes, edges } = useMemo(() => {
    const map = new Map(); // title -> id
    state.notes.forEach((n, idx) => map.set(n.title, n.id));

    const nodes = state.notes.map(n => ({ id: n.id, label: n.title }));
    const edges = [];

    state.notes.forEach(n => {
      const links = extractWikiLinks(n.content);
      links.forEach(t => {
        const toId = map.get(t);
        if (toId) edges.push({ from: n.id, to: toId });
      });
    });

    return { nodes, edges };
  }, [state.notes]);

  useEffect(() => {
    if (!ref.current) return;
    const network = new Network(ref.current, { nodes, edges }, {
      autoResize: true,
      interaction: { hover: true },
      physics: { stabilization: true },
      nodes: { shape: "dot", size: 12 },
      edges: { arrows: { to: { enabled: false } } },
    });
    return () => network?.destroy();
  }, [nodes, edges]);

  return <div ref={ref} className="w-full h-full" />;
}
