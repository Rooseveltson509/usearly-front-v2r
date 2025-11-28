/**
 * Mesure la hauteur du contenu pour savoir si la bulle doit passer en multi-ligne.
 */
export function shouldWrapByHeight(
  el: HTMLElement | null,
  threshold = 50,
): boolean {
  if (!el) return false;
  return el.getBoundingClientRect().height > threshold;
}

/**
 * Coupe “visuellement équilibrée” :
 * On cherche k qui équilibre la largeur px des lignes 1 et 2.
 */
export function breakAtBestVisualWidth(
  el: HTMLElement,
  words: string[],
): number {
  const style = getComputedStyle(el);

  const ctx = document.createElement("canvas").getContext("2d")!;
  ctx.font = `${style.fontStyle || "normal"} ${style.fontWeight || "500"} ${
    style.fontSize || "17px"
  } ${style.fontFamily || "Raleway"}`;

  const measure = (arr: string[]) => ctx.measureText(arr.join(" ")).width;

  let bestK = 2;
  let bestDiff = Infinity;

  for (let k = 2; k < words.length; k++) {
    const left = measure(words.slice(0, k));
    const right = measure(words.slice(k));
    const diff = Math.abs(left - right);

    if (diff < bestDiff) {
      bestDiff = diff;
      bestK = k;
    }
  }

  return bestK;
}

/**
 * Fallback : coupe proprement en deux lignes
 */
export function reflowPreferTwoLines(
  html: string,
  fallbackCount?: number,
): string {
  if (/<br\s*\/?>/.test(html)) return html;

  const words = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .trim()
    .split(/\s+/);

  const n = typeof fallbackCount === "number" ? fallbackCount : words.length;
  if (words.length <= 2) return html;

  let k = Math.max(2, Math.ceil(n / 2));
  if (k >= words.length) k = Math.max(2, words.length - 1);

  const first = words.slice(0, k).join(" ");
  const second = words.slice(k).join(" ");

  return second ? `${first}<br/>${second}` : first;
}
