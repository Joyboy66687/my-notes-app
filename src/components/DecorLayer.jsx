import { useEffect } from "react";

export default function DecorLayer() {
  useEffect(() => {
    const onMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / 40;
      const dy = (e.clientY - cy) / 40;
      document.documentElement.style.setProperty("--mx", `${dx}px`);
      document.documentElement.style.setProperty("--my", `${dy}px`);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <>
      <div className="aurora" />
      <div className="blob blob--1" />
      <div className="blob blob--2" />
      <div className="grid-soft" />
    </>
  );
}
