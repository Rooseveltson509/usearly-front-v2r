import React from "react";

interface Props {
  punchline: string;
  emoji: string | null;
  highlightedWords?: string[];
  highlightEmojiClass: string;
  highlightEmojiColor: string;
  backgroundVariant: string;
  baseColor: string;
  lightColor: string;
  themeMode: string;
  highlightEmojiNeedsContrast: boolean;
}

const EmojiBlock: React.FC<Props> = ({
  punchline,
  emoji,
  highlightedWords = [],
  highlightEmojiClass,
  highlightEmojiColor,
  backgroundVariant,
  baseColor,
  lightColor,
  themeMode,
  highlightEmojiNeedsContrast,
}) => {
  const html = (() => {
    let text = punchline;

    highlightedWords.forEach((word) => {
      if (!word) return;
      if (["style", "class", "id"].includes(word.toLowerCase())) return;

      const regex = new RegExp(`(${word})`, "gi");
      text = text.replace(
        regex,
        `<span class="${highlightEmojiClass}" style="color:${highlightEmojiColor}; font-weight:900;">$1</span>`,
      );
    });

    return text;
  })();

  return (
    <div
      className="feedback-left"
      style={{
        backgroundColor: backgroundVariant,
        color: "#000",
        ["--brand-color" as any]: baseColor,
        ["--brand-color-light" as any]: lightColor,
      }}
      data-axe="emoji"
      data-theme={themeMode}
      data-highlight-emoji={highlightEmojiNeedsContrast ? "dark" : "brand"}
    >
      <div className="feedback-icon">{emoji}</div>
      <div className="emoji-text" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default EmojiBlock;
