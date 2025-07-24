import React, { useState, useEffect } from "react";
import "./InteractiveFeedbackCard.scss";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import { useAuth } from "@src/services/AuthContext";
import { fetchValidBrandLogo } from "@src/utils/brandLogos";
import SharedFooterCdcAndSuggest from "../shared/SharedFooterCdcAndSuggest";
import { ChevronDown } from "lucide-react";
import { getFullAvatarUrl } from "@src/utils/avatarUtils";

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

const InteractiveFeedbackCard: React.FC<Props> = ({ item, isOpen, onToggle }) => {
  const [showFullText, setShowFullText] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [logos, setLogos] = useState<Record<string, string>>({});
  const { userProfile } = useAuth();

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
  const description = rawDescription.split(":").slice(1).join(":").trim() || rawDescription;

  const DESCRIPTION_LIMIT = 150;
  const shouldShowToggle = description.length > DESCRIPTION_LIMIT || item.capture;

  return (
    <>
      <div className={`interactive-feedback-card ${isOpen ? "open" : ""}`}>
        <div
          className="card-header"
          onClick={(e) => {
            const tag = (e.target as HTMLElement).tagName;
            const isInteractive = [
              "BUTTON",
              "A",
              "IMG",
              "INPUT",
              "TEXTAREA",
              "SELECT",
              "SVG",
              "PATH",
            ].includes(tag);

            const isInFooter =
              (e.target as HTMLElement).closest(".shared-footer-cdc") ||
              (e.target as HTMLElement).closest(".description-comment-section");

            if (!isInteractive && !isInFooter) {
              onToggle(item.id);
            }
          }}
        >
          <div className="report-main-info">
            <div className="emoji">{item.emoji || "💬"}</div>
            <p>{title}</p>
          </div>
          <div className="report-extra-info">
            {!isOpen && isValidDate(item.createdAt) && (
              <span className="report-date">
                {formatDistanceToNow(new Date(item.createdAt), {
                  locale: fr,
                  addSuffix: true,
                })}
              </span>
            )}
            {isOpen ? (
              <div className="user-brand-header">
                <div className="avatar-group">
                  <img
                    className="user-avatar"
                    src={getFullAvatarUrl(item.author?.avatar)}
                    alt={item.author?.pseudo || "Utilisateur"}
                  />
                  <img
                    className="brand-logo"
                    src={logos[item.marque] || ""}
                    alt={item.marque}
                  />
                </div>
                <div className="user-brand-names">
                  {item.author?.pseudo} <span>×</span>{" "}
                  <strong>{item.marque}</strong>
                </div>
              </div>
            ) : (
              item.marque && (
                <img
                  className="brand-logo"
                  src={logos[item.marque] || ""}
                  alt={item.marque}
                />
              )
            )}
            <ChevronDown
              size={18}
              className={`chevron-icon ${isOpen ? "rotated" : ""}`}
            />
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
                      &nbsp;Voir plus
                    </button>
                  )}
                </p>
              )}
            </div>

            <SharedFooterCdcAndSuggest
              userId={userProfile.id}
              descriptionId={item.id}
              type={item.type}
              onToggle={onToggle}
            />
          </div>
        )}
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
    </>
  );
};

export default InteractiveFeedbackCard;
