export type TicketStatusKey =
  | "open"
  | "in_progress"
  | "waiting_user"
  | "resolved"
  | "closed";

export const TICKET_STATUSES = [
  {
    key: "open",
    label: "Transmis",
    color: "#000000", // blue-600
    bg: "rgba(37, 99, 235, 0.12)",
  },
  {
    key: "in_progress",
    label: "En cours de correction",
    color: "#000000", // amber-600
    bg: "rgba(217, 119, 6, 0.14)",
  },
  {
    key: "waiting_user",
    label: "En attente utilisateur",
    color: "#000000", // violet-600
    bg: "rgba(124, 58, 237, 0.14)",
  },
  {
    key: "resolved",
    label: "Résolu",
    color: "#000000", // green-700
    bg: "rgba(21, 128, 61, 0.14)",
  },
  {
    key: "closed",
    label: "Clôturé",
    color: "#000000", // slate-700
    bg: "rgba(51, 65, 85, 0.12)",
  },
];
