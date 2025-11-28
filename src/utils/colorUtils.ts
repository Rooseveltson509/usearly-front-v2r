export function pickSvgBrandColor(
  brandColors: string[],
  bubbleColor: string,
): string {
  if (!brandColors || brandColors.length === 0) return "#888"; // fallback

  // Filtre : pas la bulle, pas noir
  const available = brandColors.filter(
    (c) =>
      c.toLowerCase() !== bubbleColor.toLowerCase() &&
      c.toLowerCase() !== "#000000" &&
      c.toLowerCase() !== "#000" &&
      c.toLowerCase() !== "black",
  );

  // Si on a des couleurs restantes
  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)];
  }

  // Sinon on reprend une couleur non noire
  const fallback = brandColors.find(
    (c) =>
      c.toLowerCase() !== "#000000" &&
      c.toLowerCase() !== "#000" &&
      c.toLowerCase() !== "black",
  );

  return fallback ?? "#888";
}

export function hexToRgba(hexColor: string, alpha = 1): string {
  if (!hexColor) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  let hex = hexColor.replace("#", "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
