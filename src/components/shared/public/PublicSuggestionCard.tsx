import React, { useState, useEffect, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Avatar from "../Avatar";
//import { brandColors } from "@src/utils/brandColors";
import { useBrandLogos } from "@src/hooks/useBrandLogos";
import type { PublicSuggestion } from "@src/types/suggestion";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";
import { FALLBACK_BRAND_PLACEHOLDER } from "@src/utils/brandLogos";
import { getRandomBrandColor } from "@src/utils/brandColors";

interface Props {
  item: PublicSuggestion & { type: "suggestion" };
}

const isValidDate = (value: any) => {
  const d = new Date(value);
  return !isNaN(d.getTime());
};

const PublicSuggestionCard: React.FC<Props> = ({ item }) => {
  const [showFullText, setShowFullText] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  // ✅ 1️⃣ Prépare l’entrée pour useBrandLogos
  const brandEntries = useMemo(() => {
    const brand = item.marque?.trim();
    return brand ? [{ brand, siteUrl: item.siteUrl || undefined }] : [];
  }, [item.marque, item.siteUrl]);

  // ⚡ 2️⃣ Récupère le logo depuis le hook centralisé
  const brandLogos = useBrandLogos(brandEntries);
  const brandName = item.marque?.trim() ?? "";
  const brandLogo =
    (brandName && brandLogos[brandName]) || FALLBACK_BRAND_PLACEHOLDER;

  // ⚙️ 3️⃣ Gestion du cleanup du lightbox
  useEffect(() => {
    return () => {
      if (selectedImage) {
        document.body.classList.remove("lightbox-open");
        document.body.style.overflow = "auto";
      }
    };
  }, [selectedImage]);

  // 📋 4️⃣ Données calculées
  const rawDescription = item.description || "";
  const description = rawDescription.trim();
  const DESCRIPTION_LIMIT = 150;
  const shouldShowToggle =
    description.length > DESCRIPTION_LIMIT || item.capture;
  const brandKey = item.marque ? item.marque.toLowerCase() : "default";
  const bgColor = getRandomBrandColor(brandKey);
  //const bgColor = brandColors[brandKey] || brandColors.default;

  const votes = item.votes ?? 0;
  const max = 300;
  const pct = Math.max(0, Math.min(100, (votes / max) * 100)); // clamp 0–100

  return (
    <div className="feedback-card open">
      {/* Bloc gauche */}
      <div className="feedback-type">
        {item.title ? (
          <div className="feedback-left" style={{ backgroundColor: bgColor }}>
            <div className="feedback-icon">{item.emoji}</div>
            <div className="punchlines">
              {item.title.split("\n").map((line, index) => (
                <div
                  key={index}
                  className={`bubble ${index === 0 ? "primary" : "secondary"}`}
                  style={{
                    backgroundColor: "#fff",
                    color: index === 0 ? bgColor : "#000",
                    border: `2px solid ${bgColor}`,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>
            Une suggestion <br />
            pour <span className="highlight">{item.marque}</span>
          </p>
        )}
      </div>

      {/* Bloc droit */}
      <div className="feedback-right">
        <div className="feedback-header">
          <div className="feedback-meta">
            <span className="user-brand">
              {item.author?.pseudo || "Utilisateur"} ×{" "}
              <strong>{capitalizeFirstLetter(brandName)}</strong>
            </span>
            {item.createdAt && isValidDate(item.createdAt) && (
              <span className="feedback-date">
                {formatDistanceToNow(new Date(item.createdAt as string), {
                  locale: fr,
                  addSuffix: true,
                })}
              </span>
            )}
          </div>

          <div className="avatar-with-brand">
            <div className="user-avatar-wrapper">
              <Avatar
                avatar={item.author?.avatar ?? null}
                pseudo={item.author?.pseudo || "Utilisateur"}
                type="user"
                wrapperClassName="user-avatar"
              />
              {brandName && (
                <div className="brand-overlay">
                  <Avatar
                    avatar={
                      brandLogo === FALLBACK_BRAND_PLACEHOLDER
                        ? null
                        : brandLogo
                    }
                    pseudo={brandName}
                    type="brand"
                    wrapperClassName="brand-logo"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
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
                <button className="see-more" onClick={toggleText}>
                  Voir moins
                </button>
              )}
            </p>
          ) : (
            <p>
              {description.length > DESCRIPTION_LIMIT
                ? `${description.slice(0, DESCRIPTION_LIMIT)}…`
                : description}
              {shouldShowToggle && (
                <button className="see-more" onClick={toggleText}>
                  Voir plus
                </button>
              )}
            </p>
          )}
        </div>

        {/* Bloc interaction public */}
        <div className="feedback-footer">
          <div
            className="vote-progress"
            style={{ ["--pct" as any]: `${pct}%` }} // variable CSS
          >
            <progress className="pg" value={votes} max={max} />
            <span className="pg-thumb" aria-hidden="true" />
            <span className="pg-count">
              {votes}/{max}
            </span>
          </div>

          <button
            className="vote-button disabled"
            onClick={() => alert("Connectez-vous pour voter")}
          >
            🔒 Connectez-vous pour voter
          </button>
        </div>
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

export default PublicSuggestionCard;
