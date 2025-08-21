import React from "react";

export default function Editor({ note, onChange, onToggleStar, fontSize = 16 }) {
  if (!note) {
    return <div className="panel">Заметка не выбрана.</div>;
  }

  return (
    <div className="panel">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          className="title"
          value={note.title ?? ""}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Заголовок"
        />
        <button
          className="btn"
          type="button"
          onClick={onToggleStar}
          title={note.starred ? "Убрать из закладок" : "В закладки"}
          aria-label="Закладка"
        >
          {note.starred ? "★" : "☆"}
        </button>
        <span className="badge">локально</span>
      </div>

      <textarea
        className="area"
        style={{ fontSize }}
        value={note.content ?? ""}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder="Пишите здесь…"
      />
    </div>
  );
}
