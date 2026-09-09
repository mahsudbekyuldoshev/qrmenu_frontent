"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, DollarSign, Package } from "lucide-react";

// Mock Data
const data = [
  { name: "Mon", orders: 40, revenue: 2400 },
  { name: "Tue", orders: 30, revenue: 1398 },
  { name: "Wed", orders: 98, revenue: 3800 },
  { name: "Thu", orders: 39, revenue: 2908 },
  { name: "Fri", orders: 48, revenue: 4800 },
  { name: "Sat", orders: 38, revenue: 3800 },
  { name: "Sun", orders: 43, revenue: 4300 },
];

export function AnalyticsTable() {
  return (
    <section className="rounded-[2.5rem] border border-[var(--line)] bg-[var(--surface)] p-8 shadow-xl shadow-black/5 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-[var(--ink)]">Analitika</h2>
          <p className="text-sm text-[var(--muted)] mt-1">So'nggi haftalik ko'rsatkichlar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-3xl bg-[var(--bg)] border border-[var(--line)]">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)]">
                <TrendingUp className="size-6" />
            </div>
            <p className="text-sm font-bold text-[var(--muted)]">Jami buyurtmalar</p>
          </div>
          <h3 className="text-3xl font-black text-[var(--ink)]">1,234</h3>
        </div>
        <div className="p-6 rounded-3xl bg-[var(--bg)] border border-[var(--line)]">
            <div className="flex items-center gap-4 mb-2">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                    <DollarSign className="size-6" />
                </div>
                <p className="text-sm font-bold text-[var(--muted)]">Jami daromad</p>
            </div>
            <h3 className="text-3xl font-black text-[var(--ink)]">4.5M so'm</h3>
        </div>
         <div className="p-6 rounded-3xl bg-[var(--bg)] border border-[var(--line)]">
            <div className="flex items-center gap-4 mb-2">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                    <Package className="size-6" />
                </div>
                <p className="text-sm font-bold text-[var(--muted)]">Faol taomlar</p>
            </div>
            <h3 className="text-3xl font-black text-[var(--ink)]">86</h3>
        </div>
      </div>

      <div className="h-80 w-full mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
            <XAxis dataKey="name" stroke="var(--muted)" />
            <YAxis stroke="var(--muted)" />
            <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', borderRadius: '1rem', border: '1px solid var(--line)' }} />
            <Area type="monotone" dataKey="revenue" stroke="var(--accent)" fillOpacity={1} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
