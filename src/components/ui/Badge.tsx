import { cn, statusLabel } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const tones: Record<OrderStatus, string> = {
  pending: "bg-[#fff4e5] text-[#b54708] border-[#f7d5a8]",
  preparing: "bg-[#eef4ff] text-[#175cd3] border-[#b2ccff]",
  ready: "bg-[#ecfdf3] text-[#067647] border-[#abefc6]",
  delivered: "bg-[#f2f4f7] text-[#344054] border-[#d0d5dd]",
  cancelled: "bg-[#fef3f2] text-[#b42318] border-[#fecdca]",
};

export function StatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold tracking-wide",
        tones[status],
        className,
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
