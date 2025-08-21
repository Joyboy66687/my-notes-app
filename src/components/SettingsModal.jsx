import React, { useEffect, useState } from "react";

export default function SettingsModal({ isOpen, onClose, theme, setTheme, fontSize, setFontSize }) {
  const [t, setT] = useState(theme);
  const [fs, setFs] = useState(fontSize);

  useEffect(()=>{ if(isOpen){ setT(theme); setFs(fontSize); } }, [isOpen, theme, fontSize]);
  if(!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <h2 style={{marginTop:0}}>Настройки</h2>

        <div style={{marginTop:12}}>
          <div style={{fontSize:12, color:"var(--muted)"}}>Тема</div>
          <div style={{display:"flex", gap:8, marginTop:6}}>
            {["light","dark"].map(x=>(
              <button key={x} className="btn" onClick={()=>setT(x)} style={{borderColor: t===x ? "var(--text)" : "var(--border)"}}>
                {x==="light"?"Светлая":"Тёмная"}
              </button>
            ))}
          </div>
        </div>

        <div style={{marginTop:12}}>
          <div style={{fontSize:12, color:"var(--muted)"}}>Размер шрифта: {fs}px</div>
          <input type="range" min="12" max="22" value={fs} onChange={(e)=>setFs(Number(e.target.value))} style={{width:"100%"}}/>
        </div>

        <div style={{display:"flex", justifyContent:"flex-end", gap:8, marginTop:16}}>
          <button className="btn" onClick={onClose}>Отмена</button>
          <button className="btn" onClick={()=>{ setTheme(t); setFontSize(fs); onClose(); }}>Применить</button>
        </div>
      </div>
    </div>
  );
}
