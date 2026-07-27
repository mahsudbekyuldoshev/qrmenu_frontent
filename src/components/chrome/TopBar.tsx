import type { ReactNode } from "react";

export function TopBar({
  left,
  right,
}: {
  left?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)]/60 bg-[var(--bg)]/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <div className="min-w-0">{left}</div>
        <div className="flex items-center gap-3">{right}</div>
      </div>
    </header>
  );
}

