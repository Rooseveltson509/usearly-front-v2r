import React, { useState, useEffect } from "react";
import "./InteractiveFeedbackCard.scss";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import { useAuth } from "@src/services/AuthContext";
import { fetchValidBrandLogo } from "@src/utils/brandLogos"; // 🔹 Import ajouté
import DescriptionReactionSelector from "@src/utils/DescriptionReactionSelector";
import DescriptionCommentSection from "../report-desc-comment/DescriptionCommentSection";

interface Props {
  item: (CoupDeCoeur | Suggestion) & {
    type: "suggestion" | "coupdecoeur";
  };
}

const getFullUrl = (path: string | null) => {
  if (!path) return "/default-avatar.png";
  return `${import.meta.env.VITE_API_BASE_URL}/${path}`;
};

const isValidDate = (value: any) => {
  const d = new Date(value);
  return !isNaN(d.getTime());
};

const InteractiveFeedbackCard: React.FC<Props> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [logos, setLogos] = useState<Record<string, string>>({}); // 🔹 Changé pour un objet
  const { userProfile } = useAuth();

  if (!userProfile?.id) return null;

  const toggle = () => setIsOpen((prev) => !prev);
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

  // 🔹 Chargement du logo avec fetchValidBrandLogo (exactement comme FlatReportList)
  useEffect(() => {
    const loadBrandLogo = async () => {
      if (item.marque) {
        const logoUrl = await fetchValidBrandLogo(item.marque);
        setLogos({ [item.marque]: logoUrl });
      }
    };

    loadBrandLogo();
  }, [item.marque]);

  // Cleanup au démontage du composant
  useEffect(() => {
    return () => {
      if (selectedImage) {
        document.body.classList.remove("lightbox-open");
        document.body.style.overflow = "auto";
      }
    };
  }, [selectedImage]);

  // Fermeture avec Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedImage) {
        closeLightbox();
      }
    };

    if (selectedImage) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

  const title = item.description?.split(":")[0] || item.emoji || "Feedback";
  const rawDescription = item.description || "";
  const description =
    rawDescription.split(":").slice(1).join(":").trim() || rawDescription;

  // Limite de caractères pour le "voir plus"
  const DESCRIPTION_LIMIT = 150;
  const shouldShowToggle =
    description.length > DESCRIPTION_LIMIT || item.capture;

  return (
    <>
      <div
        className={`interactive-feedback-card ${isOpen ? "open" : ""}`}
        onClick={(e) => {
          const isReactionOrComment =
            (e.target as HTMLElement).closest(".feedback-footer") ||
            (e.target as HTMLElement).closest(".description-comment-section") ||
            (e.target as HTMLElement).closest(".see-more") ||
            (e.target as HTMLElement).closest(".capture");

          if (!isReactionOrComment) toggle();
        }}
      >
        <div className="card-header">
          <div className="report-main-info">
            <div className="emoji">{item.emoji || "💬"}</div>
            <strong>{title}</strong>
          </div>
          <div className="report-extra-info">
            {isValidDate(item.createdAt) && (
              <span className="report-date">
                {formatDistanceToNow(new Date(item.createdAt), {
                  locale: fr,
                  addSuffix: true,
                })}
              </span>
            )}
            {item.marque && (
              <img
                className="brand-logo"
                src={logos[item.marque] || ""}
                alt={item.marque}
              />
            )}
          </div>
        </div>
        {isOpen && (
          <div>
            <div className="feedback-desc">
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
              )}
            </div>

            {/* Footer interactions */}
            <div className="feedback-footer">
              {userProfile?.id && item?.id && (
                <div className="feedback-interactions">
                  <div className="interactions-row">
                    <DescriptionCommentSection
                      userId={userProfile.id}
                      descriptionId={item.id}
                      type={item.type}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox en dehors de la card, au niveau du body */}
      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <img
            src={selectedImage}
            alt="Zoom"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default InteractiveFeedbackCard;
