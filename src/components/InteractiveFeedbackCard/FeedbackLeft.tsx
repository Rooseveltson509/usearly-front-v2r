import React, { useRef, useLayoutEffect, useState, useMemo } from "react";
import { decideIllustration } from "@src/utils/getIllustrationDecision";
import { getBrandThemeColor } from "@src/utils/getBrandThemeColor";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import { BrandSvg } from "../shared/BrandSvg";

interface Props {
  item: (CoupDeCoeur | Suggestion) & { type: "suggestion" | "coupdecoeur" };
}

export const getBrightness = (hex: string, bg: string = "#ffffff"): number => {
  if (!hex) return 0;
  let c = hex.replace("#", "").trim();

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

  if (/^[0-9a-f]{8}$/i.test(c)) {
    const { r, g, b } = parseRGB(c);
    const a = parseInt(c.slice(6, 8), 16) / 255;
    const bgC = parseRGB(bg.replace("#", ""));
    const R = Math.round((1 - a) * bgC.r + a * r);
    const G = Math.round((1 - a) * bgC.g + a * g);
    const B = Math.round((1 - a) * bgC.b + a * b);
    return Math.max(0, Math.min(255, (R * 299 + G * 587 + B * 114) / 1000));
  }

  if (!/^[0-9a-f]{6}$/i.test(c)) return 0;
  const { r, g, b } = parseRGB(c);
  return Math.max(0, Math.min(255, (r * 299 + g * 587 + b * 114) / 1000));
};

const getTextColorForBackground = (hex: string): string =>
  getBrightness(hex) > 150 ? "#000" : "#fff";

/** ✅ Mesure la hauteur réelle et décide wrap si > seuil (par défaut 50px) */
function shouldWrapByHeight(el: HTMLElement, threshold = 50): boolean {
  if (!el) return false;
  const h = el.getBoundingClientRect().height;
  return h > threshold;
}

/** ✅ Compte les mots en nettoyant le HTML */
function countWordsFromHTML(html: string): number {
  const txt = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .trim();
  if (!txt) return 0;
  return (txt.match(/\S+/g) || []).length;
}

/** 🔤 Extrait les mots (texte nu) depuis un HTML simple */
function htmlToWords(html: string): string[] {
  const txt = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .trim();
  return txt ? txt.match(/\S+/g) || [] : [];
}

/** 🎯 Coupe “visuellement équilibrée” : cherche k qui équilibre la largeur px des 2 lignes */
function breakAtBestVisualWidth(el: HTMLElement, words: string[]): number {
  const cs = getComputedStyle(el);
  const ctx = document.createElement("canvas").getContext("2d")!;
  const font = `${cs.fontStyle || "normal"} ${cs.fontWeight || "500"} ${cs.fontSize || "17px"} ${cs.fontFamily || "Ralleway"}`;
  ctx.font = font;

  const measure = (arr: string[]) => ctx.measureText(arr.join(" ")).width;

  let bestK = 2; // au moins 2 mots en 1re ligne
  let bestDiff = Infinity;
  for (let k = 2; k < words.length; k++) {
    const left = measure(words.slice(0, k));
    const right = measure(words.slice(k));
    const diff = Math.abs(left - right);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestK = k;
    }
  }
  return bestK;
}

/**
 * 🧩 Fallback : préférence **2 lignes** quand ça wrap
 *  - <br/> après k = max(2, ceil(n/2)) mots
 */
function reflowPreferTwoLines(html: string, fallbackCount?: number): string {
  if (/<br\s*\/?>/i.test(html)) return html; // déjà formaté

  const words = htmlToWords(html);
  const n = Number.isFinite(fallbackCount as number)
    ? (fallbackCount as number)
    : words.length;

  if (words.length <= 2) return html;

  let k = Math.max(2, Math.ceil(n / 2));
  if (k >= words.length) k = Math.max(2, words.length - 1);

  const first = words.slice(0, k).join(" ");
  const second = words.slice(k).join(" ");
  return second ? `${first}<br/>${second}` : first;
}

const FeedbackLeft: React.FC<Props> = ({ item }) => {
  const brandName = item.marque?.trim() ?? "";
  const { base, light, isDark } = getBrandThemeColor(brandName);

  const brightness = getBrightness(base);
  const isTooLight = brightness > 235;
  const adjustedBase = base;
  const adjustedLight = light;
  const themeMode = isDark ? "dark" : "light";

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
  const lines = useMemo(
    () => (item.punchline ? item.punchline.split("\n") : []),
    [item.punchline],
  );

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
    <div className="feedback-type">
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
            <div
              className="punchline-typography"
              dangerouslySetInnerHTML={{
                __html: (() => {
                  let text = item.punchline;
                  const highlightedWords = item.meta?.highlightedWords ?? [];
                  const highlightTextColor =
                    getTextColorForBackground(adjustedBase);
                  highlightedWords.forEach((word) => {
                    const regex = new RegExp(`(${word})`, "gi");
                    text = text.replace(
                      regex,
                      `<span class="highlight-bubble" style="background:${adjustedBase};color:${highlightTextColor};">${word}</span>`,
                    );
                  });
                  return text;
                })(),
              }}
            />
          ) : item.meta?.axe === "emoji" ? (
            <div
              className="feedback-left"
              style={{
                backgroundColor: backgroundVariant,
                color: "#000",
                ["--brand-color" as any]: adjustedBase,
                ["--brand-color-light" as any]: adjustedLight,
              }}
              data-axe="emoji"
              data-theme={themeMode}
              data-highlight-emoji={
                highlightEmojiNeedsContrast ? "dark" : "brand"
              }
            >
              <div className="feedback-icon">{item.emoji}</div>
              <div
                className="emoji-text"
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    let text = item.punchline;
                    const highlightedWords = item.meta?.highlightedWords ?? [];
                    highlightedWords.forEach((word) => {
                      const regex = new RegExp(`(${word})`, "gi");
                      text = text.replace(
                        regex,
                        `<span class="${highlightEmojiClass}" style="color:${highlightEmojiColor}; font-weight:900;">$1</span>`,
                      );
                    });
                    return text;
                  })(),
                }}
              />
            </div>
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
                      brandColor={adjustedBase}
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
