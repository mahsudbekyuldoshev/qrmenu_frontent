"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Image as ImageIcon, Save, Loader2, LogOut } from "lucide-react";
import { api } from "@/lib/api";
import type { MenuItem, Category } from "@/lib/types";
import { usePreferences } from "@/providers/PreferencesProvider";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TopBar } from "@/components/chrome/TopBar";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { LanguageSelect } from "@/components/chrome/LanguageSelect";
import { useRouter } from "next/navigation";

export function ManagerDashboard() {
  const { t } = usePreferences();
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [bgImage, setBgImage] = useState("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80");
  const [savingBg, setSavingBg] = useState(false);

  useEffect(() => {
    if (user && user.role !== "manager" && user.role !== "director" && user.role !== "super-admin") {
      router.replace("/login");
    }
  }, [user, router]);

  useEffect(() => {
    Promise.all([api.getMenu(), api.getCategories()]).then(([items, cats]) => {
      setMenuItems(items);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  async function handleSaveBg() {
    setSavingBg(true);
    // In a real app, this would call an API
    setTimeout(() => {
      setSavingBg(false);
      alert("Fon rasmi saqlandi!");
    }, 1000);
  }

  return (
    <div className="manager-shell min-h-dvh bg-[var(--bg)]">
      <TopBar
        left={
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--accent)]">
              RestoFlow
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-2xl leading-tight text-[var(--ink)]">
              Manager Paneli
            </h1>
          </div>
        }
        right={
          <>
            <LanguageSelect />
            <ThemeToggle />
            <button onClick={() => {
                useAuthStore.getState().logout();
                router.push("/login");
            }} className="p-2 text-[var(--muted)] hover:text-rose-500">
                <LogOut className="size-4" />
            </button>
          </>
        }
      />

      <main className="mx-auto max-w-5xl px-4 py-8 md:px-8 space-y-10">
        {/* Menu Management */}
        <section className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--ink)]">{t.menu}</h2>
              <p className="text-sm text-[var(--muted)]">Taomlarni boshqarish</p>
            </div>
            <Button size="sm" onClick={() => alert("Taom qo'shish (Mock)")}>
              <Plus className="size-4 mr-2" /> {t.addDish}
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 animate-pulse rounded-2xl bg-[var(--surface-2)]" />
              ))}
            </div>
          ) : (
            <div className="grid gap-3">
              {menuItems.map(item => (
                <div key={item.id} className="group flex items-center justify-between p-4 rounded-2xl bg-[var(--bg)] border border-[var(--line)] transition hover:border-[var(--accent)]/30">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-[var(--surface-2)] overflow-hidden shrink-0">
                      <img src={item.imageUrl} alt={item.nameUz} className="size-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--ink)]">{item.nameUz}</h3>
                      <p className="text-xs text-[var(--muted)]">{item.price.toLocaleString()} so&apos;m</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="size-9 p-0" onClick={() => alert(`Tahrirlash: ${item.nameUz}`)}>
                      <Edit2 className="size-4" />
                    </Button>
                    <Button variant="secondary" size="sm" className="size-9 p-0 text-rose-500 hover:text-rose-600">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Customer Menu Customization */}
        <section className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[var(--ink)]">Menyu Dizayni</h2>
            <p className="text-sm text-[var(--muted)]">Mijozlar uchun menyu fonini sozlang</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--ink)] flex items-center gap-2">
                <ImageIcon className="size-4" /> Fon rasmi URL manzili
              </label>
              <div className="flex gap-3">
                <Input
                  value={bgImage}
                  onChange={(e) => setBgImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1"
                />
                <Button onClick={handleSaveBg} disabled={savingBg}>
                  {savingBg ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4 mr-2" />}
                  Saqlash
                </Button>
              </div>
            </div>

            <div className="relative aspect-video rounded-2xl border border-[var(--line)] overflow-hidden bg-black">
              <div
                className="absolute inset-0 opacity-40 blur-sm"
                style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-full max-w-[200px] h-32 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center">
                   <div className="w-12 h-12 rounded-full bg-white/20 mb-2 animate-pulse" />
                   <div className="w-24 h-2 bg-white/30 rounded-full mb-1" />
                   <div className="w-16 h-2 bg-white/20 rounded-full" />
                </div>
                <p className="mt-4 text-xs font-medium text-white/60">Ko&apos;rinish namunasi (Preview)</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
