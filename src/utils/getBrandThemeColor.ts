import { brandColors } from "@src/utils/brandColors";

export function getStableBrandColor(brandName: string): string {
  const normalized = brandName.trim().toLowerCase();
  const palette = brandColors[normalized] || brandColors.default;

  if (!palette || palette.length === 0) return "#000000";

  // 🔒 Hash déterministe basé sur le nom
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % palette.length;

  return palette[index];
}

/**
 * Retourne la couleur principale et une variante éclaircie pour chaque marque.
 * Gère aussi les cas extrêmes (fond noir/blanc) pour éviter les collisions visuelles.
 */
export function getBrandThemeColor(brandName: string) {
  //const baseColor = getRandomBrandColor(brandName?.toLowerCase() || "default");
  const baseColor = getStableBrandColor(brandName?.toLowerCase() || "default");

  const brightness = getBrightness(baseColor);
  const isDark = brightness < 128;

  // ✅ Détection des cas extrêmes (fond noir ou blanc pur)
  const isPureBlack = baseColor.toLowerCase() === "#000000";
  const isPureWhite = baseColor.toLowerCase() === "#ffffff" || brightness > 240;

  let lightColor = baseColor;

  // ✅ Si noir pur → on éclaircit légèrement
  if (isPureBlack) {
    lightColor = lightenHex(baseColor, 15); // gris foncé
  }
  // ✅ Si blanc pur → on assombrit légèrement
  else if (isPureWhite) {
    lightColor = darkenHex(baseColor, 15); // gris clair
  }
  // ✅ Sinon (toutes les autres marques), on garde un léger éclaircissement pour cohérence
  else {
    lightColor = lightenHex(baseColor, 25);
  }

  return {
    base: baseColor,
    light: lightColor,
    isDark,
    isPureBlack,
    isPureWhite,
  };
}

// === Utilitaires internes ===

// Luminosité perçue (formule BT.709)
function getBrightness(hex: string) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

// Éclaircir une couleur
function lightenHex(hex: string, percent: number) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

// Assombrir une couleur
function darkenHex(hex: string, percent: number) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00ff) - amt;
  const B = (num & 0x0000ff) - amt;

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}
