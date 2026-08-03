import { QrMenuView } from "@/components/menu/QrMenuView";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ManagerMenuPage() {
  return (
    <div className="p-4">
      <Link href="/manager" className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--ink)] mb-4">
        <ArrowLeft className="size-4" />
        Manager paneliga qaytish
      </Link>
      <QrMenuView readOnly={true} />
    </div>
  );
}
