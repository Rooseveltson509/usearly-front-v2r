/** Luminosité perçue (formule WCAG) */
export function getBrightness(hex: string, bg: string = "#ffffff"): number {
  if (!hex) return 0;

  let c = hex.replace("#", "").trim();

  // Format #RGB
  if (/^[0-9a-f]{3}$/i.test(c)) {
    c = c
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }

  const parseRGB = (h: string) => ({
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  });

  // Format #RRGGBBAA
  if (/^[0-9a-f]{8}$/i.test(c)) {
    const { r, g, b } = parseRGB(c);
    const a = parseInt(c.slice(6, 8), 16) / 255;

    const bgC = parseRGB(bg.replace("#", ""));
    const R = Math.round((1 - a) * bgC.r + a * r);
    const G = Math.round((1 - a) * bgC.g + a * g);
    const B = Math.round((1 - a) * bgC.b + a * b);

    return Math.max(0, Math.min(255, (R * 299 + G * 587 + B * 114) / 1000));
  }

  // Format #RRGGBB
  if (!/^[0-9a-f]{6}$/i.test(c)) return 0;

  const { r, g, b } = parseRGB(c);
  return Math.max(0, Math.min(255, (r * 299 + g * 587 + b * 114) / 1000));
}

/** Texte noir ou blanc selon fond */
export const getTextColorForBackground = (hex: string): string =>
  getBrightness(hex) > 150 ? "#000" : "#fff";

export function mixHex(hex1: string, hex2: string, ratio: number) {
  const parse = (h: string) => parseInt(h, 16);

  const r1 = parse(hex1.slice(1, 3));
  const g1 = parse(hex1.slice(3, 5));
  const b1 = parse(hex1.slice(5, 7));

  const r2 = parse(hex2.slice(1, 3));
  const g2 = parse(hex2.slice(3, 5));
  const b2 = parse(hex2.slice(5, 7));

  const mix = (a: number, b: number) => Math.round(a + (b - a) * ratio);

  const r = mix(r1, r2).toString(16).padStart(2, "0");
  const g = mix(g1, g2).toString(16).padStart(2, "0");
  const b = mix(b1, b2).toString(16).padStart(2, "0");

  return `#${r}${g}${b}`;
}
