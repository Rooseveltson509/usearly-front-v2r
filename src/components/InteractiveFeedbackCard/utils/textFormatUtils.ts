/**
 * Nettoie un html simple → récupère un texte brut
 */
export function htmlToWords(html: string): string[] {
  const txt = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .trim();

  return txt ? txt.split(/\s+/) : [];
}

/**
 * Compte les mots d'un HTML (sans balises)
 */
export function countWordsFromHTML(html: string): number {
  const words = htmlToWords(html);
  return words.length;
}
