import { QrMenuView } from "@/components/menu/QrMenuView";

export default async function MenuPage({
  params,
}: {
  params: Promise<{ qrHash: string }>;
}) {
  const { qrHash } = await params;

  return <QrMenuView qrHash={qrHash} />;
}
