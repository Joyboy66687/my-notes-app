import { useEffect, useState } from "react";

export default function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [fontSize, setFontSize] = useState(() => Number(localStorage.getItem("editorFontSize") || 16));

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = document.documentElement;
    root.style.transition = "background-color .25s ease, color .25s ease, border-color .25s ease";
    root.dataset.theme = theme === "dark" ? "dark" : "light";
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("editorFontSize", String(fontSize));
  }, [fontSize]);

  return { theme, setTheme, fontSize, setFontSize };
}
