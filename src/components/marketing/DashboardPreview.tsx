"use client";

import { useRef } from "react";

/**
 * DashboardPreview — sichqoncha harakatiga qarab yengil 3D tilt effekti beradi.
 * Faqat mouse (hover) interfeysi uchun — touch qurilmalarda ta'sir qilmaydi.
 * GPU-friendly: faqat transform ishlatiladi, reflow yo'q.
 */
export default function DashboardPreview({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.012)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) {
      ref.current.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="transition-transform duration-200 ease-out will-change-transform"
    >
      {children}
    </div>
  );
}
