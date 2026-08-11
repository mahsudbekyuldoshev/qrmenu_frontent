"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { 
  Building2, Plus, Users, LayoutDashboard, LogOut, Edit2, Trash2,
  XCircle, ShieldCheck, CreditCard, TrendingUp, Loader2
} from "lucide-react";
import { 
    Area, AreaChart, Bar, BarChart, CartesianGrid, Pie, PieChart, Cell, 
    ResponsiveContainer, Tooltip, XAxis, YAxis 
} from "recharts";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth-store";
import { TopBar } from "@/components/chrome/TopBar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { LanguageSelect } from "@/components/chrome/LanguageSelect";
import { usePreferences } from "@/providers/PreferencesProvider";
import {
  superAdminService,
  type RestaurantApi,
  type DirectorApi,
  type AdminAnalyticsApi,
} from "@/lib/services/super-admin.service";

const Map = dynamic(() => import("./MapComponent"), { ssr: false });

type Tab = "analytics" | "restaurants" | "directors";

export function SuperAdminDashboard() {
  const router = useRouter();
  const { t } = usePreferences();
  const [activeTab, setActiveTab] = useState<Tab>("analytics");
  const [showModal, setShowModal] = useState<"restaurant" | "director" | null>(null);
  const [editingItem, setEditingItem] = useState<RestaurantApi | DirectorApi | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // Data from API
  const [restaurants, setRestaurants] = useState<RestaurantApi[]>([]);
  const [directors, setDirectors] = useState<DirectorApi[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalyticsApi | null>(null);

  // Restaurant modal: director selection
  const [selectedDirectorId, setSelectedDirectorId] = useState<string>("__new__");
  const [newDirName, setNewDirName] = useState("");
  const [newDirPhone, setNewDirPhone] = useState("");

  // Form refs
  const restaurantNameRef = useRef<HTMLInputElement>(null);
  const dirFirstRef = useRef<HTMLInputElement>(null);
  const dirLastRef = useRef<HTMLInputElement>(null);
  const dirPhoneRef = useRef<HTMLInputElement>(null);

  // Biriktirilmagan direktorlar
  const unassignedDirectors = directors.filter(d => !d.restaurant_id);
  const existingDir = selectedDirectorId === "__new__" ? null : directors.find(d => String(d.id) === selectedDirectorId) ?? null;

  // Dastlabki yuklash
  useEffect(() => {
    setLoading(true);
    Promise.all([
      superAdminService.getDashboard(),
      superAdminService.getAnalytics(),
    ]).then(([dashRes, analyticsRes]) => {
      setRestaurants(dashRes.data.restaurants);
      setDirectors(
        dashRes.data.restaurants
          .map(r => r.director)
          .filter((d): d is DirectorApi => d !== null)
          .concat(
            // biriktirilmagan direktorlarni qo'shamiz
          [] as DirectorApi[]
          )
      );
      setAnalytics(analyticsRes.data);
    }).catch(() => toast.error("Ma'lumotlarni yuklashda xatolik"))
      .finally(() => setLoading(false));

    // Biriktirilmagan direktorlarni alohida yuklash
    superAdminService.getDirectors().then(res => setDirectors(res.data)).catch(() => {});
  }, []);

  function handleDirectorSelect(id: string) {
    setSelectedDirectorId(id);
    const dir = directors.find(d => String(d.id) === id);
    setNewDirName(dir ? [dir.first_name, dir.last_name].filter(Boolean).join(" ") : "");
    setNewDirPhone(dir?.phone ?? "");
  }

  function openRestaurantModal(item: RestaurantApi | null) {
    setEditingItem(item);
    setSelectedDirectorId("__new__");
    setNewDirName("");
    setNewDirPhone("");
    setSelectedLocation(null);
    setShowModal("restaurant");
  }

  async function handleSaveRestaurant() {
    const name = restaurantNameRef.current?.value?.trim();
    if (!name) return toast.error("Restoran nomi kiritilmagan");
    setSaving(true);
    try {
      if (editingItem) {
        // Tahrirlash
        const updated = await superAdminService.updateRestaurant(Number((editingItem as RestaurantApi).id), { name });
        setRestaurants(prev => prev.map(r => r.id === updated.data.id ? updated.data : r));
      } else {
        // Yangi restoran
        const created = await superAdminService.createRestaurant({ name });
        let finalRestaurant = created.data;

        if (selectedDirectorId === "__new__" && newDirName) {
          // Yangi direktor ham yaratamiz
          const [first_name, ...rest] = newDirName.trim().split(" ");
          const newDir = await superAdminService.createDirector({
            phone: newDirPhone,
            first_name,
            last_name: rest.join(" "),
          });
          // Direktorni restoranga biriktiramiz
          const assigned = await superAdminService.assignDirector(finalRestaurant.id, { director_id: newDir.data.id });
          finalRestaurant = assigned.data;
          setDirectors(prev => [...prev, newDir.data]);
        } else if (selectedDirectorId !== "__new__") {
          // Mavjud direktorni biriktiramiz
          const assigned = await superAdminService.assignDirector(finalRestaurant.id, { director_id: Number(selectedDirectorId) });
          finalRestaurant = assigned.data;
        }
        setRestaurants(prev => [finalRestaurant, ...prev]);
      }
      setShowModal(null);
      toast.success(editingItem ? "Yangilandi" : "Restoran qo'shildi");
    } catch (e: any) {
      toast.error(e?.response?.data?.detail ?? "Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveDirector() {
    const first_name = dirFirstRef.current?.value?.trim() ?? "";
    const last_name = dirLastRef.current?.value?.trim() ?? "";
    const phone = dirPhoneRef.current?.value?.trim() ?? "";
    if (!phone) return toast.error("Telefon raqam kiritilmagan");
    setSaving(true);
    try {
      if (editingItem) {
        const updated = await superAdminService.updateDirector(Number((editingItem as DirectorApi).id), { first_name, last_name });
        setDirectors(prev => prev.map(d => d.id === updated.data.id ? updated.data : d));
      } else {
        const created = await superAdminService.createDirector({ phone, first_name, last_name });
        setDirectors(prev => [created.data, ...prev]);
        if (created.data.generated_password) {
          toast.success(`Vaqtinchalik parol: ${created.data.generated_password}`, { duration: 10000 });
        }
      }
      setShowModal(null);
      toast.success(editingItem ? "Yangilandi" : "Direktor qo'shildi");
    } catch (e: any) {
      toast.error(e?.response?.data?.detail ?? "Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteRestaurant(id: number) {
    if (!confirm("Restoranni o'chirishni tasdiqlaysizmi?")) return;
    try {
      await superAdminService.deleteRestaurant(id);
      setRestaurants(prev => prev.filter(r => r.id !== id));
      toast.success("O'chirildi");
    } catch { toast.error("O'chirishda xatolik"); }
  }

  async function handleDeleteDirector(id: number) {
    if (!confirm("Direktorni o'chirishni tasdiqlaysizmi?")) return;
    try {
      await superAdminService.deleteDirector(id);
      setDirectors(prev => prev.filter(d => d.id !== id));
      toast.success("O'chirildi");
    } catch { toast.error("O'chirishda xatolik"); }
  }

  const NavItem = ({ tab, label, icon: Icon }: { tab: Tab; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl transition ${
        activeTab === tab 
          ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20" 
          : "hover:bg-[var(--surface-2)] text-[var(--muted)]"
      }`}
    >
      <Icon className="size-5" /> <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-dvh bg-[var(--bg)] font-sans">
      <aside className="w-72 border-r border-[var(--line)] bg-[var(--surface)] p-6 hidden lg:flex flex-col sticky top-0 h-dvh">
        <div className="mb-10 px-2">
            <div className="flex items-center gap-3 mb-2">
                <div className="size-10 rounded-2xl bg-[var(--accent)] flex items-center justify-center text-white shadow-lg shadow-[var(--accent)]/30">
                    <ShieldCheck className="size-6" />
                </div>
                <h1 className="font-bold text-xl tracking-tight text-[var(--ink)]">RestoFlow</h1>
            </div>
            <p className="text-xs font-medium text-[var(--muted)] px-1">Super Admin Panel</p>
        </div>
        
        <nav className="space-y-2 flex-1">
          <NavItem tab="analytics" label={t.analytics} icon={LayoutDashboard} />
          <NavItem tab="restaurants" label={t.restaurants} icon={Building2} />
          <NavItem tab="directors" label={t.directors} icon={Users} />
        </nav>

        <div className="pt-6 border-t border-[var(--line)]">
             <button onClick={() => { useAuthStore.getState().logout(); router.push("/login"); }} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition">
                <LogOut className="size-5" /> <span className="font-medium">{t.logout}</span>
            </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
            left={<h2 className="font-bold text-xl text-[var(--ink)] capitalize ml-2">{t[activeTab as keyof typeof t] as string}</h2>}
            right={
            <>
                <LanguageSelect />
                <ThemeToggle />
            </>
            }
        />
        
        <main className="p-4 md:p-8">
            {activeTab === "analytics" && (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <MetricCard icon={<Building2 className="size-6 text-accent" />} label="Restoranlar" value={String(restaurants.length)} color="accent" />
                        <MetricCard icon={<CreditCard className="size-6 text-emerald-500" />} label="Oylik tushum" value="124.5M UZS" color="emerald" />
                        <MetricCard icon={<TrendingUp className="size-6 text-blue-500" />} label="Faol obunalar" value={String(restaurants.filter(r => r.status === 'active').length)} color="blue" />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="bg-[var(--surface)] p-6 rounded-3xl border border-[var(--line)] shadow-sm">
                            <h3 className="text-lg font-bold text-[var(--ink)] mb-6">Tushum dinamikasi</h3>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={[{name: 'Yan', val: 40}, {name: 'Fev', val: 30}, {name: 'Mar', val: 50}, {name: 'Apr', val: 80}, {name: 'May', val: 70}]}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--muted)', fontSize: 12}} dy={10} />
                                        <YAxis hide />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', background: 'var(--surface)' }} />
                                        <Area type="monotone" dataKey="val" stroke="var(--accent)" strokeWidth={3} fillOpacity={0.1} fill="var(--accent)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="bg-[var(--surface)] p-6 rounded-3xl border border-[var(--line)] shadow-sm">
                            <h3 className="text-lg font-bold text-[var(--ink)] mb-6">Obunalar (Trial vs Paid)</h3>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={[{name: 'Trial', value: 45}, {name: 'Paid', value: 165}]} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            <Cell fill="var(--muted)" />
                                            <Cell fill="var(--accent)" />
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Expiry Table */}
                    <div className="bg-[var(--surface)] rounded-[2rem] border border-[var(--line)] shadow-sm overflow-hidden">
                        <h3 className="p-6 text-lg font-bold text-[var(--ink)]">Obunalar muddati (Expiry Tracker)</h3>
                        <table className="w-full text-left">
                            <thead className="bg-[var(--surface-2)]">
                                <tr>
                                    <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">Restoran</th>
                                    <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">Muddati</th>
                                    <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--line)]">
                                {restaurants.map(r => (
                                    <tr key={r.id}>
                                        <td className="p-6 font-bold">{r.name}</td>
                                        <td className="p-6">{r.daysLeft} kun qoldi</td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.daysLeft < 10 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                {r.daysLeft < 10 ? 'Shoshilinch' : 'Normal'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {(activeTab === "restaurants" || activeTab === "directors") && (
                <StaffTable
                    title={activeTab === "restaurants" ? t.restaurants : t.directors}
                    data={activeTab === "restaurants" ? restaurants : directors}
                    onAdd={() => { if (activeTab === "restaurants") { openRestaurantModal(null); } else { setEditingItem(null); setShowModal("director"); } }}
                    onEdit={(item) => { if (activeTab === "restaurants") { openRestaurantModal(item); } else { setEditingItem(item); setShowModal("director"); } }}
                    onDelete={(id) => activeTab === "restaurants" ? setRestaurants(prev => prev.filter(x => x.id !== id)) : setDirectors(prev => prev.filter(x => x.id !== id))}
                    t={t}
                />
            )}
        </main>

        {/* Restaurant/Director Modal */}
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-[var(--surface)] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl p-10 border border-[var(--line)] animate-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-black text-[var(--ink)]">
                          {showModal === 'restaurant' ? (editingItem ? t.editRestaurant : t.addRestaurant) : (editingItem ? t.editDirector : t.addDirector)}
                        </h2>
                        <button onClick={() => setShowModal(null)} className="size-12 rounded-2xl hover:bg-[var(--surface-2)] flex items-center justify-center transition">
                            <XCircle className="size-8 text-[var(--muted)]" />
                        </button>
                    </div>

                    {showModal === 'restaurant' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Left: form fields */}
                            <div className="space-y-6">
                                <Input label={t.restaurantName} defaultValue={editingItem?.name} className="h-14 rounded-2xl border-2" />
                                <Input label={t.address} value={selectedLocation ? `Lat: ${selectedLocation.lat.toFixed(4)}, Lng: ${selectedLocation.lng.toFixed(4)}` : editingItem?.address || ""} readOnly className="h-14 rounded-2xl border-2 bg-[var(--surface-2)]/50" />

                                {/* Director select */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-[var(--muted)] uppercase tracking-widest">Direktor</label>
                                    <select
                                        value={selectedDirectorId}
                                        onChange={e => handleDirectorSelect(e.target.value)}
                                        className="w-full h-14 rounded-2xl border-2 border-[var(--line)] bg-[var(--bg)] px-4 font-semibold text-[var(--ink)] focus:border-[var(--accent)] outline-none transition"
                                    >
                                        <option value="__new__">+ Yangi direktor</option>
                                        {unassignedDirectors.map(d => (
                                            <option key={d.id} value={d.id}>{d.fullName} — {d.phone}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* F.I.Sh — always visible */}
                                <Input
                                    label="F.I.Sh."
                                    value={newDirName}
                                    onChange={e => !existingDir && setNewDirName(e.target.value)}
                                    disabled={!!existingDir}
                                    placeholder={existingDir ? "" : "Direktor to'liq ismi"}
                                    className={`h-14 rounded-2xl border-2 transition ${existingDir ? "bg-[var(--surface-2)]/70 opacity-80 cursor-not-allowed" : ""}`}
                                />

                                {/* Telefon — always visible */}
                                <Input
                                    label="Telefon"
                                    value={newDirPhone}
                                    onChange={e => !existingDir && setNewDirPhone(e.target.value)}
                                    disabled={!!existingDir}
                                    placeholder={existingDir ? "" : "+998 xx xxx xx xx"}
                                    className={`h-14 rounded-2xl border-2 transition ${existingDir ? "bg-[var(--surface-2)]/70 opacity-80 cursor-not-allowed" : ""}`}
                                />
                            </div>
                            {/* Right: map */}
                            <div className="aspect-square bg-[var(--bg)] rounded-[2.5rem] border-2 border-[var(--line)] overflow-hidden relative">
                                <Map onLocationSelect={(lat, lng) => setSelectedLocation({ lat, lng })} markerPosition={selectedLocation} />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <Input label={t.fullName} defaultValue={editingItem?.fullName} className="h-14 rounded-2xl border-2" />
                            <Input label={t.phone} defaultValue={editingItem?.phone} className="h-14 rounded-2xl border-2" />
                            <Input label={t.email} defaultValue={editingItem?.email} className="h-14 rounded-2xl border-2" />
                        </div>
                    )}

                    <div className="mt-12 flex gap-4">
                        <Button className="flex-1 h-16 rounded-[2rem] text-lg font-black" onClick={() => setShowModal(null)}>{t.save}</Button>
                        <Button variant="secondary" className="h-16 px-10 rounded-[2rem] text-lg font-bold" onClick={() => setShowModal(null)}>{t.cancel}</Button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
    return (
        <div className="bg-[var(--surface)] p-6 rounded-3xl border border-[var(--line)] shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-4">
                <div className={`size-12 rounded-2xl bg-[var(--bg)] flex items-center justify-center border border-[var(--line)]`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
                    <h4 className="text-2xl font-bold text-[var(--ink)] mt-0.5">{value}</h4>
                </div>
            </div>
        </div>
    );
}

function StaffTable({ title, data, onAdd, onEdit, onDelete, t }: { title: string, data: any[], onAdd?: () => void, onEdit?: (item: any) => void, onDelete: (id: string) => void, t: any }) {
    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[var(--ink)]">{title}</h2>
                <Button size="sm" onClick={onAdd}>
                    <Plus className="size-4 mr-2" /> Qo'shish
                </Button>
            </div>
            <div className="bg-[var(--surface)] rounded-[2rem] border border-[var(--line)] shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[var(--surface-2)]">
                        <tr>
                            <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">Ism / Nom</th>
                            <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">Ma'lumot</th>
                            <th className="p-6"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                        {data.map(item => (
                            <tr key={item.id} className="hover:bg-[var(--surface-2)]/50 transition">
                                <td className="p-6 font-bold text-[var(--ink)]">{item.name || item.fullName}</td>
                                <td className="p-6 text-[var(--muted)]">{item.address || item.phone}</td>
                                <td className="p-6 text-right space-x-2">
                                    <Button variant="secondary" size="sm" onClick={() => onEdit?.(item)}><Edit2 className="size-4" /></Button>
                                    <Button variant="secondary" size="sm" className="text-rose-500" onClick={() => onDelete(item.id)}><Trash2 className="size-4" /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
