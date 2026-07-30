"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const restaurantSchema = yup.object({
  name: yup.string().required("Restoran nomi majburiy"),
  address: yup.string().required("Manzil majburiy"),
});

const directorSchema = yup.object({
  fullName: yup.string().required("Ism-familiya majburiy"),
  phone: yup.string().matches(/^\+998 \d{2} \d{3} \d{2} \d{2}$/, "Telefon raqam formatda: +998 90 000 00 00").required("Telefon majburiy"),
  password: yup.string().min(6, "Parol kamida 6 ta belgi bo'lishi kerak").required("Parol majburiy"),
});

import { 
  Building2, Plus, Users, LayoutDashboard, LogOut, Edit2, Trash2, MapPin, 
  CheckCircle2, XCircle, Calendar, Phone, ArrowRight, ShieldCheck, CreditCard 
} from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAuthStore } from "@/store/auth-store";
import { TopBar } from "@/components/chrome/TopBar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { LanguageSelect } from "@/components/chrome/LanguageSelect";
import type { Restaurant, Director } from "@/lib/types";
import { usePreferences } from "@/providers/PreferencesProvider";

// Fix Leaflet marker icon issue
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

type Tab = "analytics" | "restaurants" | "directors";

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export function SuperAdminDashboard() {
  const router = useRouter();
  const { t } = usePreferences();
  const [activeTab, setActiveTab] = useState<Tab>("analytics");
  const [showModal, setShowModal] = useState<"restaurant" | "director" | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number } | null>(null);

  const { register: registerRestaurant, handleSubmit: handleSubmitRestaurant, formState: { errors: restaurantErrors } } = useForm({ resolver: yupResolver(restaurantSchema) });
  const { register: registerDirector, handleSubmit: handleSubmitDirector, formState: { errors: directorErrors } } = useForm({ resolver: yupResolver(directorSchema) });

  const onSaveRestaurant = (data: any) => {
    console.log("Saving restaurant:", data, selectedLocation);
    setShowModal(null);
  };

  const onSaveDirector = (data: any) => {
    console.log("Saving director:", data);
    setShowModal(null);
  };

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
      className={`flex w-full items-center gap-3 px-4 py-3 rounded-2xl transition ${
        activeTab === tab 
          ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20" 
          : "hover:bg-[var(--surface-2)] text-[var(--muted)]"
      }`}
    >
      <Icon className="size-5" /> <span className="font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="min-h-dvh flex bg-[var(--bg)] font-sans">
      {/* Sidebar */}
      <aside className="w-80 border-r border-[var(--line)] bg-[var(--surface)] p-8 hidden lg:flex flex-col sticky top-0 h-dvh">
        <div className="flex items-center gap-3 mb-10 px-2">
            <div className="size-10 rounded-2xl bg-[var(--accent)] flex items-center justify-center text-white shadow-lg shadow-[var(--accent)]/30">
                <ShieldCheck className="size-6" />
            </div>
            <h1 className="font-black text-2xl tracking-tight text-[var(--ink)]">RestoFlow</h1>
        </div>
        
        <nav className="space-y-2.5 flex-1">
          <NavItem tab="analytics" label={t.analytics} icon={LayoutDashboard} />
          <NavItem tab="restaurants" label={t.restaurants} icon={Building2} />
          <NavItem tab="directors" label={t.directors} icon={Users} />
        </nav>

        <div className="pt-6 border-t border-[var(--line)]">
             <button onClick={() => { useAuthStore.getState().logout(); router.push("/login"); }} className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-50 transition font-semibold">
                <LogOut className="size-5" /> {t.logout}
            </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
            left={<h2 className="font-bold text-2xl text-[var(--ink)] capitalize ml-2">{t[activeTab as keyof typeof t] as string}</h2>}
            right={
            <>
                <LanguageSelect />
                <ThemeToggle />
                <button onClick={() => { useAuthStore.getState().logout(); router.push("/login"); }} className="lg:hidden p-2 text-[var(--muted)] hover:text-rose-500">
                    <LogOut className="size-4" />
                </button>
            </>
            }
        />
        
        <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">
            {/* Analytics Tab */}
            {activeTab === "analytics" && (
                <div className="space-y-10 animate-in fade-in duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <AdminStatCard label="Jami restoranlar" value={String(restaurants.length)} icon={<Building2 />} color="accent" />
                        <AdminStatCard label="Oylik tushum" value="124,500,000" icon={<CreditCard />} color="emerald" isMoney />
                        <AdminStatCard label="Faol obunalar" value={String(restaurants.filter(r => r.status === 'active').length)} icon={<CheckCircle2 />} color="blue" />
                    </div>
                </div>
            )}

            {/* Restaurants Tab */}
            {activeTab === "restaurants" && (
                <section className="animate-in slide-in-from-bottom-6 duration-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <h2 className="text-3xl font-black text-[var(--ink)]">{t.restaurants}</h2>
                        </div>
                        <Button className="rounded-2xl h-14 px-8 shadow-lg shadow-[var(--accent)]/20" onClick={() => { setEditingItem(null); setShowModal("restaurant"); }}>
                            <Plus className="size-5 mr-2" /> {t.addRestaurant}
                        </Button>
                    </div>

                    <div className="bg-[var(--surface)] rounded-[2.5rem] border border-[var(--line)] shadow-lg overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--surface-2)]">
                                <tr>
                                    <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">{t.restaurantName}</th>
                                    <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">{t.subscription}</th>
                                    <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">{t.daysLeft}</th>
                                    <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">{t.status}</th>
                                    <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">{t.address}</th>
                                    <th className="p-6"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--line)]">
                                {restaurants.map(r => (
                                    <tr key={r.id} className="hover:bg-[var(--surface-2)]/50 transition">
                                        <td className="p-6 font-bold text-[var(--ink)]">{r.name}</td>
                                        <td className="p-6">{r.subscriptionType}</td>
                                        <td className="p-6">{r.daysLeft}</td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                {r.status === 'active' ? t.active : t.inactive}
                                            </span>
                                        </td>
                                        <td className="p-6 text-[var(--muted)]">{r.address}</td>
                                        <td className="p-6 text-right space-x-2">
                                            <Button variant="secondary" size="sm" onClick={() => { setEditingItem(r); setShowModal("restaurant"); }}><Edit2 className="size-4" /></Button>
                                            <Button variant="secondary" size="sm" className="text-rose-500" onClick={() => setRestaurants(prev => prev.filter(x => x.id !== r.id))}><Trash2 className="size-4" /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {/* Directors Tab */}
            {activeTab === "directors" && (
                 <section className="animate-in slide-in-from-bottom-6 duration-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div>
                            <h2 className="text-3xl font-black text-[var(--ink)]">{t.directors}</h2>
                        </div>
                        <Button className="rounded-2xl h-14 px-8 shadow-lg shadow-[var(--accent)]/20" onClick={() => { setEditingItem(null); setShowModal("director"); }}>
                            <Plus className="size-5 mr-2" /> {t.addDirector}
                        </Button>
                    </div>

                    <div className="bg-[var(--surface)] rounded-[2.5rem] border border-[var(--line)] shadow-lg overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--surface-2)]">
                                <tr>
                                    <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">{t.fullName}</th>
                                    <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">{t.phone}</th>
                                    <th className="p-6 text-[var(--muted)] font-bold uppercase text-xs tracking-widest">{t.restaurantName}</th>
                                    <th className="p-6"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--line)]">
                                {directors.map(d => (
                                    <tr key={d.id} className="hover:bg-[var(--surface-2)]/50 transition">
                                        <td className="p-6 font-bold text-[var(--ink)]">{d.fullName}</td>
                                        <td className="p-6 text-[var(--muted)]">{d.phone}</td>
                                        <td className="p-6">{d.restaurantName || "---"}</td>
                                        <td className="p-6 text-right space-x-2">
                                            <Button variant="secondary" size="sm" onClick={() => { setEditingItem(d); setShowModal("director"); }}><Edit2 className="size-4" /></Button>
                                            <Button variant="secondary" size="sm" className="text-rose-500" onClick={() => setDirectors(prev => prev.filter(x => x.id !== d.id))}><Trash2 className="size-4" /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </main>

        {/* Restaurant Modal */}
        {showModal === "restaurant" && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-[var(--surface)] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl p-10 border border-[var(--line)] animate-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-black text-[var(--ink)]">{editingItem ? t.editRestaurant : t.addRestaurant}</h2>
                        <button onClick={() => setShowModal(null)} className="size-12 rounded-2xl hover:bg-[var(--surface-2)] flex items-center justify-center transition">
                            <XCircle className="size-8 text-[var(--muted)]" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <Input {...registerRestaurant("name")} defaultValue={editingItem?.name} label={t.restaurantName} error={restaurantErrors.name?.message} className="h-14 rounded-2xl border-2" />
                            <Input {...registerRestaurant("address")} value={selectedLocation ? `Lat: ${selectedLocation.lat.toFixed(4)}, Lng: ${selectedLocation.lng.toFixed(4)}` : editingItem?.address || ""} label={t.address} error={restaurantErrors.address?.message} readOnly className="h-14 rounded-2xl border-2 bg-[var(--surface-2)]/50" />
                        </div>

                        <div className="space-y-6">
                            <div className="aspect-square bg-[var(--bg)] rounded-[2.5rem] border-2 border-[var(--line)] overflow-hidden relative">
                                <MapContainer center={[41.2995, 69.2401]} zoom={12} className="h-full w-full">
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <MapClickHandler onLocationSelect={(lat, lng) => setSelectedLocation({ lat, lng })} />
                                    {selectedLocation && <Marker position={[selectedLocation.lat, selectedLocation.lng]} />}
                                </MapContainer>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 flex gap-4">
                        <Button className="flex-1 h-16 rounded-[2rem] text-lg font-black" onClick={handleSubmitRestaurant(onSaveRestaurant)}>{t.save}</Button>
                        <Button variant="secondary" className="h-16 px-10 rounded-[2rem] text-lg font-bold" onClick={() => setShowModal(null)}>{t.cancel}</Button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

function AdminStatCard({ label, value, icon, color, isMoney }: { label: string, value: string, icon: any, color: string, isMoney?: boolean }) {
    const colors: Record<string, string> = {
        accent: "bg-[var(--accent)] text-white shadow-[var(--accent)]/20",
        emerald: "bg-emerald-500 text-white shadow-emerald-500/20",
        blue: "bg-blue-500 text-white shadow-blue-500/20"
    };

    return (
        <div className="bg-[var(--surface)] p-8 rounded-[2.5rem] border border-[var(--line)] shadow-xl shadow-black/5">
            <div className={`size-14 rounded-3xl flex items-center justify-center mb-6 shadow-lg ${colors[color]}`}>
                {icon}
            </div>
            <p className="text-sm font-bold text-[var(--muted)] uppercase tracking-widest">{label}</p>
            <h4 className="text-3xl font-black text-[var(--ink)] mt-2">
                {value}
            </h4>
        </div>
    );
}
