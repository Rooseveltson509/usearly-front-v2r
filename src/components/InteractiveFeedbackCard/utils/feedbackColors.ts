/* export const getBrightness = (hex: string): number => {
  const cleaned = hex.replace("#", "");
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}; */
export const getBrightness = (hex: string): number => {
  if (!hex || !hex.startsWith("#")) return 128; // fallback neutre

  const cleaned = hex.replace("#", "");

  if (cleaned.length !== 6) return 128;

  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);

  if ([r, g, b].some((v) => Number.isNaN(v))) return 128;

  return (r * 299 + g * 587 + b * 114) / 1000;
};

export const getTextColorForBackground = (hex: string): string => {
  return getBrightness(hex) > 160 ? "#000000" : "#FFFFFF";
};

export const computeBrandColors = (base: string, light: string) => {
  const brightness = getBrightness(base);

  const isTooLight = brightness > 235;

  const adjustedBase = isTooLight
    ? "color-mix(in srgb, " + base + " 85%, black)"
    : base;

  const adjustedLight = isTooLight
    ? "color-mix(in srgb, " + base + " 15%, white)"
    : light;

  const textColor = getTextColorForBackground(adjustedBase);

  return { adjustedBase, adjustedLight, textColor, isTooLight };
};
