/**
 * HeroBackground — RestoFlow hero bo'limi uchun fon animatsiya komponenti.
 *
 * 3 ta vizual qatlam:
 *  1. Gradient bloblar (teal/emerald) — sekin suzib yuruvchi atmosfera
 *  2. QR-grid naqsh + scan-line effekti — skanerlash g'oyasini eslatuvchi
 *  3. Steam chiziqlari — ovqat/restoran hissini kuchaytiruvchi
 *
 * Barcha animatsiyalar GPU-friendly (transform/opacity only).
 * prefers-reduced-motion globals.css dagi @media orqali hurmat qilinadi.
 */
export default function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* ── 1. Gradient Bloblar ─────────────────────────────────────────── */}
      <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl will-change-transform animate-hero-blob-1" />
      <div className="absolute top-1/3 -right-24 h-[30rem] w-[30rem] rounded-full bg-emerald-400/15 blur-3xl will-change-transform animate-hero-blob-2" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-teal-300/10 blur-3xl will-change-transform animate-hero-blob-3" />

      {/* ── 2. QR-uslubidagi Grid Naqsh ─────────────────────────────────── */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.045] dark:opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="hero-qr-grid"
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <rect x="0" y="0" width="6" height="6" fill="currentColor" className="text-teal-900 dark:text-teal-100" />
            <rect x="12" y="0" width="6" height="6" fill="currentColor" className="text-teal-900 dark:text-teal-100" />
            <rect x="0" y="12" width="6" height="6" fill="currentColor" className="text-teal-900 dark:text-teal-100" />
            <rect x="6" y="6" width="6" height="6" fill="currentColor" className="text-teal-900 dark:text-teal-100" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-qr-grid)" />
      </svg>

      {/* ── 3. Scan-line (yuqoridan pastga) ─────────────────────────────── */}
      <div className="absolute inset-x-0 top-0 h-28 will-change-transform animate-hero-scan-line">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-teal-400/20 to-transparent" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-teal-400/40" />
      </div>

      {/* ── 4. Steam / Bug chiziqlari ────────────────────────────────────── */}
      <svg
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-48 w-80 text-teal-700 dark:text-teal-300"
        viewBox="0 0 240 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M48 180 C 28 135, 68 120, 48 75 C 28 40, 65 20, 55 0"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.12"
          className="will-change-transform animate-hero-steam-1"
        />
        <path
          d="M120 180 C 96 135, 144 115, 120 72 C 96 38, 138 18, 126 0"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.10"
          className="will-change-transform animate-hero-steam-2"
        />
        <path
          d="M192 180 C 172 135, 212 118, 192 74 C 172 40, 208 22, 198 0"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.09"
          className="will-change-transform animate-hero-steam-3"
        />
      </svg>
    </div>
  );
}
