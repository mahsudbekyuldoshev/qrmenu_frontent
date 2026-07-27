import { cn, statusLabel } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const tones: Record<OrderStatus, string> = {
  pending:
    "bg-[var(--status-pending-bg)] text-[var(--status-pending-fg)] border-[var(--status-pending-border)]",
  preparing:
    "bg-[var(--status-preparing-bg)] text-[var(--status-preparing-fg)] border-[var(--status-preparing-border)]",
  ready:
    "bg-[var(--status-ready-bg)] text-[var(--status-ready-fg)] border-[var(--status-ready-border)]",
  delivered:
    "bg-[var(--status-delivered-bg)] text-[var(--status-delivered-fg)] border-[var(--status-delivered-border)]",
  cancelled:
    "bg-[var(--status-cancelled-bg)] text-[var(--status-cancelled-fg)] border-[var(--status-cancelled-border)]",
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
