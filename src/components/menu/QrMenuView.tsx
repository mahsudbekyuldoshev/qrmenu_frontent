"use client";

import { useEffect, useState } from "react";
import { menuService } from "@/lib/services/menu.service";
import { Category, MenuItem } from "@/lib/types";

interface QrMenuViewProps {
  qrHash?: string;
  readOnly?: boolean;
}

export function QrMenuView({ qrHash, readOnly = false }: QrMenuViewProps) {
  const [menuData, setMenuData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchMenu() {
      try {
        setLoading(true);
        if (readOnly) {
          // If readOnly (Director), fetch general menu
          const [cats, menu] = await Promise.all([
            menuService.getCategories(),
            menuService.getDishes(),
          ]);
          setMenuData({
            restaurant_name: "Restoran Menyu",
            categories: cats.data.map((cat) => ({
              ...cat,
              dishes: menu.data.filter((d) => d.category === cat.id || d.categoryId === cat.id),
            })),
          });
        } else if (qrHash) {
          // Public menu via hash
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Yuklanmoqda...
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold">
          {readOnly ? "Menyuni yuklashda xatolik" : "Noto'g'ri QR kod"}
        </h1>
        <p className="text-gray-400">Iltimos qayta urinib ko'ring.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold">{menuData.restaurant_name}</h1>
        {!readOnly && <p className="text-gray-400">Stol raqami: {menuData.table_number}</p>}
      </header>

      <main className="space-y-6 max-w-2xl mx-auto">
        {menuData.categories?.map((category: any) => (
          <div key={category.id} className="bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2">
              {category.name}
            </h2>
            <div className="space-y-4">
              {category.dishes?.map((dish: any) => (
                <div key={dish.id} className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{dish.name}</h3>
                    <p className="text-sm text-gray-400">{dish.description}</p>
                  </div>
                  <span className="font-bold text-green-400">{dish.price} so'm</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
