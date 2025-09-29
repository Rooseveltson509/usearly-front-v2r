import React, { useState, useEffect } from "react";
import "./InteractiveFeedbackCard.scss";
import { formatDistanceToNowStrict } from 'date-fns';
import { fr } from "date-fns/locale";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import { useAuth } from "@src/services/AuthContext";
import { fetchValidBrandLogo } from "@src/utils/brandLogos";
import SharedFooterCdcAndSuggest from "../shared/SharedFooterCdcAndSuggest";
import Avatar from "../shared/Avatar";
import { brandColors } from "@src/utils/brandColors";
import { getContrastTextColor } from "@src/utils/colorUtils";
import { apiService } from "@src/services/apiService";
import { showToast } from "@src/utils/toastUtils";
import starProgressBar from "/assets/icons/icon-progress-bar.svg";

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
  const [refresh, setRefresh] = useState(false);
  const [votes, setVotes] = useState(
    (item as Suggestion).votes || 0
  );

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


  useEffect(() => {
    if (item.type === "suggestion") {
      apiService.get(`/suggestions/${item.id}/votes`).then(res => setVotes(res.data.votes));
    }
  }, [item.id, item.type]);

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

  const title = item.type === "coupdecoeur" ? "Coup de cœur" : "Suggestion";
  const rawDescription = item.description || "";
  const description = rawDescription.trim();
  const DESCRIPTION_LIMIT = 150;
  const shouldShowToggle = description.length > DESCRIPTION_LIMIT || item.capture;
  const bgColor = brandColors[item.marque?.toLowerCase()] || brandColors.default;
  const textColor = getContrastTextColor(bgColor);

  const max = 300;
  const pct = Math.max(0, Math.min(100, (votes / max) * 100));

  return (
    <div className={`feedback-card ${isOpen ? "open" : ""}`}>
      {/* Bloc gauche : icône + titre */}
      <div className="feedback-type">
        {item.title ? (
          <div
            className="feedback-left"
            style={{ backgroundColor: bgColor }}
          >
            <div className="feedback-icon">{item.emoji}</div>

            <div className="punchlines">
              {item.title ? (
                item.title.split("\n").map((line, index) => (
                  <div
                    key={index}
                    className={`bubble ${index === 0 ? "primary" : "secondary"}`}
                    style={{
                      backgroundColor: index === 0 ? "#fff" : "#fff",
                      color: index === 0 ? bgColor : "#000",
                      border: `2px solid ${bgColor}`,
                      boxShadow: index === 0 ? "0 2px 6px rgba(0,0,0,0.1)" : "none",
                    }}
                  >
                    {line}
                  </div>
                ))
              ) : (
                <div className="bubble primary">
                  {item.type === "coupdecoeur"
                    ? "Un coup de cœur utilisateur"
                    : "Une suggestion pour la marque"}
                </div>
              )}
            </div>
          </div>

        ) : (
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

      {/* Bloc droit : contenu */}
      <div className="feedback-right" onClick={() => onToggle(item.id)}>
        <div className="feedback-content">
          <div className="feedback-header">
            <div className="feedback-meta">
              <span className="user-brand">
                {item.author?.pseudo} × <strong>{item.marque}</strong>
              </span>⸱
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
                <h2 className="cdc-post-title">
                  {item.title}
                </h2>
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
            <div
              className="vote-progress"
              style={{ ["--pct" as any]: `${pct}%` }}   // variable CSS pour la position
            >
              <progress className="pg" value={votes} max={max} />
              {/* étoile décorative au bout du remplissage */}
              <span className="pg-thumb" aria-hidden="true">
                <img src={starProgressBar} alt="" />
              </span>
              <span className="pg-count">{votes}/{max}</span>
            </div>
          </div>
        )}


        <SharedFooterCdcAndSuggest
          userId={userProfile.id}
          descriptionId={item.id}
          type={item.type}
          onVoteClick={item.type === "suggestion" ? handleVoteClick : undefined}
          onToggle={onToggle}
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
