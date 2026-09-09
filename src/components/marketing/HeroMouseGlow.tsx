"use client";

import { useEffect, useState } from "react";

export function HeroMouseGlow() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute left-0 top-0 size-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400/30 dark:bg-teal-300/25 blur-[140px] transition-transform duration-[400ms] ease-out will-change-transform"
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
        }}
      />
      <div
        className="absolute left-0 top-0 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/25 dark:bg-emerald-300/20 blur-[100px] transition-transform duration-[700ms] ease-out will-change-transform"
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
        }}
      />
    </div>
  );
}
