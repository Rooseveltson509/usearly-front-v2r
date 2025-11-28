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
