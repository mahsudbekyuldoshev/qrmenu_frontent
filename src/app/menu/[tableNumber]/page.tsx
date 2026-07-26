import { QrMenuView } from "@/components/menu/QrMenuView";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ tableNumber: string }>;
}) {
  const { tableNumber: raw } = await params;
  const tableNumber = Number.parseInt(raw, 10);

  if (!Number.isFinite(tableNumber) || tableNumber < 1) {
    return (
      <div className="grid min-h-dvh place-items-center px-4 text-center">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">
            Notoʻgʻri stol raqami
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            QR kod orqali qayta skanerlang.
          </p>
        </div>
      </div>
    );
  }

  return <QrMenuView tableNumber={tableNumber} />;
}
