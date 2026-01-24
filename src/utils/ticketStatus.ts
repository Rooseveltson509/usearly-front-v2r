import type { TicketStatusKey } from "@src/types/ticketStatus";

const STATUS_ORDER: Record<TicketStatusKey, number> = {
  open: 0,
  waiting_user: 1,
  in_progress: 2,
  resolved: 3,
  closed: 4,
};

export function getMostAdvancedStatus(
  a?: TicketStatusKey,
  b?: TicketStatusKey,
): TicketStatusKey | undefined {
  if (!a) return b;
  if (!b) return a;
  return STATUS_ORDER[b] > STATUS_ORDER[a] ? b : a;
}
