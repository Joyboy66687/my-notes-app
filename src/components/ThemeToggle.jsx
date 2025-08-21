import { useEffect, useState } from "react";

export default function ThemeToggle({ className="" }) {
  const [theme, setTheme] = useState(()=> localStorage.getItem("theme") || "dark");

  useEffect(()=>{
    document.documentElement.classList.add("theme-transition");
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      className={`btn btn-ghost ${className}`}
      onClick={()=> setTheme(t => t === "dark" ? "light" : "dark")}
      title="Переключить тему"
    >
      {theme === "dark" ? "☀️ Светлая" : "🌙 Тёмная"}
    </button>
  );
}
