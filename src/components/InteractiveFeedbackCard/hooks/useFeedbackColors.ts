export const useFeedbackColors = (base: string, light: string) => {
  // Calcule la luminosité d'une couleur (0–255)
  const getBrightness = (hex: string): number => {
    const cleaned = hex.replace("#", "");
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  const baseBrightness = getBrightness(base);
  const lightBrightness = getBrightness(light);

  // ✅ Détection précise : marque très claire
  const isTooLight = baseBrightness > 230 || lightBrightness > 230;

  // ✅ Fallback couleurs neutres si marque trop claire
  const adjustedBase = isTooLight ? "#4A90E2" : base;
  const adjustedLight = isTooLight ? "rgba(74,144,226,0.15)" : light;

  // ✅ Texte noir si base trop claire, sinon blanc
  const textColor =
    isTooLight || baseBrightness > 180 || lightBrightness > 180
      ? "#000"
      : "#fff";

  return { adjustedBase, adjustedLight, textColor, isTooLight };
};
