import React from "react";
import { decideIllustration } from "@src/utils/getIllustrationDecision";
import { getBrandThemeColor } from "@src/utils/getBrandThemeColor";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import { BrandSvg } from "../shared/BrandSvg";

interface Props {
  item: (CoupDeCoeur | Suggestion) & { type: "suggestion" | "coupdecoeur" };
}

const getBrightness = (hex: string): number => {
  const cleaned = hex.replace("#", "");
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
};

const getTextColorForBackground = (hex: string): string => {
  return getBrightness(hex) > 150 ? "#000" : "#fff";
};

const FeedbackLeft: React.FC<Props> = ({ item }) => {
  const brandName = item.marque?.trim() ?? "";
  const { base, light, isDark } = getBrandThemeColor(brandName);

  const brightness = getBrightness(base);
  const isTooLight = brightness > 235;
  const adjustedBase = isTooLight ? "#4A90E2" : base;
  const adjustedLight = isTooLight ? "rgba(74,144,226,0.15)" : light;
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
          {/* === AXE TYPOGRAPHY === */}
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
                        `<span class="highlight-emoji" style="color:${adjustedBase}; font-weight:800;">$1</span>`,
                      );
                    });
                    return text;
                  })(),
                }}
              />
            </div>
          ) : (
            <>
              <div className="punchlines">
                {item.punchline.split("\n").map((line, index) => (
                  <div
                    key={index}
                    className={`bubble ${
                      index === 0 ? "primary" : "secondary"
                    } ${
                      item.meta?.layoutType === "two-bubble" ? "two-bubble" : ""
                    }`}
                    dangerouslySetInnerHTML={{ __html: line }}
                  />
                ))}
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
