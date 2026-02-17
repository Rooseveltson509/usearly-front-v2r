import { filterValidHighlights, normalizeWord } from "@src/utils/normalizeWord";
import { getBrightness, mixHex } from "../../utils/colorUtils";

interface Props {
  punchline: string;
  highlightedWords?: string[];
  baseColor: string;
  getTextColorForBackground: (hex: string) => string;
}

export default function TypographyBlock({
  punchline,
  highlightedWords = [],
  baseColor,
}: Props) {
  const brightness = getBrightness(baseColor);

  // 🎨 Bulle adoucie (20–30%)
  const softBrand =
    brightness < 140
      ? mixHex(baseColor, "#ffffff", 1) // éclaircissement plus fort pour les couleurs sombres
      : mixHex(baseColor, "#000000", 0.25); // assombrissement léger pour les couleurs claires

  const highlightTextColor = "#000";

  const validHighlights = filterValidHighlights(punchline, highlightedWords);
  const words = punchline.split(/\s+/);

  return (
    <div className="punchline-typography">
      {words.map((word, index) => {
        const cleanWord = normalizeWord(word);
        const isHighlighted = validHighlights.some(
          (h) => normalizeWord(h) === cleanWord,
        );

        return isHighlighted ? (
          <span
            key={index}
            className="highlight-bubble"
            style={{
              background: softBrand,
              color: highlightTextColor,
            }}
          >
            {word}{" "}
          </span>
        ) : (
          <span key={index}>{word} </span>
        );
      })}
    </div>
  );
}
