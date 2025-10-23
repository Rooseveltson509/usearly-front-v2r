import React, { useEffect, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { fr } from "date-fns/locale";
import Avatar from "../shared/Avatar";
import { fetchValidBrandLogo } from "@src/utils/brandLogos";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";
import SharedFooterCdcAndSuggest from "../shared/SharedFooterCdcAndSuggest";
import FeedbackProgressBar from "./FeedbackProgressBar";

interface Props {
  item: any;
  onToggle: (id: string) => void;
  userProfile: any;
  selectedImage: string | null;
  setSelectedImage: (value: string | null) => void;
  isExpired: boolean;
  votes: number;
  max: number;
  barRef: React.RefObject<HTMLDivElement | null>;
  thumbLeft: number;
  expiresInDays: number | null;
  starProgressBar: string;
  onVoteClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const isValidDate = (value: any) => {
  const d = new Date(value);
  return !isNaN(d.getTime());
};

const FeedbackRight: React.FC<Props> = ({
  item,
  onToggle,
  userProfile,
  /* selectedImage, */
  setSelectedImage,
  isExpired,
  votes,
  max,
  barRef,
  thumbLeft,
  expiresInDays,
  starProgressBar,
  onVoteClick,
}) => {
  const [showFullText, setShowFullText] = useState(false);
  const DESCRIPTION_LIMIT = 150;
  const rawDescription = item.description || "";
  const description = rawDescription.trim();
  const shouldShowToggle =
    description.length > DESCRIPTION_LIMIT || item.capture;
  const brandName = item.marque?.trim() ?? "";
  const [brandLogo, setBrandLogo] = useState<string | null>(null);

  const toggleText = () => setShowFullText((prev) => !prev);
  const openLightbox = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    document.body.classList.add("lightbox-open");
    document.body.style.overflow = "hidden";
  };

  useEffect(() => {
    if (!brandName) return;
    let isMounted = true;

    fetchValidBrandLogo(brandName, item.siteUrl)
      .then((logoUrl) => {
        if (isMounted) setBrandLogo(logoUrl);
      })
      .catch(() => {
        if (isMounted) setBrandLogo(null);
      });

    return () => {
      isMounted = false;
    };
  }, [brandName, item.siteUrl]);

  return (
    <div className="feedback-right" onClick={() => onToggle(item.id)}>
      <div className="feedback-content">
        <div className="feedback-header">
          <div className="feedback-meta">
            <span className="user-brand">
              {item.author?.pseudo} ×{" "}
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
                    avatar={brandLogo}
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
        <FeedbackProgressBar
          votes={votes}
          max={max}
          expiresInDays={expiresInDays}
          barRef={barRef}
          thumbLeft={thumbLeft}
          isExpired={isExpired}
          starProgressBar={starProgressBar}
        />
      )}

      <SharedFooterCdcAndSuggest
        userId={userProfile.id}
        descriptionId={item.id}
        type={item.type}
        onVoteClick={item.type === "suggestion" ? onVoteClick : undefined}
        onToggle={onToggle}
        isExpired={isExpired}
      />
    </div>
  );
};

export default FeedbackRight;
