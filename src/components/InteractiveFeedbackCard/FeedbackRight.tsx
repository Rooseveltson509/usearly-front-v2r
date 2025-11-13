import React, { useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { fr } from "date-fns/locale";
import Avatar from "../shared/Avatar";
import FeedbackProgressBar from "./FeedbackProgressBar";
import SharedFooterCdcAndSuggest from "../shared/SharedFooterCdcAndSuggest";
import UserBrandLine from "../shared/UserBrandLine";

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
  onVoteClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showComments: boolean;
  onToggleComments: () => void;
  commentCount: number;
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
  showComments,
  onToggleComments,
  commentCount,
}) => {
  const [showFullText, setShowFullText] = useState(false);
  const DESCRIPTION_LIMIT = 100;
  const rawDescription = item.description || "";
  const description = rawDescription.trim();
  const shouldShowToggle =
    description.length > DESCRIPTION_LIMIT || item.capture;
  const brandName = item.marque?.trim() ?? "";

  // ✅ Sécurisation du siteUrl et normalisation
  const siteUrl = item?.siteUrl ?? undefined;
  /* const brandEntries = brandName ? [{ brand: brandName, siteUrl }] : []; */

  const toggleText = () => setShowFullText((prev) => !prev);
  const openLightbox = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    document.body.classList.add("lightbox-open");
    document.body.style.overflow = "hidden";
  };
  console.log("🧩 FEEDBACKRIGHT LOGO DEBUG", {
    marque: item.marque,
    siteUrl: item.siteUrl,
    keys: Object.keys(item || {}),
  });

  console.log("🧩 FEEDBACKRIGHT DEBUG AUTHOR", item.author);
  return (
    <div className="feedback-right" onClick={() => onToggle(item.id)}>
      <div className="feedback-content">
        <div className="feedback-header">
          <div className="feedback-meta">
            <UserBrandLine
              userId={item.author?.id}
              pseudo={item.author?.pseudo}
              email={item.author?.email}
              brand={item.marque}
              type={item.type}
            />
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
                    avatar={null}
                    pseudo={brandName}
                    type="brand"
                    siteUrl={siteUrl}
                    wrapperClassName="brand-logo"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="feedback-body">
          <h2 className="cdc-post-title">{item.title}</h2>

          <p>
            {showFullText
              ? description
              : description.length > DESCRIPTION_LIMIT
                ? `${description.slice(0, DESCRIPTION_LIMIT)}…`
                : description}

            {item.capture && showFullText && (
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
                {showFullText ? "Voir moins" : "Voir plus"}
              </button>
            )}
          </p>
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

      <div
        className="feedback-shared-footer"
        onClick={(e) => e.stopPropagation()}
      >
        <SharedFooterCdcAndSuggest
          userId={userProfile.id}
          descriptionId={item.id}
          type={item.type}
          onVoteClick={item.type === "suggestion" ? onVoteClick : undefined}
          isExpired={isExpired}
          commentCount={commentCount}
          showComments={showComments}
          onToggleComments={onToggleComments}
        />
      </div>
    </div>
  );
};

export default FeedbackRight;
