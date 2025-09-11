export function getContrastTextColor(hexColor: string): string {
  if (!hexColor) return "#000"; // fallback noir

  // Convertir hex -> RGB
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Luminosité perçue (formule WCAG)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Si couleur trop sombre → texte blanc, sinon noir
  return luminance > 0.5 ? "#000" : "#fff";
}
