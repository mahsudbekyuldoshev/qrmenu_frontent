import { QrMenuView } from "@/components/menu/QrMenuView";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DirectorMenuPage() {
  return (
    <div className="p-4">
      <Link href="/director" className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--ink)] mb-4">
        <ArrowLeft className="size-4" />
        Orqaga qaytish
      </Link>
      <QrMenuView readOnly={true} />
    </div>
  );
}
