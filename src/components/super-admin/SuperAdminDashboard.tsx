"use client";

import { useState } from "react";
import { Building2, Plus, Users, LayoutDashboard, LogOut, Edit2, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { TopBar } from "@/components/chrome/TopBar";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/chrome/ThemeToggle";
import { LanguageSelect } from "@/components/chrome/LanguageSelect";

type Tab = "analytics" | "restaurants" | "directors";

export function SuperAdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("analytics");

  const NavItem = ({ tab, label, icon: Icon }: { tab: Tab; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl transition ${
        activeTab === tab ? "bg-[var(--accent)] text-white" : "hover:bg-[var(--surface-2)] text-[var(--muted)]"
      }`}
    >
      <Icon className="size-5" /> {label}
    </button>
  );

  return (
    <div className="min-h-dvh flex bg-[var(--bg)]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--line)] bg-[var(--surface)] p-6">
        <h1 className="font-bold text-xl text-[var(--ink)] mb-8 px-2">RestoFlow Admin</h1>
        <nav className="space-y-2">
          <NavItem tab="analytics" label="Analitika" icon={LayoutDashboard} />
          <NavItem tab="restaurants" label="Restoranlar" icon={Building2} />
          <NavItem tab="directors" label="Direktorlar" icon={Users} />
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <TopBar
            left={<h2 className="font-semibold text-lg text-[var(--ink)] capitalize">{activeTab}</h2>}
            right={
            <>
                <LanguageSelect />
                <ThemeToggle />
                <button onClick={() => { useAuthStore.getState().logout(); router.push("/login"); }} className="p-2 text-[var(--muted)] hover:text-rose-500">
                    <LogOut className="size-4" />
                </button>
            </>
            }
        />
        
        <main className="p-8">
            {activeTab === "analytics" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--surface)] p-6 rounded-3xl border border-[var(--line)]">
                    <p className="text-[var(--muted)]">Jami restoranlar</p>
                    <p className="text-3xl font-bold text-[var(--ink)]">12</p>
                </div>
                <div className="bg-[var(--surface)] p-6 rounded-3xl border border-[var(--line)]">
                    <p className="text-[var(--muted)]">Oylik tushum</p>
                    <p className="text-3xl font-bold text-emerald-600">45,000,000 so'm</p>
                </div>
                <div className="bg-[var(--surface)] p-6 rounded-3xl border border-[var(--line)]">
                    <p className="text-[var(--muted)]">Faol obunalar</p>
                    <p className="text-3xl font-bold text-[var(--accent)]">8</p>
                </div>
            </div>
            )}

            {(activeTab === "restaurants" || activeTab === "directors") && (
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-[var(--ink)] capitalize">
                            {activeTab === "restaurants" ? "Restoranlar Ro'yxati" : "Direktorlar Ro'yxati"}
                        </h2>
                        <Button size="sm" onClick={() => alert(`Yangi ${activeTab === "restaurants" ? "restoran" : "direktor"} qo'shish (Mock)`)}>
                            <Plus className="size-4 mr-2" /> Yangi qo'shish
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {[1,2,3].map(i => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)]">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] grid place-items-center">
                                        {activeTab === "restaurants" ? <Building2 className="size-6" /> : <Users className="size-6" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[var(--ink)]">{activeTab === "restaurants" ? `Restoran ${i}` : `Direktor ${i}`}</h3>
                                        <p className="text-sm text-[var(--muted)]">ID: {1000 + i}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="secondary" size="sm" onClick={() => alert(`Tahrirlash ${i}`)}><Edit2 className="size-4" /></Button>
                                    <Button variant="secondary" size="sm" className="text-rose-500" onClick={() => alert(`O'chirish ${i}`)}><Trash2 className="size-4" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
      </div>
    </div>
  );
}
