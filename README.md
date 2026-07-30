# RestoFlow Frontend

RestoFlow — restoranlar uchun zamonaviy va ixcham boshqaruv tizimi. Loyiha restoran egalari, menejerlar va xodimlar uchun qulay interfeyslarni taqdim etadi.

## Texnologiyalar
*   **Framework:** Next.js (React)
*   **Til:** TypeScript
*   **Styling:** Tailwind CSS
*   **State Management:** Zustand
*   **Charts:** Recharts
*   **Forms & Validation:** react-hook-form, yup
*   **Map:** react-leaflet

## Asosiy Imkoniyatlar
- **Super Admin Panel:** Restoranlar va direktorlarni boshqarish, interaktiv xarita orqali joylashuvni belgilash.
- **Direktor Dashboard:** Analitika (grafiklar), menejerlar, ofitsiantlar va oshpazlar ro'yxatini boshqarish.
- **Manager Panel:** Taomlar menyusini boshqarish (CRUD), rasm yuklash va menyu dizaynini sozlash.
- **Ofitsiant va Oshxona (KDS) panellari:** Buyurtmalarni real vaqt rejimida qabul qilish va kuzatish.
- **Ko'p tillilik (i18n):** UZ, RU, EN tillarini to'liq qo'llab-quvvatlash.

## O'rnatish va Ishga tushirish

1. **Loyihani klonlash:**
   ```bash
   git clone <repo-url>
   cd qrmenu_frontent
   ```

2. **Bog'liqliklarni o'rnatish:**
   ```bash
   npm install
   ```

3. **Ishga tushirish:**
   ```bash
   npm run dev
   ```

## Loyiha tuzilmasi
- `src/app/` — Sahifalar (Next.js App Router).
- `src/components/` — UI komponentlar va dashboardlar.
- `src/lib/` — API so'rovlari, tip ta'riflari va tarjimalar.
- `src/store/` — Holatni boshqarish (Zustand).

---
*Ushbu loyiha RestoFlow tizimining frontend qismi hisoblanadi.*
