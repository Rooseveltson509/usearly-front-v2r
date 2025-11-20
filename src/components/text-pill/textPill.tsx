import type { CSSProperties, MouseEventHandler } from "react";
import "./textPill.scss";

type PillProps = {
  title: string;
  addClass?: string;
  backgroundColor?: string;
  color?: string;
  onClick?: MouseEventHandler<HTMLSpanElement>;
  isActive?: boolean;
};

const TextPill = ({
  title,
  onClick,
  backgroundColor = "#4549EF",
  color = "#ffffff",
  addClass,
  isActive = false,
}: PillProps) => {
  const hoverTextColor = getBestHoverTextColor(color, backgroundColor);
  const style = {
    "--pill-bg": backgroundColor,
    "--pill-fg": color,
    "--pill-hover-fg": hoverTextColor,
  } as CSSProperties;

  return (
    <span
      className={`text-pill${isActive ? " is-active" : ""}${addClass ? ` ${addClass}` : ""}`}
      onClick={onClick}
      style={style}
    >
      {title}
    </span>
  );
};

export default TextPill;

type RGB = [number, number, number];

const getBestHoverTextColor = (fillColor: string, baseBackground: string) => {
  const fill = parseColor(fillColor);
  if (!fill) return baseBackground;

  const candidates: Array<{ value: string; rgb: RGB | null }> = [
    { value: baseBackground, rgb: parseColor(baseBackground) },
    { value: "#ffffff", rgb: [255, 255, 255] },
  ];

  let best = candidates[0].value;
  let bestRatio = candidates[0].rgb
    ? contrast(fill, candidates[0].rgb as RGB)
    : 0;

  for (const option of candidates.slice(1)) {
    if (!option.rgb) continue;
    const ratio = contrast(fill, option.rgb);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = option.value;
    }
  }

  return best;
};

const parseColor = (value: string): RGB | null => {
  const trimmed = value.trim().toLowerCase();

  if (trimmed.startsWith("#")) {
    return hexToRgb(trimmed);
  }

  const rgbMatch = trimmed.match(
    /^rgb\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
  );
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch.map(Number);
    if ([r, g, b].every((n) => n >= 0 && n <= 255)) {
      return [r, g, b];
    }
  }

  return null;
};

const hexToRgb = (hex: string): RGB | null => {
  let raw = hex.replace("#", "");

  if (raw.length === 3 || raw.length === 4) {
    raw = raw
      .split("")
      .slice(0, 3)
      .map((c) => c + c)
      .join("");
  } else if (raw.length === 8) {
    raw = raw.slice(0, 6);
  }

  if (raw.length !== 6) return null;

  const num = Number.parseInt(raw, 16);
  if (Number.isNaN(num)) return null;

  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
};

const contrast = (a: RGB, b: RGB) => {
  const luminance = (channel: number) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  const lumA =
    0.2126 * luminance(a[0]) +
    0.7152 * luminance(a[1]) +
    0.0722 * luminance(a[2]);
  const lumB =
    0.2126 * luminance(b[0]) +
    0.7152 * luminance(b[1]) +
    0.0722 * luminance(b[2]);

  const brightest = Math.max(lumA, lumB);
  const darkest = Math.min(lumA, lumB);

  return (brightest + 0.05) / (darkest + 0.05);
};
