import React, { useState, useEffect } from "react";
//import "./InteractiveFeedbackCard.scss"; // ✅ on réutilise les mêmes styles
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Avatar from "../Avatar";
import { brandColors } from "@src/utils/brandColors";
import { getContrastTextColor } from "@src/utils/colorUtils";
import { fetchValidBrandLogo } from "@src/utils/brandLogos";
import type { PublicSuggestion } from "@src/types/suggestion";

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
  const [logos, setLogos] = useState<Record<string, string>>({});

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

  useEffect(() => {
    const loadBrandLogo = async () => {
      if (item.marque) {
        const logoUrl = await fetchValidBrandLogo(item.marque, item.siteUrl);
        setLogos({ [item.marque]: logoUrl });
      }
    };
    loadBrandLogo();
  }, [item.marque]);

  useEffect(() => {
    return () => {
      if (selectedImage) {
        document.body.classList.remove("lightbox-open");
        document.body.style.overflow = "auto";
      }
    };
  }, [selectedImage]);

  const rawDescription = item.description || "";
  const description = rawDescription.trim();
  const DESCRIPTION_LIMIT = 150;
  const shouldShowToggle = description.length > DESCRIPTION_LIMIT || item.capture;
  //const bgColor = brandColors[item.marque?.toLowerCase()] || brandColors.default;
  const brandKey = item.marque ? item.marque.toLowerCase() : "default";
  const bgColor = brandColors[brandKey] || brandColors.default;

  const textColor = getContrastTextColor(bgColor);

  return (
    <div className="feedback-card open">
      {/* Bloc gauche */}
      <div className="feedback-type">
        {item.title ? (
          <div
            className="feedback-left"
            style={{ backgroundColor: bgColor }}
          >
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
              <strong>{item.marque}</strong>
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
              {item.marque && (
                <div className="brand-overlay">
                  <Avatar
                    avatar={logos[item.marque] || ""}
                    pseudo={item.marque}
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
          <div className="vote-progress">
            <progress value={item.votes || 0} max={300}></progress>
            <span>{item.votes || 0}/300</span>
          </div>

          {/* Bouton remplacé */}
          <button
            className="vote-button disabled"
            onClick={() => alert("Connectez-vous pour voter")}
          >
            🔒 Connectez-vous pour voter
          </button>

          {/* Info doublons */}
          {typeof item.duplicateCount === "number" &&
            item.duplicateCount > 0 && (
              <p className="duplicate-info">
                Déjà rejointe par <strong>{item.duplicateCount}</strong>{" "}
                utilisateur{item.duplicateCount > 1 ? "s" : ""}
              </p>
            )}
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
