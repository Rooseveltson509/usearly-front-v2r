import { brandColors } from "./brandColors";

/**
 * 📦 Retourne les 3 couleurs officielles d’une marque (sans rien inventer)
 */
export function getOfficialPalette(brandName: string): string[] {
  const normalized = brandName.trim().toLowerCase();
  return brandColors[normalized] || brandColors.default;
}

/**
 * 🎨 Choisit une couleur pour le SVG
 * - Toujours dans la palette officielle
 * - Toujours différente de la bulle
 * - Jamais noire ou trop sombre
 */
export function pickSvgColor(palette: string[], bubbleColor: string): string {
  if (!palette || palette.length === 0) return bubbleColor;

  // 🟥 Si palette uniquement en gris/noir → SVG forcé en rouge
  if (isMonochromePalette(palette)) {
    return "#FF4D4D"; // Rouge propre / lisible
  }

  // ⬇️ Sinon logique normale
  const options = palette.filter((c) => c !== bubbleColor);

  if (options.length === 0) return palette[0];

  // Évite noir/gris foncé
  const safeOptions = options.filter((c) => {
    const hex = c.replace("rgb(", "").replace(")", "").split(",");
    if (hex.length === 3) {
      const [r, g, b] = hex.map((n) => parseInt(n.trim(), 10));
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      return lum > 80;
    }
    return true;
  });

  if (safeOptions.length > 0) return safeOptions[0];

  return options[0];
}

export function isMonochromePalette(colors: string[]): boolean {
  if (!colors || colors.length === 0) return false;

  const isGrayish = (color: string): boolean => {
    // Accepte hex ou rgb(...)
    if (color.startsWith("rgb")) {
      const [r, g, b] = color
        .replace("rgb(", "")
        .replace(")", "")
        .split(",")
        .map((v) => parseInt(v.trim(), 10));
      return Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && r < 120; // gris/noir
    }

    let hex = color.replace("#", "");
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((ch) => ch + ch)
        .join("");
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && r < 120;
  };

  return colors.every((c) => isGrayish(c));
}
