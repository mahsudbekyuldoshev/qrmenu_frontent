"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { 
  Building2, Plus, Users, LayoutDashboard, LogOut, Edit2, Trash2,
  CheckCircle2, XCircle, ShieldCheck, CreditCard, DollarSign, TrendingUp
} from "lucide-react";
import { 
    Area, AreaChart, Bar, BarChart, CartesianGrid, Pie, PieChart, Cell, 
    ResponsiveContainer, Tooltip, XAxis, YAxis 
} from "recharts";
import { useAuthStore } from "@/store/auth-store";
import { TopBar } from "@/components/chrome/TopBar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { LanguageSelect } from "@/components/chrome/LanguageSelect";
import type { Restaurant, Director } from "@/lib/types";
import { usePreferences } from "@/providers/PreferencesProvider";

// Dynamically import map components to avoid SSR 'window' issues
const Map = dynamic(() => import("./MapComponent"), { ssr: false });

type Tab = "analytics" | "restaurants" | "directors";

export function SuperAdminDashboard() {
  const router = useRouter();
  const { t } = usePreferences();
  const [activeTab, setActiveTab] = useState<Tab>("analytics");
  const [showModal, setShowModal] = useState<"restaurant" | "director" | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number } | null>(null);

  const [restaurants, setRestaurants] = useState<Restaurant[]>([
    { id: "1", name: "Rayhon Milliy Taomlar", address: "Toshkent, Chilonzor 4", subscriptionType: "Premium", daysLeft: 25, directorId: "d1", status: "active" },
    { id: "2", name: "Osh Markazi", address: "Toshkent, Shayxontohur", subscriptionType: "Trial", daysLeft: 5, directorId: "d2", status: "active" },
    { id: "3", name: "Evos Fast Food", address: "Toshkent, Mirobod", subscriptionType: "Premium", daysLeft: 120, directorId: "d3", status: "inactive" },
  ]);

  const [directors, setDirectors] = useState<Director[]>([
    { id: "d1", fullName: "Aziz Rahimov", phone: "+998 90 123 45 67", restaurantName: "Rayhon Milliy Taomlar", email: "aziz@mail.com", role: "director" },
    { id: "d2", fullName: "Jamshid Karimov", phone: "+998 93 321 65 43", restaurantName: "Osh Markazi", email: "jamshid@mail.com", role: "director" },
  ]);

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
                    onAdd={() => { setEditingItem(null); setShowModal(activeTab === "restaurants" ? "restaurant" : "director"); }}
                    onEdit={(item) => { setEditingItem(item); setShowModal(activeTab === "restaurants" ? "restaurant" : "director"); }}
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
                            <div className="space-y-6">
                                <Input label={t.restaurantName} defaultValue={editingItem?.name} className="h-14 rounded-2xl border-2" />
                                <Input label={t.address} value={selectedLocation ? `Lat: ${selectedLocation.lat.toFixed(4)}, Lng: ${selectedLocation.lng.toFixed(4)}` : editingItem?.address || ""} readOnly className="h-14 rounded-2xl border-2 bg-[var(--surface-2)]/50" />
                            </div>
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
