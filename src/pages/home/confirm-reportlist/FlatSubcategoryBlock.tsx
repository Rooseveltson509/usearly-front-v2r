import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import "./FlatSubcategoryBlock.scss";
import CommentSection from "@src/components/comments/CommentSection";
import DescriptionCommentSection from "@src/components/report-desc-comment/DescriptionCommentSection";
import ReportActionsBarWithReactions from "@src/components/shared/ReportActionsBarWithReactions";
import { useCommentsForDescription } from "@src/hooks/useCommentsForDescription";
import Avatar from "@src/components/shared/Avatar";

interface Props {
  brand: string;
  siteUrl?: string;
  brandLogoUrl: string;
  subcategory: string;
  capture?: string | null;
  descriptions: any[]; // adapte si besoin avec ton type exact
  hideFooter?: boolean;
}

const FlatSubcategoryBlock: React.FC<Props> = ({
  brand,
  /* siteUrl, */
  brandLogoUrl,
  subcategory,
  descriptions,
  capture,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showSimilarReports, setShowSimilarReports] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const initialDescription = descriptions?.[0];
  const { comments } = useCommentsForDescription(
    initialDescription.id,
    "report",
    refreshKey,
  );
  const [visibleDescriptionsCount, setVisibleDescriptionsCount] = useState(2); // par défaut 2 visibles
  const captureUrl = capture || initialDescription.capture || null;
  const [showFullText, setShowFullText] = useState(false);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
    setShowComments(false);
    setShowSimilarReports(false);
  };
  useEffect(() => {
    // si la notif correspond à cette carte, on l'ouvre
    if (window.location.hash === `#${initialDescription.id}`) {
      setExpanded(true);
      setShowComments(true);
    }
  }, [initialDescription.id]);

  if (!initialDescription) {
    return null; // ou un fallback
  }

  return (
    <div
      className={`subcategory-block flat ${expanded ? "open" : ""}`}
      data-description-id={initialDescription.id}
    >
      <div className="subcategory-header" onClick={toggleExpanded}>
        <div className="subcategory-left">
          <img
            src={getCategoryIconPathFromSubcategory(subcategory)}
            alt={subcategory}
            className="subcategory-icon"
          />
          <div className="subcategory-text">
            <div className="subcategory-title-row">
              <h4>{subcategory}</h4>
              {descriptions.length > 1 && (
                <span className="count-badge">{descriptions.length}</span>
              )}
            </div>
          </div>
        </div>

        <div className="subcategory-right">
          {expanded ? (
            <div className="expanded-header">
              <div className="avatar-logo-group">
                <Avatar
                  avatar={
                    initialDescription.user?.avatar || "/default-avatar.png"
                  }
                  pseudo={
                    initialDescription.user?.pseudo || "Utilisateur inconnu"
                  }
                  type="user"
                  className="user-avatar"
                  wrapperClassName="user-avatar-wrapper"
                />
                <Avatar
                  avatar={brandLogoUrl}
                  pseudo={brand}
                  type="brand"
                  className="brand-logo"
                  wrapperClassName="brand-logo-wrapper"
                />
              </div>

              <div className="text-meta">
                <span className="user-brand-line">
                  {initialDescription.user.pseudo}{" "}
                  <span className="cross">×</span> <strong>{brand}</strong>
                </span>
              </div>

              <ChevronUp size={16} />
            </div>
          ) : (
            <div className="collapsed-header">
              <span className="date-subcategory">
                {formatDistanceToNow(new Date(initialDescription.createdAt), {
                  locale: fr,
                  addSuffix: true,
                }).replace("environ ", "")}
              </span>
              <Avatar
                avatar={brandLogoUrl}
                pseudo={brand}
                type="brand"
                className="brand-logo"
                wrapperClassName="avatars"
              />
              <ChevronDown size={16} />
            </div>
          )}
        </div>
      </div>

      {expanded && (
        <div className="subcategory-content">
          <div className="main-description">
            {/* Texte de description */}
            <p className="description-text">
              {showFullText
                ? `${initialDescription.description} ${initialDescription.emoji || ""}`
                : `${initialDescription.description.slice(0, 180)}${
                    initialDescription.description.length > 180 ? "..." : ""
                  } ${initialDescription.emoji || ""}`}
            </p>

            {/* Bouton "Voir plus / Voir moins" */}
            {(initialDescription.description.length > 180 || captureUrl) && (
              <div className="see-more-section">
                <button
                  className="see-more-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFullText((prev) => !prev);
                  }}
                >
                  {showFullText ? "Voir moins" : "Voir plus"}
                </button>
              </div>
            )}

            {/* Image affichée uniquement quand on clique sur "Voir plus" */}
            {showFullText && captureUrl && (
              <div className="inline-capture">
                <img
                  src={captureUrl}
                  alt="Capture du signalement"
                  className="inline-capture-img"
                />
              </div>
            )}
          </div>

          <ReportActionsBarWithReactions
            userId={initialDescription.user.id}
            descriptionId={initialDescription.id}
            reportsCount={descriptions.length}
            commentsCount={comments.length}
            onReactClick={() => {}}
            onCommentClick={() => {
              setShowComments((prev) => !prev);
              setShowSimilarReports(false);
            }}
            onToggleSimilarReports={() => {
              setShowSimilarReports((prev) => !prev);
              setShowComments(false);
            }}
          />

          {showComments && (
            <>
              <CommentSection
                descriptionId={initialDescription.id}
                type="report"
                onCommentAdded={() => setRefreshKey((prev) => prev + 1)}
                onCommentDeleted={() => setRefreshKey((prev) => prev + 1)}
              />
              <DescriptionCommentSection
                userId={initialDescription.user.id}
                descriptionId={initialDescription.id}
                type="report"
                hideFooter={true}
                refreshKey={refreshKey}
              />
            </>
          )}

          {showSimilarReports && descriptions.length > 1 && (
            <div className="other-descriptions">
              {descriptions
                .slice(1, 1 + visibleDescriptionsCount)
                .map((desc) => (
                  <div key={desc.id} className="feedback-card">
                    {" "}
                    <div className="feedback-avatar">
                      <div className="feedback-avatar-wrapper">
                        <Avatar
                          avatar={desc.user?.avatar || null}
                          pseudo={desc.user?.pseudo || "?"}
                          type="user"
                          className="avatar"
                          wrapperClassName="avatar-wrapper-override"
                        />
                        {desc.emoji && (
                          <div className="emoji-overlay">{desc.emoji}</div>
                        )}
                      </div>
                    </div>
                    <div className="feedback-content">
                      <div className="feedback-meta">
                        <span className="pseudo">{desc.user.pseudo}</span>
                        <span className="brand"> · {brand}</span>
                        <span className="time">
                          ·{" "}
                          {formatDistanceToNow(new Date(desc.createdAt), {
                            locale: fr,
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="feedback-text">{desc.description}</p>

                      <DescriptionCommentSection
                        userId={desc.user.id}
                        descriptionId={desc.id}
                        type="report"
                        modeCompact
                        triggerType="text"
                      />
                    </div>
                  </div>
                ))}

              {/* ✅ Bouton Voir plus / Voir moins */}
              {descriptions.length - 1 > 2 && (
                <div className="see-more-toggle">
                  {visibleDescriptionsCount < descriptions.length - 1 ? (
                    <button
                      className="see-more-descriptions"
                      onClick={() =>
                        setVisibleDescriptionsCount((prev) => prev + 2)
                      }
                    >
                      Voir plus
                    </button>
                  ) : (
                    <button
                      className="see-more-descriptions"
                      onClick={() => setVisibleDescriptionsCount(2)}
                    >
                      Voir moins
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlatSubcategoryBlock;
