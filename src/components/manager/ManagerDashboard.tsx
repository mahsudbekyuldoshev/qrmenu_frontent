"use client";

import { menuService } from "@/lib/services/menu.service";
import { staffService, type StaffApiItem } from "@/lib/services/staff.service";
import {
  Plus, Edit2, Trash2, Image as ImageIcon, Save, Loader2, LogOut,
  UtensilsCrossed, XCircle, Sparkles, UserCircle, LayoutDashboard,
  ChevronDown, Briefcase, ChefHat, Menu as MenuIcon, X,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import type { MenuItem, Category } from "@/lib/types";
import { usePreferences } from "@/providers/PreferencesProvider";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { TopBar } from "@/components/chrome/TopBar";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { LanguageSelect } from "@/components/chrome/LanguageSelect";
import { useRouter } from "next/navigation";
import { ImagePickerModal } from "@/components/manager/ImagePickerModal";
import { AnalyticsTable } from "@/components/manager/AnalyticsTable";
import { useCallback, useEffect, useState } from "react";
import type { EmploymentStatus, Waiter, Chef } from "@/lib/types";
import { formatMoney } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";

type ManagerTab = "analytics" | "menu" | "waiters" | "chefs";

function toMember(item: StaffApiItem) {
  return {
    id: String(item.id),
    fullName: [item.first_name, item.last_name].filter(Boolean).join(" ") || item.phone,
    joinedDate: item.date_joined.split("T")[0],
    salary: 0,
    role: item.role,
    employmentStatus: item.employment_status as EmploymentStatus,
    phone: item.phone,
  };
}

export function ManagerDashboard() {
  const { t, language, menuBgImage, setMenuBgImage } = usePreferences();
  const { user } = useAuthStore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ManagerTab>("analytics");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [staffMenuOpen, setStaffMenuOpen] = useState(true);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingBg, setSavingBg] = useState(false);
  const [showDishModal, setShowDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  // Staff states
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addRole, setAddRole] = useState<"waiter" | "chef">("waiter");
  const [addPhone, setAddPhone] = useState("");
  const [addFirst, setAddFirst] = useState("");
  const [addLast, setAddLast] = useState("");
  const [addBusy, setAddBusy] = useState(false);

  useEffect(() => {
    if (user && user.role !== "manager" && user.role !== "director" && user.role !== "super-admin") {
      router.replace("/login");
    }
  }, [user, router]);

  useEffect(() => {
    Promise.all([menuService.getDishes(), menuService.getCategories()]).then(([items, cats]) => {
      setMenuItems(items.data);
      setCategories(cats.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const reloadStaff = useCallback(() => {
    setStaffLoading(true);
    staffService.getAll()
      .then(({ data }) => {
        setWaiters(data.filter((x) => x.role === "waiter").map(toMember) as Waiter[]);
        setChefs(data.filter((x) => x.role === "chef" || x.role === "kitchen").map(toMember) as Chef[]);
      })
      .catch((err) => console.warn("Staff yuklanmadi:", err))
      .finally(() => setStaffLoading(false));
  }, []);

  useEffect(() => {
    reloadStaff();
  }, [reloadStaff]);

  async function handleAddStaff() {
    if (addPhone.length < 9) {
      toast.error(t.phone);
      return;
    }
    setAddBusy(true);
    try {
      const { data } = await staffService.create({
        phone: `+998${addPhone.slice(-9)}`,
        first_name: addFirst,
        last_name: addLast,
        role: addRole,
      });
      if (data.generated_password) {
        toast.success(`Parol: ${data.generated_password}`);
      } else {
        toast.success(t.save || "OK");
      }
      setShowAdd(false);
      setAddPhone("");
      setAddFirst("");
      setAddLast("");
      reloadStaff();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string; phone?: string[] } } })
          ?.response?.data?.detail ||
        (err as { response?: { data?: { phone?: string[] } } })?.response?.data?.phone?.[0] ||
        t.profileUpdateError;
      toast.error(String(msg));
    } finally {
      setAddBusy(false);
    }
  }

  async function updateEmployment(id: string, status: EmploymentStatus) {
    try {
      await staffService.update(Number(id), { employment_status: status });
      const patch = (list: { id: string; employmentStatus?: EmploymentStatus }[]) =>
        list.map((p) => (p.id === id ? { ...p, employmentStatus: status } : p));
      setWaiters((w) => patch(w) as Waiter[]);
      setChefs((c) => patch(c) as Chef[]);
      toast.success(t.save || "OK");
    } catch {
      toast.error(t.profileUpdateError || "Xatolik");
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { callback(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  async function handleSaveBg() {
    setSavingBg(true);
    setTimeout(() => { setSavingBg(false); toast.success(t.save); }, 1000);
  }

  const getName = (item: any) => {
    if (language === "uz") return item.nameUz || item.name;
    if (language === "ru") return item.nameRu || item.name;
    return item.nameEn || item.nameUz || item.name;
  };

  const getDescription = (item: any) => {
    if (language === "uz") return item.descriptionUz || item.description;
    if (language === "ru") return item.descriptionRu || item.description;
    return item.descriptionEn || item.descriptionUz || item.description;
  };

  const saveDish = () => {
    setShowDishModal(false);
    setEditingDish(null);
  };

  // Sidebar nav
  const sidebarNav = (
    <>
      <button
        type="button"
        onClick={() => { setActiveTab("analytics"); setMobileNavOpen(false); }}
        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
          activeTab === "analytics"
            ? "bg-[var(--accent)] text-white"
            : "text-[var(--muted)] hover:bg-[var(--surface-2)]"
        }`}
      >
        <LayoutDashboard className="size-5" />
        <span className="font-medium">{t.analytics}</span>
      </button>

      {/* Xodimlar: faqat Ofitsiantlar va Oshpazlar */}
      <div>
        <button
          type="button"
          onClick={() => setStaffMenuOpen((v) => !v)}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[var(--muted)] transition hover:bg-[var(--surface-2)]"
        >
          <UserCircle className="size-5" />
          <span className="flex-1 text-left font-medium">Xodimlar</span>
          <ChevronDown className={`size-4 transition-transform ${staffMenuOpen ? "rotate-180" : ""}`} />
        </button>
        {staffMenuOpen && (
          <div className="mt-1 space-y-1 border-l-2 border-[var(--line)] ml-6 pl-2">
            <button
              type="button"
              onClick={() => { setActiveTab("waiters"); setMobileNavOpen(false); }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 transition ${
                activeTab === "waiters"
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--muted)] hover:bg-[var(--surface-2)]"
              }`}
            >
              <Briefcase className="size-4 shrink-0" />
              <span className="font-medium text-sm">{t.waiters}</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("chefs"); setMobileNavOpen(false); }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 transition ${
                activeTab === "chefs"
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--muted)] hover:bg-[var(--surface-2)]"
              }`}
            >
              <ChefHat className="size-4 shrink-0" />
              <span className="font-medium text-sm">{t.chefs}</span>
            </button>
          </div>
        )}
      </div>

      {/* Menyu */}
      <button
        type="button"
        onClick={() => { setActiveTab("menu"); setMobileNavOpen(false); }}
        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
          activeTab === "menu"
            ? "bg-[var(--accent)] text-white"
            : "text-[var(--muted)] hover:bg-[var(--surface-2)]"
        }`}
      >
        <UtensilsCrossed className="size-5" />
        <span className="font-medium">{t.menu}</span>
      </button>

      {/* Profil */}
      <button
        type="button"
        onClick={() => router.push("/profile")}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[var(--muted)] transition hover:bg-[var(--surface-2)]"
      >
        <UserCircle className="size-5" />
        <span className="font-medium">{t.profile}</span>
      </button>
    </>
  );

  return (
    <div className="flex min-h-dvh bg-[var(--bg)]">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-72 flex-col border-r border-[var(--line)] bg-[var(--surface)] p-6 lg:flex">
        <div className="mb-8">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
            RestoFlow
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
            {t.managerPanel}
          </h1>
        </div>
        <nav className="flex-1 space-y-2">{sidebarNav}</nav>
        <div className="border-t border-[var(--line)] pt-6">
          <button
            type="button"
            onClick={() => { useAuthStore.getState().logout(); router.push("/login"); }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
          >
            <LogOut className="size-5" />
            <span className="font-medium">{t.logout}</span>
          </button>
        </div>
      </aside>

      {/* Mobile nav overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-[var(--surface)] p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-bold text-[var(--ink)]">{t.managerPanel}</h2>
              <button type="button" onClick={() => setMobileNavOpen(false)}>
                <X className="size-5 text-[var(--muted)]" />
              </button>
            </div>
            <nav className="flex-1 space-y-2">{sidebarNav}</nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          left={
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-xl p-2 text-[var(--muted)] hover:bg-[var(--surface-2)] lg:hidden"
                onClick={() => setMobileNavOpen(true)}
              >
                <MenuIcon className="size-5" />
              </button>
              <h1 className="text-xl font-bold text-[var(--ink)] lg:hidden">{t.managerPanel}</h1>
            </div>
          }
          right={
            <>
              <LanguageSelect />
              <ThemeToggle />
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="p-2 text-[var(--muted)] hover:text-[var(--ink)]"
                title={t.profile}
              >
                <UserCircle className="size-4" />
              </button>
              <button
                onClick={() => { useAuthStore.getState().logout(); router.push("/login"); }}
                className="p-2 text-[var(--muted)] hover:text-rose-500"
              >
                <LogOut className="size-4" />
              </button>
            </>
          }
        />

        {/* Mobile tab strip */}
        <div className="flex gap-2 overflow-x-auto border-b border-[var(--line)] px-4 py-2 lg:hidden">
          {(
            [
              ["analytics", t.analytics],
              ["waiters", t.waiters],
              ["chefs", t.chefs],
              ["menu", t.menu],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                activeTab === id
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--surface-2)] text-[var(--muted)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <main className="p-4 md:p-8">
          {/* Analitika */}
          {activeTab === "analytics" && <AnalyticsTable />}

          {/* Ofitsiantlar */}
          {activeTab === "waiters" && (
            <StaffTable
              title={t.waiters}
              data={waiters}
              loading={staffLoading}
              t={t}
              onAdd={() => { setAddRole("waiter"); setShowAdd(true); }}
              onStatusChange={updateEmployment}
            />
          )}

          {/* Oshpazlar */}
          {activeTab === "chefs" && (
            <StaffTable
              title={t.chefs}
              data={chefs}
              loading={staffLoading}
              t={t}
              onAdd={() => { setAddRole("chef"); setShowAdd(true); }}
              onStatusChange={updateEmployment}
            />
          )}

          {/* Menyu */}
          {activeTab === "menu" && (
            <div className="animate-in fade-in space-y-10 duration-500">
              {/* Menu Management */}
              <section className="rounded-[2.5rem] border border-[var(--line)] bg-[var(--surface)] p-8 shadow-xl shadow-black/5">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-[var(--ink)]">{t.menu}</h2>
                    <p className="text-sm text-[var(--muted)] mt-1">Taomlar va menyu tarkibini boshqarish</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/manager/menu">
                      <Button size="sm" variant="ghost" className="rounded-2xl h-12 px-6">
                        {t.menu} Preview
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
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 animate-pulse rounded-2xl bg-[var(--surface-2)]" />
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {menuItems.map((item) => (
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
                            <p className="text-sm font-black text-[var(--accent)] mt-0.5">{item.price?.toLocaleString()} so&apos;m</p>
                            <p className="text-xs text-[var(--muted)] mt-1 line-clamp-1">{getDescription(item)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditingDish(item); setShowDishModal(true); }} className="size-10 rounded-xl bg-[var(--surface-2)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition">
                            <Edit2 className="size-4" />
                          </button>
                          <button onClick={() => setMenuItems((prev) => prev.filter((x) => x.id !== item.id))} className="size-10 rounded-xl bg-[var(--surface-2)] flex items-center justify-center text-[var(--muted)] hover:text-rose-500 hover:bg-rose-50 transition">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {menuItems.length === 0 && (
                      <div className="py-10 text-center text-sm text-[var(--muted)]">
                        Hali taom qo&apos;shilmagan
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* Menyu dizayni */}
              <section className="rounded-[2.5rem] border border-[var(--line)] bg-[var(--surface)] p-8 shadow-xl shadow-black/5">
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
                      <Button variant="secondary" className="flex items-center justify-center gap-2 px-6 h-14 rounded-2xl font-bold" onClick={() => setShowImagePicker(true)}>
                        <Sparkles className="size-4" /> {t.selectImage}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest">{t.realTime} Preview</label>
                    <div className="relative aspect-[4/5] rounded-[2.5rem] border-4 border-[var(--ink)] overflow-hidden bg-black shadow-2xl">
                      <div
                        className="absolute inset-0 opacity-60 blur-[2px]"
                        style={{ backgroundImage: `url(${menuBgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
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
            </div>
          )}
        </main>
      </div>

      {/* Xodim qo'shish modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-[var(--ink)]">
              {t.addStaff} ({addRole === "waiter" ? t.waiters : t.chefs})
            </h3>
            <div className="space-y-3">
              <PhoneInput label={t.phone} value={addPhone} onChange={setAddPhone} />
              <Input label={t.firstName} value={addFirst} onChange={(e) => setAddFirst(e.target.value)} />
              <Input label={t.lastName} value={addLast} onChange={(e) => setAddLast(e.target.value)} />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowAdd(false)}>{t.cancel}</Button>
              <Button onClick={handleAddStaff} disabled={addBusy}>
                {addBusy ? t.saving : t.save}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Picker Modal */}
      {showImagePicker && (
        <ImagePickerModal
          onClose={() => setShowImagePicker(false)}
          onSelected={(url) => setMenuBgImage(url)}
        />
      )}

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
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleFileUpload(e, (url) => setEditingDish((prev) => prev ? { ...prev, imageUrl: url } : { imageUrl: url } as MenuItem))} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-bold text-[var(--ink)]">{t.uploadImage}</p>
                    <p className="text-xs text-[var(--muted)]">Rasm yuklang yoki URL kiriting</p>
                    <Input value={editingDish?.imageUrl || ""} onChange={(e) => setEditingDish((prev) => prev ? { ...prev, imageUrl: e.target.value } : { imageUrl: e.target.value } as MenuItem)} placeholder={t.dishImageUrl} className="h-10 rounded-xl mt-2" />
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
                  <select defaultValue={editingDish?.categoryId} className="w-full h-14 rounded-2xl border-2 border-[var(--line)] bg-[var(--bg)] px-4 font-semibold text-[var(--ink)] focus:border-[var(--accent)] outline-none">
                    {categories.map((c) => <option key={c.id} value={c.id}>{getName(c)}</option>)}
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
                <Button className="flex-1 h-16 rounded-[2rem] text-lg font-black shadow-xl shadow-[var(--accent)]/20" onClick={saveDish}>{t.save}</Button>
                <Button variant="secondary" className="h-16 px-10 rounded-[2rem] text-lg font-bold" onClick={() => setShowDishModal(false)}>{t.cancel}</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// StaffTable komponenti (ManagerDashboard uchun)
function StaffTable({
  title, data, loading, onAdd, onStatusChange, t,
}: {
  title: string;
  data: { id: string; fullName: string; joinedDate: string; salary: number; employmentStatus?: EmploymentStatus }[];
  loading: boolean;
  onAdd?: () => void;
  onStatusChange: (id: string, status: EmploymentStatus) => void;
  t: any;
}) {
  return (
    <div className="animate-in slide-in-from-bottom-4 space-y-6 duration-500">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-[var(--ink)]">{title}</h2>
        {onAdd && (
          <Button size="sm" onClick={onAdd}>
            <Plus className="mr-2 size-4" /> {t.addStaff}
          </Button>
        )}
      </div>
      <div className="overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] shadow-lg">
        {loading ? (
          <div className="p-10 text-center text-sm text-[var(--muted)]">{t.saving}</div>
        ) : data.length === 0 ? (
          <div className="p-10 text-center text-sm text-[var(--muted)]">—</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[var(--surface-2)]">
              <tr>
                <th className="p-5 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">{t.fullName}</th>
                <th className="p-5 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">{t.joinedDate}</th>
                <th className="p-5 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">{t.status}</th>
                <th className="p-5 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">{t.salary}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {data.map((person) => (
                <tr key={person.id} className="transition hover:bg-[var(--surface-2)]/50">
                  <td className="p-5 font-bold text-[var(--ink)]">{person.fullName}</td>
                  <td className="p-5 text-[var(--muted)]">{person.joinedDate}</td>
                  <td className="p-5">
                    <select
                      className="rounded-lg border border-[var(--line)] bg-transparent px-2 py-1 text-sm font-medium text-[var(--ink)] focus:outline-none"
                      value={person.employmentStatus || "working"}
                      onChange={(e) => onStatusChange(person.id, e.target.value as EmploymentStatus)}
                    >
                      <option value="working">{t.statusWorking}</option>
                      <option value="fired">{t.statusFired}</option>
                      <option value="resigned">{t.statusResigned}</option>
                    </select>
                  </td>
                  <td className="p-5 font-bold text-emerald-600">{formatMoney(person.salary)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


import { usePreferences } from "@/providers/PreferencesProvider";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TopBar } from "@/components/chrome/TopBar";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { LanguageSelect } from "@/components/chrome/LanguageSelect";
import { useRouter } from "next/navigation";
import { ImagePickerModal } from "@/components/manager/ImagePickerModal";
import { AnalyticsTable } from "@/components/manager/AnalyticsTable";
import { useEffect, useState } from "react";

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
  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    // Load categories from API or mock
    setCategories([
        { id: 1, name: "Milliy taomlar", slug: "milliy", is_active: true, ordering: 1, dishes: [] },
        { id: 2, name: "Ichimliklar", slug: "ichimlik", is_active: true, ordering: 2, dishes: [] },
    ]);
  }, []);

  const saveDish = () => {
    // ... logic remains same
    setShowDishModal(false);
    setEditingDish(null);
  };

  useEffect(() => {
    if (user && user.role !== "manager" && user.role !== "director" && user.role !== "super-admin") {
      router.replace("/login");
    }
  }, [user, router]);

  useEffect(() => {
    Promise.all([menuService.getDishes(), menuService.getCategories()]).then(([items, cats]) => {
      setMenuItems(items.data);
      setCategories(cats.data);
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
      toast.success(t.save);
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
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="p-2 text-[var(--muted)] hover:text-[var(--ink)]"
              title={t.profile}
            >
              <UserCircle className="size-4" />
            </button>
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
        <AnalyticsTable />
        {/* Menu Management */}
        <section className="rounded-[2.5rem] border border-[var(--line)] bg-[var(--surface)] p-8 shadow-xl shadow-black/5 animate-in fade-in duration-700">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-[var(--ink)]">{t.menu}</h2>
              <p className="text-sm text-[var(--muted)] mt-1">Taomlar va menyu tarkibini boshqarish</p>
            </div>
            <div className="flex gap-2">
                <Link href="/manager/menu">
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
                    <Button
                        variant="secondary"
                        className="flex items-center justify-center gap-2 px-6 h-14 rounded-2xl font-bold"
                        onClick={() => setShowImagePicker(true)}
                    >
                        <Sparkles className="size-4" /> {t.selectImage}
                    </Button>
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

      {/* Image Picker Modal */}
      {showImagePicker && (
        <ImagePickerModal
          onClose={() => setShowImagePicker(false)}
          onSelected={(url) => setMenuBgImage(url)}
        />
      )}

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
