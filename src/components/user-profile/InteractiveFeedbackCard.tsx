import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import "./InteractiveFeedbackCard.scss";
import { formatDistanceToNowStrict } from "date-fns";
import { fr } from "date-fns/locale";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import { useAuth } from "@src/services/AuthContext";
import { fetchValidBrandLogo, getBrandLogo } from "@src/utils/brandLogos";
import SharedFooterCdcAndSuggest from "../shared/SharedFooterCdcAndSuggest";
import Avatar from "../shared/Avatar";
/* import { brandColors } from "@src/utils/brandColors"; */
import { apiService } from "@src/services/apiService";
import { showToast } from "@src/utils/toastUtils";
import starProgressBar from "/assets/icons/icon-progress-bar.svg";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";
import { decideIllustration } from "@src/utils/getIllustrationDecision";
import { getBrandThemeColor } from "@src/utils/getBrandThemeColor";
import { BrandSvg } from "../shared/BrandSvg";

interface Props {
  item: (CoupDeCoeur | Suggestion) & {
    type: "suggestion" | "coupdecoeur";
  };
  isOpen: boolean;
  onToggle: (id: string) => void;
}

const isValidDate = (value: any) => {
  const d = new Date(value);
  return !isNaN(d.getTime());
};

const InteractiveFeedbackCard: React.FC<Props> = ({
  item,
  isOpen,
  onToggle,
}) => {
  const [showFullText, setShowFullText] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [, setLogos] = useState<Record<string, string>>({});
  const { userProfile } = useAuth();
  const [votes, setVotes] = useState((item as Suggestion).votes || 0);
  const [expiresInDays, setExpiresInDays] = useState<number | null>(null);
  const isExpired = expiresInDays !== null && expiresInDays <= 0;
  //const isExpired = true;

  // --- barre & étoile ---
  const barRef = useRef<HTMLDivElement>(null);
  const [thumbLeft, setThumbLeft] = useState(0);
  const max = 300;
  const thumbSize = 24; // largeur de l’étoile (doit matcher SCSS)

  useLayoutEffect(() => {
    const updateThumb = () => {
      if (barRef.current) {
        const barWidth = barRef.current.offsetWidth;
        const raw = (votes / max) * barWidth;
        const safe = Math.max(
          thumbSize / 2,
          Math.min(barWidth - thumbSize / 2, raw),
        );
        setThumbLeft(safe);
      }
    };

    updateThumb(); // 1er calcul au montage

    window.addEventListener("resize", updateThumb);
    return () => window.removeEventListener("resize", updateThumb);
  }, [votes, max]);

  useEffect(() => {
    if (item.type === "suggestion") {
      apiService
        .get(`/suggestions/${item.id}/votes`)
        .then((res) => {
          setVotes(res.data.votes);
          setExpiresInDays(res.data.expiresInDays);
        })
        .catch(() => {});
    }
  }, [item.id, item.type]);

  useEffect(() => {
    const brandKey = item.marque?.trim();
    if (!brandKey) return;

    let isMounted = true;

    fetchValidBrandLogo(brandKey, item.siteUrl)
      .then((logoUrl) => {
        if (!isMounted) return;
        setLogos((prev) => {
          if (prev[brandKey] === logoUrl) {
            return prev;
          }
          return { ...prev, [brandKey]: logoUrl };
        });
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [item.marque, item.siteUrl]);

  useEffect(() => {
    return () => {
      if (selectedImage) {
        document.body.classList.remove("lightbox-open");
        document.body.style.overflow = "auto";
      }
    };
  }, [selectedImage]);

  const handleVoteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const res = await apiService.post(`/suggestions/${item.id}/vote`);
      setVotes(res.data.votes);
      showToast("✅ Vote enregistré avec succès", "success");
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        "❌ Vous avez déjà voté pour cette suggestion";
      showToast(msg, "error");
    }
  };

  if (!userProfile?.id) return null;

  const toggleText = () => setShowFullText((prev) => !prev);

  const openLightbox = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    document.body.classList.add("lightbox-open");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.classList.remove("lightbox-open");
    document.body.style.overflow = "auto";
  };

  // 🆕 Détermine si la couleur de base est sombre ou claire
  const rawDescription = item.description || "";
  const description = rawDescription.trim();
  const DESCRIPTION_LIMIT = 150;
  const shouldShowToggle =
    description.length > DESCRIPTION_LIMIT || item.capture;

  const brandName = item.marque?.trim() ?? "";
  /* const baseColor =
    brandColors[brandName?.toLowerCase()] || brandColors.default; */

  // 🆕 Détermine la palette complète de la marque (foncé / clair)
  const { base, light, isDark, isPureBlack, isPureWhite } =
    getBrandThemeColor(brandName);

  // 🧠 On choisit la couleur à appliquer selon l’axe
  const appliedColor =
    item.meta?.axe === "illustration"
      ? isPureBlack
        ? light // si fond noir, on passe à gris foncé
        : isPureWhite
          ? base // si fond blanc, gris clair
          : isDark
            ? base
            : light
      : base;

  const themeMode = isDark ? "dark" : "light";

  const illustration = decideIllustration(
    item.title,
    item.punchline,
    item.type,
  );

  // 🧩 Couleur de fond selon l’axe
  const backgroundVariant =
    item.meta?.axe === "emoji" ||
    item.meta?.axe === "typography" ||
    item.meta?.axe === "illustration"
      ? `color-mix(in srgb, ${base} 10%, white)` // ✅ emoji → toujours clair
      : base; // ✅ tous les autres axes → fond de la marque (pas de clair)

  // 🎨 Détection automatique du contraste (texte vs fond)
  const getContrastingTextColor = (hex: string): string => {
    const cleaned = hex.replace("#", "");
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 140 ? "#000" : "#fff";
  };

  const normalizeHex = (hex: string): string => {
    if (!hex) return "#000000";
    let clean = hex.trim().toLowerCase();
    if (!clean.startsWith("#")) {
      clean = `#${clean}`;
    }
    clean = clean.replace("#", "");

    if (clean.length === 3) {
      clean = clean
        .split("")
        .map((char) => `${char}${char}`)
        .join("");
    } else if (clean.length === 4) {
      clean = clean
        .substring(0, 3)
        .split("")
        .map((char) => `${char}${char}`)
        .join("");
    } else if (clean.length === 8) {
      clean = clean.substring(0, 6);
    }

    if (clean.length !== 6) {
      return "#000000";
    }

    return `#${clean}`;
  };

  const hexToRgb = (hex: string) => {
    const sanitized = normalizeHex(hex).replace("#", "");
    const intVal = parseInt(sanitized, 16);
    return {
      r: (intVal >> 16) & 255,
      g: (intVal >> 8) & 255,
      b: intVal & 255,
    };
  };

  const getPerceivedBrightness = (hex: string): number => {
    const { r, g, b } = hexToRgb(hex);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  const escapeRegExp = (value: string): string =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const normalizedBaseColor = normalizeHex(base);
  const bubbleSecondaryTextColor = getContrastingTextColor(normalizedBaseColor);
  const textColor = getContrastingTextColor(appliedColor);
  const highlightTextColor = normalizedBaseColor;
  const highlightBrightness = getPerceivedBrightness(highlightTextColor);
  const highlightShadowColor =
    highlightBrightness > 175
      ? "rgba(0, 0, 0, 0.55)"
      : "rgba(255, 255, 255, 0.8)";
  const highlightShadowStrongColor =
    highlightBrightness > 175
      ? "rgba(0, 0, 0, 0.75)"
      : "rgba(255, 255, 255, 0.95)";
  const highlightNeedsShadowBoost = highlightBrightness > 200;

  const highlightClassName = [
    "highlight-emoji",
    highlightNeedsShadowBoost ? "highlight-emoji--shadow-strong" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const highlightStyleSegments = [
    `color:${highlightTextColor}`,
    "font-weight:800",
    "background:transparent",
    `--highlight-text-shadow:${highlightShadowColor}`,
    `--highlight-text-shadow-strong:${highlightShadowStrongColor}`,
  ];

  const highlightStyle = `${highlightStyleSegments.join(";")};`;

  const wrapHighlight = (content: string) =>
    `<span class="${highlightClassName}" style="${highlightStyle}">${content}</span>`;

  return (
    <div className={`feedback-card ${isOpen ? "open" : ""}`}>
      {/* Bloc gauche — Punchline IA */}
      <div className="feedback-type">
        {item.punchline ? (
          <div
            className="feedback-left"
            style={{
              backgroundColor: backgroundVariant, // ✅ ici on remplace Math.random() par la variable stable
              color: textColor,
              ["--brand-color" as any]: base,
              ["--brand-color-light" as any]: light,
              ["--bubble-secondary-text" as any]: bubbleSecondaryTextColor,
            }}
            data-axe={item.meta?.axe || "typography"}
            data-theme={themeMode}
          >
            {/* === AXE TYPOGRAPHY === */}
            {item.meta?.axe === "typography" ? (
              <div
                className="punchline-typography"
                style={{
                  backgroundColor: backgroundVariant, // ✅ ton fond clair ou foncé
                  color: "#000", // texte noir lisible
                  ["--brand-color" as any]: base,
                  ["--brand-color-light" as any]: light,
                  ["--bubble-secondary-text" as any]: bubbleSecondaryTextColor,
                }}
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    let text = item.punchline;
                    const highlightedWords = item.meta?.highlightedWords ?? [];

                    // ✅ Couleur inversée pour les bulles
                    const getContrastingColor = (hex: string): string => {
                      const cleaned = hex.replace("#", "");
                      const r = parseInt(cleaned.substring(0, 2), 16);
                      const g = parseInt(cleaned.substring(2, 4), 16);
                      const b = parseInt(cleaned.substring(4, 6), 16);
                      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                      return brightness > 160
                        ? "rgba(0,0,0,0.9)" // fond clair → texte noir
                        : "rgba(255,255,255,1)"; // fond foncé → texte blanc
                    };

                    getContrastingColor(base);

                    highlightedWords.forEach((word) => {
                      const regex = new RegExp(`(${escapeRegExp(word)})`, "gi");
                      text = text.replace(
                        regex,
                        `<span class="highlight-bubble" style="background:${base};color:#fff;">${word}</span>`,
                      );
                    });

                    return text;
                  })(),
                }}
              />
            ) : (
              <>
                {/* === AXE EMOJI === */}
                {item.meta?.axe === "emoji" ? (
                  <div
                    className="feedback-left"
                    style={{
                      backgroundColor: backgroundVariant, // ✅ ton fond clair ou foncé
                      color: "#000", // texte noir lisible
                      ["--brand-color" as any]: base,
                      ["--brand-color-light" as any]: light,
                      ["--bubble-secondary-text" as any]:
                        bubbleSecondaryTextColor,
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
                          const highlightedWords =
                            item.meta?.highlightedWords ?? [];
                          highlightedWords.forEach((word) => {
                            const pattern = new RegExp(
                              `(${escapeRegExp(word)})`,
                              "gi",
                            );
                            text = text.replace(pattern, (match) =>
                              wrapHighlight(match),
                            );
                          });
                          return text;
                        })(),
                      }}
                    />
                  </div>
                ) : (
                  // autres axes (typography, illustration, etc.)
                  <>
                    {/* === AXES EMOJI + ILLUSTRATION === */}
                    <div className="punchlines">
                      {item.punchline.split("\n").map((line, index) => {
                        let content = line;
                        const highlightedWords =
                          item.meta?.highlightedWords ?? [];

                        // ✅ Si axe = emoji → applique la mise en surbrillance
                        if (
                          item.meta?.axe === "emoji" &&
                          highlightedWords.length > 0
                        ) {
                          highlightedWords.forEach((word) => {
                            const regex = new RegExp(
                              `(${escapeRegExp(word)})`,
                              "gi",
                            );
                            content = content.replace(regex, (match) =>
                              wrapHighlight(match),
                            );
                          });
                        }

                        return (
                          <div
                            key={index}
                            className={`bubble ${
                              index === 0 ? "primary" : "secondary"
                            } ${
                              item.meta?.layoutType === "two-bubble"
                                ? "two-bubble"
                                : ""
                            }`}
                            dangerouslySetInnerHTML={{ __html: content }}
                          />
                        );
                      })}
                    </div>

                    {/* === AXE ILLUSTRATION : image SOUS les bulles === */}
                    {item.meta?.axe === "illustration" && illustration && (
                      <div
                        className="illu-wrapper"
                        style={{
                          backgroundColor: `color-mix(in srgb, ${base} 10%, white)`, // ✅ toujours clair
                          color: "#000", // ✅ texte noir lisible
                          ["--brand-color" as any]: base,
                          ["--brand-color-light" as any]: light,
                        }}
                      >
                        {item.type === "coupdecoeur" ? (
                          <BrandSvg
                            src={illustration}
                            brandColor={base}
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
              </>
            )}
          </div>
        ) : (
          // Fallback
          <p>
            {item.type === "coupdecoeur" ? (
              <>
                Une dinguerie <br /> la fonctionnalité{" "}
                <span className="highlight">Moment</span> sur {item.marque}
              </>
            ) : (
              <>
                Une suggestion <br /> pour{" "}
                <span className="highlight">{item.marque}</span>
              </>
            )}
          </p>
        )}
      </div>

      {/* Bloc droit */}
      <div className="feedback-right" onClick={() => onToggle(item.id)}>
        <div className="feedback-content">
          <div className="feedback-header">
            <div className="feedback-meta">
              <span className="user-brand">
                {item.author?.pseudo}
                {" × "}
                <strong>{capitalizeFirstLetter(item.marque)}</strong>
              </span>
              ⸱
              {isValidDate(item.createdAt) && (
                <span className="feedback-date">
                  {formatDistanceToNowStrict(new Date(item.createdAt), {
                    locale: fr,
                  })}
                </span>
              )}
            </div>

            <div className="avatar-with-brand">
              <div className="user-avatar-wrapper">
                <Avatar
                  avatar={item.author?.avatar}
                  pseudo={item.author?.pseudo || "Utilisateur"}
                  type="user"
                  wrapperClassName="user-avatar"
                />
                {brandName && (
                  <div className="brand-overlay">
                    <Avatar
                      avatar={getBrandLogo(brandName, item.siteUrl)}
                      pseudo={brandName}
                      type="brand"
                      wrapperClassName="brand-logo"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="feedback-body">
            {showFullText ? (
              <p>
                {description}
                {item.capture && (
                  <div className="capture-wrapper">
                    <img
                      src={item.capture}
                      alt="capture"
                      className="capture"
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(item.capture!);
                      }}
                    />
                  </div>
                )}
                {shouldShowToggle && (
                  <button
                    className="see-more"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleText();
                    }}
                  >
                    Voir moins
                  </button>
                )}
              </p>
            ) : (
              <>
                <h2 className="cdc-post-title">{item.title}</h2>
                <p>
                  {description.length > DESCRIPTION_LIMIT
                    ? `${description.slice(0, DESCRIPTION_LIMIT)}…`
                    : description}
                  {shouldShowToggle && (
                    <button
                      className="see-more"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleText();
                      }}
                    >
                      Voir plus
                    </button>
                  )}
                </p>
              </>
            )}
          </div>
        </div>

        {item.type === "suggestion" && (
          <div className="feedback-footer">
            <div className={`vote-progress ${isExpired ? "expired" : ""}`}>
              <div className="pg" ref={barRef}>
                <div
                  className="pg-fill"
                  style={{ width: `${(votes / max) * 100}%` }}
                />
              </div>
              <span className="pg-thumb" style={{ left: `${thumbLeft}px` }}>
                <img src={starProgressBar} alt="progress star" />
              </span>
              <span className="pg-count">
                {votes}/{max}
              </span>
              {expiresInDays !== null && (
                <span className="pg-expire">J-{expiresInDays}</span>
              )}
            </div>
          </div>
        )}

        <SharedFooterCdcAndSuggest
          userId={userProfile.id}
          descriptionId={item.id}
          type={item.type}
          onVoteClick={item.type === "suggestion" ? handleVoteClick : undefined}
          onToggle={onToggle}
          isExpired={isExpired}
        />
      </div>

      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <img
            src={selectedImage}
            alt="Zoom"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default InteractiveFeedbackCard;
