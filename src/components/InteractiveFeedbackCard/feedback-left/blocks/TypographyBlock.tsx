import React from "react";

interface Props {
  punchline: string;
  highlightedWords?: string[];
  baseColor: string;
  getTextColorForBackground: (hex: string) => string;
}

const TypographyBlock: React.FC<Props> = ({
  punchline,
  highlightedWords = [],
  baseColor,
  getTextColorForBackground,
}) => {
  const html = (() => {
    let text = punchline;
    const highlightTextColor = getTextColorForBackground(baseColor);

    highlightedWords.forEach((word) => {
      const regex = new RegExp(`(${word})`, "gi");
      text = text.replace(
        regex,
        `<span class="highlight-bubble" style="background:${baseColor};color:${highlightTextColor};">${word}</span>`,
      );
    });

    return text;
  })();

  return (
    <div
      className="punchline-typography"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default TypographyBlock;
