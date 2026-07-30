"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Image as ImageIcon, Save, Loader2, LogOut, Search, UtensilsCrossed, XCircle } from "lucide-react";
import Link from "next/link";
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
  const { t, language, menuBgImage, setMenuBgImage } = usePreferences();
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingBg, setSavingBg] = useState(false);
  const [showDishModal, setShowDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    // Load categories from API or mock
    setCategories([
        { id: "c1", nameUz: "Milliy taomlar", nameRu: "Национальные блюда", nameEn: "National Dishes", sortOrder: 1 },
        { id: "c2", nameUz: "Ichimliklar", nameRu: "Напитки", nameEn: "Drinks", sortOrder: 2 },
    ]);
  }, []);

  const saveDish = () => {
    const nameInput = document.querySelector('input[placeholder="'+t.dishName+'"]') as HTMLInputElement;
    const priceInput = document.querySelector('input[type="number"]') as HTMLInputElement;
    const descInput = document.querySelector('textarea') as HTMLTextAreaElement;
    const catSelect = document.querySelector('select[name="category"]') as HTMLSelectElement;

    if (editingDish) {
        setMenuItems(prev => prev.map(item => item.id === editingDish.id ? {
            ...item,
            nameUz: nameInput.value,
            price: Number(priceInput.value),
            descriptionUz: descInput.value,
            categoryId: catSelect.value,
            imageUrl: (editingDish as any)?.imageUrl || ""
        } : item));
    } else {
        const newDish: MenuItem = {
            id: Date.now().toString(),
            nameUz: nameInput.value,
            price: Number(priceInput.value),
            imageUrl: editingDish?.imageUrl || "",
            categoryId: catSelect.value,
            descriptionUz: descInput.value,
            nameRu: "",
            nameEn: "",
            descriptionRu: "",
            descriptionEn: "",
            isAvailable: true,
            prepTimeMinutes: 10
        };
        setMenuItems(prev => [newDish, ...prev]);
    }
    setShowDishModal(false);
    setEditingDish(null);
  };

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSaveBg() {
    setSavingBg(true);
    setTimeout(() => {
      setSavingBg(false);
      alert(t.save);
    }, 1000);
  }

  const getName = (item: any) => {
      if (language === 'uz') return item.nameUz;
      if (language === 'ru') return item.nameRu;
      return item.nameEn || item.nameUz;
  };

  const getDescription = (item: any) => {
      if (language === 'uz') return item.descriptionUz;
      if (language === 'ru') return item.descriptionRu;
      return item.descriptionEn || item.descriptionUz;
  };

  return (
    <div className="manager-shell min-h-dvh bg-[var(--bg)] font-sans">
      <TopBar
        left={
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[var(--accent)] font-bold">
              RestoFlow
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-2xl leading-tight text-[var(--ink)]">
              {t.managerPanel}
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

      <main className="mx-auto max-w-5xl px-4 py-8 md:px-10 space-y-12">
        {/* Menu Management */}
        <section className="rounded-[2.5rem] border border-[var(--line)] bg-[var(--surface)] p-8 shadow-xl shadow-black/5 animate-in fade-in duration-700">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-[var(--ink)]">{t.menu}</h2>
              <p className="text-sm text-[var(--muted)] mt-1">Taomlar va menyu tarkibini boshqarish</p>
            </div>
            <div className="flex gap-2">
                <Link href="/menu/1">
                    <Button size="sm" variant="ghost" className="rounded-2xl h-12 px-6">
                        {t.menu} ({t.realTime} Preview)
                    </Button>
                </Link>
                <Button size="sm" variant="secondary" className="rounded-2xl h-12 px-6" onClick={() => setShowCategoryModal(true)}>
                  {t.categories}
                </Button>
                <Button size="sm" className="rounded-2xl h-12 px-6" onClick={() => { setEditingDish(null); setShowDishModal(true); }}>
                  <Plus className="size-5 mr-2" /> {t.addDish}
                </Button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-[var(--surface-2)]" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {menuItems.map(item => (
                <div key={item.id} className="group flex items-center justify-between p-5 rounded-3xl bg-[var(--bg)] border border-[var(--line)] transition hover:border-[var(--accent)] hover:shadow-lg">
                  <div className="flex items-center gap-5">
                    <div className="size-16 rounded-2xl bg-[var(--surface-2)] overflow-hidden shrink-0 border border-[var(--line)]">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={getName(item)} className="size-full object-cover group-hover:scale-110 transition duration-500" />
                      ) : (
                        <div className="size-full flex items-center justify-center text-[var(--muted)]">
                          <ImageIcon className="size-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[var(--ink)]">{getName(item)}</h3>
                      <p className="text-sm font-black text-[var(--accent)] mt-0.5">{item.price.toLocaleString()} so&apos;m</p>
                      <p className="text-xs text-[var(--muted)] mt-1 line-clamp-1">{getDescription(item)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingDish(item); setShowDishModal(true); }} className="size-10 rounded-xl bg-[var(--surface-2)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition">
                      <Edit2 className="size-4" />
                    </button>
                    <button onClick={() => setMenuItems(prev => prev.filter(x => x.id !== item.id))} className="size-10 rounded-xl bg-[var(--surface-2)] flex items-center justify-center text-[var(--muted)] hover:text-rose-500 hover:bg-rose-50 transition">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Customer Menu Customization */}
        <section className="rounded-[2.5rem] border border-[var(--line)] bg-[var(--surface)] p-8 shadow-xl shadow-black/5 animate-in slide-in-from-bottom-10 duration-700">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-[var(--ink)]">{t.menuDesign}</h2>
            <p className="text-sm text-[var(--muted)] mt-1">Mijozlar uchun menyu fonini sozlang</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
                <div className="space-y-4">
                    <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest flex items-center gap-2">
                        <ImageIcon className="size-4 text-[var(--accent)]" /> {t.bgImage}
                    </label>
                    <div className="relative group">
                         <div className="h-48 rounded-3xl border-2 border-dashed border-[var(--line)] bg-[var(--bg)] flex flex-col items-center justify-center p-6 text-center group-hover:border-[var(--accent)] transition cursor-pointer overflow-hidden">
                             {menuBgImage ? (
                                 <img src={menuBgImage} className="absolute inset-0 size-full object-cover opacity-20" alt="bg" />
                             ) : null}
                             <div className="relative z-10">
                                <Plus className="size-10 text-[var(--muted)] mb-2 mx-auto group-hover:text-[var(--accent)] transition" />
                                <p className="text-sm font-bold text-[var(--ink)]">{t.uploadImage}</p>
                                <p className="text-xs text-[var(--muted)] mt-1">JPG, PNG (Max 5MB)</p>
                             </div>
                             <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, setMenuBgImage)} />
                         </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button className="flex-1 h-14 rounded-2xl font-bold shadow-lg shadow-[var(--accent)]/20" onClick={handleSaveBg} disabled={savingBg}>
                        {savingBg ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5 mr-2" />}
                        {t.save}
                    </Button>
                    <a 
                        href="https://www.google.com/search?q=restaurant+menu+background+minimalist&tbm=isch" 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 px-6 h-14 rounded-2xl bg-[var(--bg)] border border-[var(--line)] text-sm font-bold text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition"
                    >
                        <Search className="size-4" /> {t.googleSearch}
                    </a>
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest">{t.realTime} Preview</label>
                <div className="relative aspect-[4/5] rounded-[2.5rem] border-4 border-[var(--ink)] overflow-hidden bg-black shadow-2xl">
                    <div
                        className="absolute inset-0 opacity-60 blur-[2px]"
                        style={{ backgroundImage: `url(${menuBgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-full max-w-[240px] space-y-6">
                            <div className="flex flex-col items-center gap-3">
                                <div className="size-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center animate-pulse">
                                    <UtensilsCrossed className="size-8 text-white" />
                                </div>
                                <div className="h-4 w-32 bg-white/40 rounded-full" />
                            </div>
                            
                            <div className="space-y-3 pt-8">
                                <div className="h-12 w-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center px-4 justify-between">
                                    <div className="h-2 w-20 bg-white/30 rounded-full" />
                                    <div className="h-2 w-10 bg-white/40 rounded-full" />
                                </div>
                                <div className="h-12 w-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center px-4 justify-between">
                                    <div className="h-2 w-24 bg-white/30 rounded-full" />
                                    <div className="h-2 w-10 bg-white/40 rounded-full" />
                                </div>
                            </div>
                        </div>
                        <p className="mt-10 text-[0.65rem] font-black uppercase tracking-[0.3em] text-white/40">RestoFlow Menyu</p>
                    </div>
                </div>
            </div>
          </div>
        </section>
      </main>

      {/* Dish Modal */}
      {showDishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
              <div className="bg-[var(--surface)] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl p-10 border border-[var(--line)] animate-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-black text-[var(--ink)]">{editingDish ? t.editDish : t.addDish}</h2>
                      <button onClick={() => setShowDishModal(false)} className="size-12 rounded-2xl hover:bg-[var(--surface-2)] flex items-center justify-center transition">
                          <XCircle className="size-8 text-[var(--muted)]" />
                      </button>
                  </div>

                  <div className="space-y-8">
                      {/* Image Upload */}
                      <div className="space-y-4">
                          <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest ml-1">{t.dishImage}</label>
                          <div className="flex items-center gap-6">
                              <div className="size-32 rounded-3xl bg-[var(--bg)] border-2 border-dashed border-[var(--line)] relative overflow-hidden group hover:border-[var(--accent)] transition cursor-pointer">
                                  {editingDish?.imageUrl ? (
                                      <img src={editingDish.imageUrl} className="size-full object-cover" alt="dish" />
                                  ) : (
                                      <div className="size-full flex items-center justify-center text-[var(--muted)] group-hover:text-[var(--accent)]">
                                          <ImageIcon className="size-10" />
                                      </div>
                                  )}
                                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, (url) => setEditingDish(prev => prev ? {...prev, imageUrl: url} : {imageUrl: url} as MenuItem))} />
                              </div>
                              <div className="flex-1 space-y-2">
                                  <p className="text-sm font-bold text-[var(--ink)]">{t.uploadImage}</p>
                                  <p className="text-xs text-[var(--muted)]">Rasm yuklash yoki URL manzilini kiritish mumkin. Yuqori sifatli rasm ishtahani ochadi!</p>
                                  <Input value={editingDish?.imageUrl || ""} onChange={(e) => setEditingDish(prev => prev ? {...prev, imageUrl: e.target.value} : {imageUrl: e.target.value} as MenuItem)} placeholder={t.dishImageUrl} className="h-10 rounded-xl mt-2" />
                              </div>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                              <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest ml-1">{t.dishName}</label>
                              <Input defaultValue={editingDish?.nameUz} placeholder={t.dishName} className="h-14 rounded-2xl border-2" />
                          </div>
                          <div className="space-y-2">
                              <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest ml-1">{t.dishPrice}</label>
                              <Input type="number" defaultValue={editingDish?.price} placeholder={t.dishPrice} className="h-14 rounded-2xl border-2" />
                          </div>
                          <div className="space-y-2">
                              <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest ml-1">{t.categories}</label>
                              <select name="category" defaultValue={editingDish?.categoryId} className="w-full h-14 rounded-2xl border-2 border-[var(--line)] bg-[var(--bg)] px-4 font-semibold text-[var(--ink)] focus:border-[var(--accent)] outline-none">
                                  {categories.map(c => <option key={c.id} value={c.id}>{getName(c)}</option>)}
                              </select>
                          </div>
                      </div>

                      <div className="space-y-2">
                          <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest ml-1">{t.dishDescription}</label>
                          <textarea 
                            defaultValue={editingDish?.descriptionUz}
                            className="w-full h-32 rounded-2xl border-2 border-[var(--line)] bg-[var(--bg)] p-4 text-[var(--ink)] outline-none focus:border-[var(--accent)] transition resize-none"
                            placeholder={t.dishDescription}
                          />
                      </div>

                      <div className="flex gap-4 pt-4">
                          <Button className="flex-1 h-16 rounded-[2rem] text-lg font-black shadow-xl shadow-[var(--accent)]/20" onClick={saveDish}>
                              {t.save}
                          </Button>
                          <Button variant="secondary" className="h-16 px-10 rounded-[2rem] text-lg font-bold" onClick={() => setShowDishModal(false)}>
                              {t.cancel}
                          </Button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
