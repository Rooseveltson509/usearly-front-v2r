import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronDown, ChevronUp } from "lucide-react";
import DescriptionCommentSection from "@src/components/report-desc-comment/DescriptionCommentSection";
import ReportActionsBarWithReactions from "@src/components/shared/ReportActionsBarWithReactions";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import { useAuth } from "@src/services/AuthContext";
import { useCommentsForDescription } from "@src/hooks/useCommentsForDescription";
import type { PopularGroupedReport } from "@src/types/Reports";
import "./PopularReportCard.scss";
import "@src/pages/home/confirm-reportlist/FlatSubcategoryBlock.scss";
import { getBrandLogo } from "@src/utils/brandLogos";
import Avatar from "@src/components/shared/Avatar";

interface Props {
  item: PopularGroupedReport;
  isOpen: boolean;
  onToggle: () => void;
  isHot?: boolean;
}

const DESCRIPTION_PREVIEW_LENGTH = 180;

const PopularReportCard: React.FC<Props> = ({
  item,
  isOpen,
  onToggle,
  isHot,
}) => {
  const { userProfile } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [showSimilarReports, setShowSimilarReports] = useState(false);
  const [visibleDescriptionsCount, setVisibleDescriptionsCount] = useState(2);
  const [showFullText, setShowFullText] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [localCommentsCounts, setLocalCommentsCounts] = useState<
    Record<string, number>
  >({});

  const firstDescription = item.descriptions?.[0];

  const descriptionId = firstDescription?.id ?? "";
  const { comments, loading } = useCommentsForDescription(
    descriptionId,
    "report",
    refreshKey,
  );

  useEffect(() => {
    if (!loading) {
      setLocalCommentsCounts((prev) => ({
        ...prev,
        [descriptionId]: comments.length,
      }));
    }
  }, [comments.length, descriptionId, loading]);

  useEffect(() => {
    if (!isOpen) {
      setShowComments(false);
      setShowSimilarReports(false);
      setShowFullText(false);
      setVisibleDescriptionsCount(2);
    }
  }, [isOpen]);

  const descriptionText = useMemo(() => {
    if (!firstDescription) return "";

    if (showFullText || !firstDescription.description) {
      return `${firstDescription.description}${firstDescription.emoji || ""}`;
    }

    const truncated = firstDescription.description.slice(
      0,
      DESCRIPTION_PREVIEW_LENGTH,
    );

    const suffix =
      firstDescription.description.length > DESCRIPTION_PREVIEW_LENGTH
        ? "..."
        : "";

    return `${truncated}${suffix} ${firstDescription.emoji || ""}`.trim();
  }, [firstDescription?.description, firstDescription?.emoji, showFullText]);

  if (!firstDescription) return null;

  const author = firstDescription.user ?? {
    id: "",
    pseudo: "Utilisateur",
    avatar: null,
  };

  const currentCount = localCommentsCounts[descriptionId] ?? 0;
  const brandLogo = getBrandLogo(item.marque, item.siteUrl ?? undefined);
  const captureUrl = firstDescription.capture ?? null;
  const additionalDescriptions = item.descriptions.slice(1);
  const hasMoreThanTwo = additionalDescriptions.length > 2;

  const handleHeaderClick = () => {
    onToggle();
  };

  const handleCommentClick = () => {
    if (!isOpen) {
      onToggle();
      setShowComments(true);
      setShowSimilarReports(false);
      return;
    }

    setShowComments((prev) => !prev);
  };

  const handleToggleSimilarReports = () => {
    if (!isOpen) {
      onToggle();
      setShowSimilarReports(true);
      setShowComments(false);
      return;
    }

    setShowSimilarReports((prev) => !prev);
    if (!showSimilarReports) {
      setShowComments(false);
    }
  };

  return (
    <div
      className={`subcategory-block flat ${isOpen ? "open" : ""} ${isHot ? "hot-effect" : ""}`}
      data-description-id={descriptionId}
    >
      <div className="subcategory-header" onClick={handleHeaderClick}>
        <div className="subcategory-left">
          <img
            src={getCategoryIconPathFromSubcategory(item.subCategory)}
            alt={item.subCategory}
            className="subcategory-icon"
          />
          <div className="subcategory-text">
            <div className="subcategory-title-row">
              <h4>{item.subCategory || "Signalement"}</h4>
              {item.count > 1 && (
                <span className="count-badge">{item.count}</span>
              )}
            </div>
          </div>
        </div>

        <div className="subcategory-right">
          {isOpen ? (
            <div className="expanded-header">
              <div className="avatar-logo-group">
                <Avatar
                  avatar={author.avatar}
                  pseudo={author.pseudo}
                  type="user"
                  className="user-avatar"
                  wrapperClassName="user-avatar-wrapper"
                />
                <Avatar
                  avatar={brandLogo}
                  pseudo={item.marque}
                  type="brand"
                  className="brand-logo"
                  wrapperClassName="brand-logo-wrapper"
                />
              </div>
              <div className="text-meta">
                <span className="user-brand-line">
                  {author.pseudo} <span className="cross">×</span>{" "}
                  <strong>{item.marque}</strong>
                </span>
              </div>
              <ChevronUp size={16} />
            </div>
          ) : (
            <div className="collapsed-header">
              <span className="date-subcategory">
                {formatDistanceToNow(new Date(firstDescription.createdAt), {
                  locale: fr,
                  addSuffix: true,
                }).replace("environ ", "")}
              </span>
              <Avatar
                avatar={brandLogo}
                pseudo={item.marque}
                type="brand"
                className="brand-logo"
                wrapperClassName="avatars"
              />
              <ChevronDown size={16} />
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="subcategory-content">
          <div className="main-description">
            <p className="description-text">{descriptionText}</p>

            {(firstDescription.description.length >
              DESCRIPTION_PREVIEW_LENGTH ||
              captureUrl) && (
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
            userId={userProfile?.id || ""}
            descriptionId={descriptionId}
            reportsCount={item.count}
            commentsCount={currentCount}
            onReactClick={() => {}}
            onCommentClick={handleCommentClick}
            onToggleSimilarReports={handleToggleSimilarReports}
          />

          {showComments && userProfile?.id && (
            <DescriptionCommentSection
              userId={userProfile.id}
              descriptionId={descriptionId}
              type="report"
              hideFooter={true}
              forceOpen={true}
              onCommentCountChange={(count) =>
                setLocalCommentsCounts((prev) => ({
                  ...prev,
                  [descriptionId]: count,
                }))
              }
              onCommentAddedOrDeleted={() => setRefreshKey((prev) => prev + 1)}
            />
          )}

          {showSimilarReports && additionalDescriptions.length > 0 && (
            <div className="other-descriptions">
              {additionalDescriptions
                .slice(0, visibleDescriptionsCount)
                .map((desc) => {
                  const secondaryAuthor = desc.user ?? {
                    id: "",
                    pseudo: "Utilisateur",
                    avatar: null,
                  };
                  return (
                    <div key={desc.id} className="feedback-card">
                      <div className="feedback-avatar">
                        <div className="feedback-avatar-wrapper">
                          <Avatar
                            avatar={secondaryAuthor.avatar}
                            pseudo={secondaryAuthor.pseudo}
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
                          <span className="pseudo">
                            {secondaryAuthor.pseudo}
                          </span>
                          <span className="brand"> · {item.marque}</span>
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
                          userId={secondaryAuthor.id}
                          descriptionId={desc.id}
                          type="report"
                          modeCompact
                          triggerType="text"
                        />
                      </div>
                    </div>
                  );
                })}

              {hasMoreThanTwo && (
                <div className="see-more-toggle">
                  {visibleDescriptionsCount < additionalDescriptions.length ? (
                    <button
                      className="see-more-descriptions"
                      onClick={() =>
                        setVisibleDescriptionsCount((prev) =>
                          Math.min(prev + 2, additionalDescriptions.length),
                        )
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

export default PopularReportCard;
