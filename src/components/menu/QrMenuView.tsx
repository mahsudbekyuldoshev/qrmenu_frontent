"use client";

import { useEffect, useState } from "react";
import { menuService } from "@/lib/services/menu.service";

interface QrMenuViewProps {
  qrHash?: string;
  readOnly?: boolean;
}

export function QrMenuView({ qrHash, readOnly = false }: QrMenuViewProps) {
  const [menuData, setMenuData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        setLoading(true);
        if (readOnly) {
          const [cats, menu] = await Promise.all([
            menuService.getCategories(),
            menuService.getDishes(),
          ]);
          setMenuData({
            restaurant_name: "Restoran Menyu",
            categories: cats.data.map((cat: any) => ({
              ...cat,
              dishes: menu.data.filter((d: any) => d.category === cat.id || d.categoryId === cat.id),
            })),
          });
        } else if (qrHash) {
          const data = await menuService.getPublicMenu(qrHash);
          setMenuData(data.data);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, [qrHash, readOnly]);

  useEffect(() => {
    if (menuData?.categories?.length > 0 && !activeCategory) {
      setActiveCategory(menuData.categories[0].id);
    }
  }, [menuData]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">Menyu yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-950 text-white p-6 text-center">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center text-2xl mb-4 border border-red-500/20">
          ⚠️
        </div>
        <h1 className="text-2xl font-bold mb-2">
          {readOnly ? "Menyuni yuklashda xatolik" : "Noto'g'ri yoki eskirgan QR kod"}
        </h1>
        <p className="text-slate-400 text-sm max-w-xs">
          Iltimos sahifani yangilang yoki menejerga murojaat qiling.
        </p>
      </div>
    );
  }

  // Manager yuklagan fon rasmini aniqlaymiz (agar boshqa nomda bo'lsa shuni o'zgartirishingiz mumkin)
  const bgImage = menuData.background_image || menuData.bg_image || menuData.cover;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 relative selection:bg-amber-500 selection:text-slate-950">
      {/* Agar manager tomonidan fon rasmi yuklangan bo'lsa, uni shu yerda ko'rsatamiz */}
      {bgImage && (
        <div className="absolute inset-0 h-96 w-full overflow-hidden z-0">
          <img
            src={bgImage}
            alt="Restaurant Background"
            className="w-full h-full object-cover filter brightness-50 blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950"></div>
        </div>
      )}

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/60 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30 text-xl">
                🍽️
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-white drop-shadow-md">
                  {menuData.restaurant_name || "Restoran Menyu"}
                </h1>
                {!readOnly && menuData.table_number ? (
                  <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 mt-0.5 backdrop-blur-md">
                    Stol #{menuData.table_number}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">Elektron Menyu</span>
                )}
              </div>
            </div>
          </div>

          {/* Categories Navigation Pills */}
          {menuData.categories?.length > 0 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pt-2 pb-1">
              {menuData.categories.map((category: any) => {
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      const element = document.getElementById(`cat-${category.id}`);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 scale-105 font-extrabold"
                        : "bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800/80 backdrop-blur-md"
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* Main Menu Body */}
      <main className="relative z-10 space-y-10 max-w-2xl mx-auto px-4 pt-6">
        {menuData.categories?.map((category: any) => (
          <section key={category.id} id={`cat-${category.id}`} className="scroll-mt-36">
            {/* Category Title Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2.5 h-6 bg-amber-500 rounded-full shadow-md shadow-amber-500/50"></div>
              <h2 className="text-xl font-black text-white tracking-wide drop-shadow">
                {category.name}
              </h2>
              <span className="text-xs text-slate-400 font-semibold bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800">
                {category.dishes?.length || 0} taom
              </span>
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 gap-4">
              {category.dishes?.length > 0 ? (
                category.dishes.map((dish: any) => (
                  <div
                    key={dish.id}
                    className="group relative flex gap-4 bg-slate-900/60 hover:bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 hover:border-amber-500/50 p-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10"
                  >
                    {/* Dish Image */}
                    {dish.image ? (
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 overflow-hidden rounded-xl bg-slate-800 border border-slate-700/50">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl bg-slate-800/80 border border-slate-800 flex items-center justify-center text-3xl text-slate-600 group-hover:border-slate-700 transition-colors">
                        🍲
                      </div>
                    )}

                    {/* Dish Content Details */}
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <h3 className="font-bold text-white text-base sm:text-lg group-hover:text-amber-400 transition-colors leading-snug">
                          {dish.name}
                        </h3>
                        {dish.description && (
                          <p className="text-xs sm:text-sm text-slate-300/80 mt-1 line-clamp-2 leading-relaxed">
                            {dish.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80">
                        <span className="font-black text-amber-400 text-base sm:text-lg tracking-tight">
                          {Number(dish.price).toLocaleString()} so'm
                        </span>
                        {dish.weight && (
                          <span className="text-xs font-bold text-slate-300 bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700/60">
                            {dish.weight}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-slate-900/40 backdrop-blur-md border border-dashed border-slate-800 rounded-2xl">
                  <p className="text-slate-400 text-sm font-medium">Bu kategoriyada hozircha taomlar mavjud emas</p>
                </div>
              )}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
