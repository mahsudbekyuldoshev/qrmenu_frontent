import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import "./globals.css";
import { PreferencesProvider } from "@/providers/PreferencesProvider";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RestoFlow — QR Menu, KDS & Dashboard",
  description:
    "Restoranlar uchun QR-menyu, oshxona displeyi (KDS) va direktor paneli.",
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
      className={`${display.variable} ${body.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        <PreferencesProvider>{children}</PreferencesProvider>
      </body>
    </html>
  );
}
