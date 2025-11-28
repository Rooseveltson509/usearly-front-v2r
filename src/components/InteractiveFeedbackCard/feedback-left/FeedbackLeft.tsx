import React, { useRef, useLayoutEffect, useState, useMemo } from "react";
import { decideIllustration } from "@src/utils/getIllustrationDecision";
import { getBrandThemeColor } from "@src/utils/getBrandThemeColor";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import { BrandSvg } from "../../shared/BrandSvg";
import { getOfficialPalette, pickSvgColor } from "@src/utils/brandColorUtils";
import TypographyBlock from "./blocks/TypographyBlock";
import EmojiBlock from "./blocks/EmojiBlock";
import { countWordsFromHTML, htmlToWords } from "../utils/textFormatUtils";
import {
  breakAtBestVisualWidth,
  reflowPreferTwoLines,
} from "../utils/layoutUtils";
import { getTextColorForBackground } from "../utils/feedbackColors";
import { getBrightness } from "../utils/colorUtils";

interface Props {
  item: (CoupDeCoeur | Suggestion) & { type: "suggestion" | "coupdecoeur" };
  isExpanded?: boolean;
}

/** ✅ Mesure la hauteur réelle et décide wrap si > seuil (par défaut 50px) */
function shouldWrapByHeight(el: HTMLElement, threshold = 50): boolean {
  if (!el) return false;
  const h = el.getBoundingClientRect().height;
  return h > threshold;
}

const FeedbackLeft: React.FC<Props> = ({ item, isExpanded = false }) => {
  const brandName = item.marque?.trim() ?? "";
  const { base, light, isDark } = getBrandThemeColor(brandName);
  // 🎨 Palette 3 couleurs cohérente
  const palette = getOfficialPalette(brandName);

  const brightness = getBrightness(base);
  const isTooLight = brightness > 235;
  const adjustedBase = base;
  const adjustedLight = light;
  const themeMode = isDark ? "dark" : "light";

  // 🎨 La bulle utilise déjà base
  const bubbleColor = adjustedBase;
  // 🎨 SVG = couleur différente + jamais noire + cohérente
  const svgColor = pickSvgColor(palette, bubbleColor);

  const illustration = decideIllustration(
    item.title,
    item.punchline,
    item.type,
  );

  const backgroundVariant =
    item.meta?.axe === "emoji" ||
    item.meta?.axe === "typography" ||
    item.meta?.axe === "illustration"
      ? `color-mix(in srgb, ${adjustedBase} 10%, white)`
      : adjustedBase;

  const textColor = getTextColorForBackground(adjustedBase);
  const highlightEmojiNeedsContrast = getBrightness(base) > 150;
  const useDark =
    highlightEmojiNeedsContrast === true ||
    Number.isNaN(highlightEmojiNeedsContrast as unknown as number) ||
    highlightEmojiNeedsContrast == null;
  const highlightEmojiClass = useDark
    ? "highlight-emoji highlight-emoji--dark"
    : "highlight-emoji";
  const highlightEmojiColor = highlightEmojiNeedsContrast
    ? "#000000"
    : adjustedBase;

  // 🧷 Refs & état
  const punchlinesRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([]);
  // On stocke le NOMBRE DE MOTS si wrap, sinon null
  const [wrappedWordsByIndex, setWrappedWordsByIndex] = useState<
    (number | null)[]
  >([]);

  // Lignes stables
  const lines = useMemo(() => {
    if (!item.punchline) return [];
    const normalized = item.punchline
      .replace(/\\\\n/g, "\n")
      .replace(/\\n/g, "\n");
    return normalized.split("\n");
  }, [item.punchline]);

  // ✅ Recalcule : si wrap => nombre de mots, sinon null
  useLayoutEffect(() => {
    const compute = () => {
      const next = bubbleRefs.current.map((el, i) => {
        if (!el) return null;
        return shouldWrapByHeight(el, 50)
          ? countWordsFromHTML(lines[i] || "")
          : null;
      });
      const same =
        next.length === wrappedWordsByIndex.length &&
        next.every((v, i) => v === wrappedWordsByIndex[i]);
      if (!same) setWrappedWordsByIndex(next);
    };

    compute();

    const ro = new ResizeObserver(compute);
    if (punchlinesRef.current) ro.observe(punchlinesRef.current);
    bubbleRefs.current.forEach((el) => el && ro.observe(el));

    return () => ro.disconnect();
  }, [lines]);

  return (
    <div className={`feedback-type${isExpanded ? " is-expanded" : ""}`}>
      {item.punchline ? (
        <div
          className="feedback-left"
          style={{
            backgroundColor: backgroundVariant,
            color: textColor,
            ["--brand-color" as any]: adjustedBase,
            ["--brand-color-light" as any]: adjustedLight,
          }}
          data-axe={item.meta?.axe || "typography"}
          data-theme={themeMode}
          data-light-brand={isTooLight ? "true" : "false"}
        >
          {/* === AXE TYPO === */}
          {item.meta?.axe === "typography" ? (
            <TypographyBlock
              punchline={item.punchline}
              highlightedWords={item.meta?.highlightedWords}
              baseColor={adjustedBase}
              getTextColorForBackground={getTextColorForBackground}
            />
          ) : item.meta?.axe === "emoji" ? (
            <EmojiBlock
              punchline={item.punchline}
              emoji={item.emoji}
              highlightedWords={item.meta?.highlightedWords}
              highlightEmojiClass={highlightEmojiClass}
              highlightEmojiColor={highlightEmojiColor}
              backgroundVariant={backgroundVariant}
              baseColor={adjustedBase}
              lightColor={adjustedLight}
              themeMode={themeMode}
              highlightEmojiNeedsContrast={highlightEmojiNeedsContrast}
            />
          ) : (
            <>
              <div className="punchlines" ref={punchlinesRef}>
                {lines.map((line, index) => {
                  const isPrimary = index === 0;
                  const bubbleBg = isPrimary ? "#ffffff" : adjustedBase;
                  const bubbleTextColor = isPrimary ? "#000000" : textColor;
                  const bubbleBorderWidth = isPrimary ? "2px" : "0px";
                  const bubbleBorderColor = isPrimary
                    ? "#000000"
                    : "transparent";
                  const bubbleTailOffset = "32px";

                  const wrapWordCount = wrappedWordsByIndex[index]; // number | null
                  const isWrapped = wrapWordCount != null;

                  // ✨ Coupe visuelle optimisée quand wrap (sinon fallback 2 lignes)
                  let formattedHtml = line;
                  if (isWrapped) {
                    const words = htmlToWords(line);
                    const el = bubbleRefs.current[index];
                    if (el && words.length > 2) {
                      const k = Math.min(
                        Math.max(2, breakAtBestVisualWidth(el, words)),
                        words.length - 1,
                      );
                      const first = words.slice(0, k).join(" ");
                      const second = words.slice(k).join(" ");
                      formattedHtml = second ? `${first}<br/>${second}` : first;
                    } else {
                      formattedHtml = reflowPreferTwoLines(
                        line,
                        wrapWordCount as number,
                      );
                    }
                  }

                  return (
                    <div
                      key={index}
                      ref={(el) => {
                        bubbleRefs.current[index] = el;
                      }}
                      className={`bubble ${isPrimary ? "primary" : "secondary"} ${
                        isWrapped ? "wrap" : "nowrap"
                      } ${item.meta?.layoutType === "two-bubble" ? "two-bubble" : ""}`}
                      data-wrapped={isWrapped ? "true" : "false"}
                      data-wrap-word-count={wrapWordCount ?? undefined}
                      style={{
                        ["--bubble-bg" as any]: bubbleBg,
                        ["--bubble-text" as any]: bubbleTextColor,
                        ["--bubble-border-width" as any]: bubbleBorderWidth,
                        ["--bubble-border-color" as any]: bubbleBorderColor,
                        ["--bubble-tail-offset" as any]: bubbleTailOffset,
                        ["--bubble-tail-size" as any]: "14px",
                        backgroundColor: bubbleBg,
                        color: bubbleTextColor,
                      }}
                      dangerouslySetInnerHTML={{ __html: formattedHtml }}
                    />
                  );
                })}
              </div>

              {item.meta?.axe === "illustration" && illustration && (
                <div
                  className="illu-wrapper"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${adjustedBase} 10%, white)`,
                    color: "#000",
                  }}
                >
                  {item.type === "coupdecoeur" ? (
                    <BrandSvg
                      src={illustration}
                      brandColor={svgColor} // ⭐ Couleur différente automatiquement
                      className="illu-image"
                      alt="Illustration de la marque"
                    />
                  ) : (
                    <img
                      src={illustration}
                      alt="illustration"
                      className="illu-image"
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default FeedbackLeft;
