import { filterValidHighlights, normalizeWord } from "@src/utils/normalizeWord";
import React from "react";

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
  getTextColorForBackground,
}: Props) {
  const textColor = getTextColorForBackground(baseColor);

  // 🔐 Sécurité front
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
              background: baseColor,
              color: textColor,
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
