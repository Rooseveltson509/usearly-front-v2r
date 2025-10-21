export const getBrightness = (hex: string): number => {
  const cleaned = hex.replace("#", "");
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
};

export const getTextColorForBackground = (hex: string): string => {
  return getBrightness(hex) > 150 ? "#000" : "#fff";
};

export const computeBrandColors = (base: string, light: string) => {
  const brightness = getBrightness(base);
  const isTooLight = brightness > 235;
  const adjustedBase = isTooLight ? "#4A90E2" : base;
  const adjustedLight = isTooLight ? "rgba(74,144,226,0.15)" : light;
  const textColor = getTextColorForBackground(adjustedBase);
  return { adjustedBase, adjustedLight, textColor, isTooLight };
};
