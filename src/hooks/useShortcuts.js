import { useEffect } from "react";
import { useNotes } from "../state/NotesContext";

export default function useShortcuts(openPalette, openSettings) {
  const { dispatch, state } = useNotes();

  useEffect(() => {
    const onKey = (e) => {
      const ctrl = e.ctrlKey || e.metaKey;
      // Ctrl+N — новая
      if (ctrl && e.key.toLowerCase() === "n") {
        e.preventDefault();
        dispatch({ type: "ADD_NOTE" });
      }
      // Ctrl+S — сохранить (ничего не делаем, т.к. автосохранение)
      if (ctrl && e.key.toLowerCase() === "s") {
        e.preventDefault();
        // подсказка пользователю
        console.log("Сохранено");
      }
      // Ctrl+P — палитра команд/поиск
      if (ctrl && e.key.toLowerCase() === "p") {
        e.preventDefault();
        openPalette();
      }
      // Ctrl+, — настройки
      if (ctrl && e.key === ",") {
        e.preventDefault();
        openSettings();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch, openPalette, openSettings, state]);
}
