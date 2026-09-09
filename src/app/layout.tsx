import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { PreferencesProvider } from "@/providers/PreferencesProvider";

const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

import Image from "next/image";
import { HeroMouseGlow } from "@/components/marketing/HeroMouseGlow";

export const metadata: Metadata = {
  title: "RestoFlow — Restoran Boshqaruvi & QR-Menyu SaaS",
  description:
    "Restoranlar uchun QR-menyu, oshxona displeyi (KDS), ofitsiant stansiyasi va direktor paneli.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} h-full`}
    >
      <body className="min-h-full antialiased font-sans bg-transparent">
        <div className="fixed inset-0 -z-20">
          <Image src="/images/login-bg.jpg" alt="" fill priority className="object-cover hidden dark:block" />
          <Image src="/images/login-bg-light.jpg" alt="" fill priority className="object-cover block dark:hidden" />
          {/* Universal qoplama — yorug' rejimda oq, qorong'i rejimda to'q */}
          <div className="absolute inset-0 bg-white/85 dark:bg-slate-950/85" />
          {/* Mishka effektini butun sayt bo'ylab ishlashi uchun shu yerga quyamiz */}
          <HeroMouseGlow />
        </div>
        <Toaster position="top-right" />
        <PreferencesProvider>{children}</PreferencesProvider>
      </body>
    </html>
  );
}
