import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function formatFullDate(dateInput: string | Date): string {
  if (!dateInput) return "Date inconnue";

  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    return "Date inconnue";
  }

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/**
 * Format relatif ultra propre
 * - enlève "environ"
 * - garde "il y a 4 jours"
 */
export function formatRelative(dateInput: string | Date): string {
  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) return "Date inconnue";

  return formatDistanceToNow(date, {
    locale: fr,
    addSuffix: true,
  }).replace("environ ", "");
}

export const toDMY = (d: Date, sep = "/", useUTC = false) => {
  const y = useUTC ? d.getUTCFullYear() : d.getFullYear();
  const m = (useUTC ? d.getUTCMonth() : d.getMonth()) + 1;
  const day = useUTC ? d.getUTCDate() : d.getDate();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(day)}${sep}${pad(m)}${sep}${y}`; // 01/12/2025
};
