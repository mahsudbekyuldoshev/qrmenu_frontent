import Link from "next/link";
import { ArrowRight, ChefHat, LayoutDashboard, QrCode, UtensilsCrossed } from "lucide-react";

const links = [
  {
    href: "/menu/5",
    title: "QR-Menu",
    desc: "Mijozlar uchun mobil menyu — stol #5 demo",
    icon: QrCode,
  },
  {
    href: "/kds",
    title: "KDS",
    desc: "Oshxona ekrani — real-time buyurtmalar",
    icon: ChefHat,
  },
  {
    href: "/waiter",
    title: "Ofitsiant",
    desc: "Tayyor buyurtmalar va chaqiruvlar",
    icon: UtensilsCrossed,
  },
  {
    href: "/director",
    title: "Direktor",
    desc: "Tushum, faol buyurtmalar, stollar",
    icon: LayoutDashboard,
  },
];

export default function HomePage() {
  return (
    <main className="hub-shell relative min-h-dvh overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.35) 55%, transparent)",
        }}
      />
      <div className="relative mx-auto flex min-h-dvh max-w-5xl flex-col justify-center px-5 py-16 md:px-8">
        <p className="animate-fade-up text-xs uppercase tracking-[0.28em] text-[var(--accent-bright)]">
          SaaS · Restoran operatsiyasi
        </p>
        <h1
          className="animate-fade-up mt-4 max-w-2xl font-[family-name:var(--font-display)] text-5xl leading-[0.95] tracking-tight text-white md:text-7xl"
          style={{ animationDelay: "80ms" }}
        >
          RestoFlow
        </h1>
        <p
          className="animate-fade-up mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg"
          style={{ animationDelay: "140ms" }}
        >
          QR-menyu, oshxona KDS va direktor paneli — bitta oqimda. Demo
          rejimida backend siz ham ishlaydi.
        </p>

        <div
          className="animate-fade-up mt-8 flex flex-wrap gap-3"
          style={{ animationDelay: "180ms" }}
        >
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-medium text-[var(--accent-fg)] shadow-[0_8px_24px_-12px_rgba(15,118,110,0.65)] transition hover:brightness-110"
          >
            Kirish
          </Link>
          <Link
            href="/register"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-medium text-white transition hover:border-[var(--accent-bright)]/40 hover:bg-white/10"
          >
            Ro‘yxatdan o‘tish
          </Link>
        </div>

        <div
          className="animate-fade-up mt-10 grid gap-3 sm:grid-cols-2"
          style={{ animationDelay: "220ms" }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:border-[var(--accent-bright)]/40 hover:bg-white/10"
            >
              <div>
                <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-white/10 text-[var(--accent-bright)]">
                  <link.icon className="size-5" />
                </div>
                <h2 className="font-[family-name:var(--font-display)] text-xl text-white">
                  {link.title}
                </h2>
                <p className="mt-1 text-sm text-white/55">{link.desc}</p>
              </div>
              <ArrowRight className="mt-1 size-5 shrink-0 text-white/30 transition group-hover:translate-x-1 group-hover:text-[var(--accent-bright)]" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
