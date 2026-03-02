import { useState, useMemo, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import { useAuth } from "@src/services/AuthContext";
import DescriptionCommentSection from "@src/components/report-desc-comment/DescriptionCommentSection";
import ReportActionsBarWithReactions from "@src/components/shared/ReportActionsBarWithReactions";
import Avatar from "@src/components/shared/Avatar";
import UserBrandLine from "@src/components/shared/UserBrandLine";
import { useCommentsForDescription } from "@src/hooks/useCommentsForDescription";
import { useIsMobile } from "@src/hooks/use-mobile";
import type { ExplodedGroupedReport } from "@src/types/Reports";
import FeedbackReportMobile from "./FeedbackReportMobile";
import "./ChronoReportCard.scss";

interface Props {
  item: ExplodedGroupedReport & { brandLogoUrl?: string };
  isOpen: boolean;
  onToggle: () => void;
}

const DESCRIPTION_PREVIEW_LENGTH = 140;

const ChronoReportCard: React.FC<Props> = ({ item, isOpen, onToggle }) => {
  const { userProfile } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCapturePreview, setShowCapturePreview] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const isMobile = useIsMobile();
  const previewLength = isMobile ? 90 : DESCRIPTION_PREVIEW_LENGTH;
  const firstDescription = item.subCategory.descriptions?.[0];
  const descriptionId = firstDescription?.id ?? "";
  const [localCommentsCounts, setLocalCommentsCounts] = useState<
    Record<string, number>
  >({});
  const { comments, loading } = useCommentsForDescription(
    descriptionId,
    "report",
    refreshKey,
  );
  /** PREVIEW / FULL DESCRIPTION */
  const descriptionText = useMemo(() => {
    if (!firstDescription?.description) return "";

    if (showFullText) return firstDescription.description;

    const truncated = firstDescription.description.slice(0, previewLength);

    return (
      truncated +
      (firstDescription.description.length > previewLength ? "..." : "")
    );
  }, [firstDescription?.description, previewLength, showFullText]);

  /** CLICK COMMENT */
  const handleCommentClick = () => {
    if (!isOpen) {
      onToggle();
      setShowComments(true);
      return;
    }
    setShowComments((prev) => !prev);
  };
  const handleToggleFullText = () => {
    setShowFullText((prev) => !prev);
  };
  const handleOpenCapture = () => {
    setShowCapturePreview(true);
  };
  const handleCloseCapture = () => {
    setShowCapturePreview(false);
  };

  useEffect(() => {
    if (!loading && descriptionId) {
      setLocalCommentsCounts((prev) => ({
        ...prev,
        [descriptionId]: comments.length,
      }));
    }
  }, [comments.length, descriptionId, loading]);

  useEffect(() => {
    if (!isOpen) {
      setShowComments(false);
      setShowCapturePreview(false);
      setShowFullText(false);
    }
  }, [isOpen]);

  if (!firstDescription) return null;

  const currentCount = localCommentsCounts[descriptionId] ?? 0;
  const formattedDate = new Date(firstDescription.createdAt).toLocaleDateString(
    "fr-FR",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  );
  const canToggleFullText =
    firstDescription.description.length > previewLength ||
    Boolean(item.capture);

  if (isMobile) {
    return (
      <FeedbackReportMobile
        item={item}
        firstDescription={firstDescription}
        descriptionId={descriptionId}
        descriptionText={descriptionText}
        formattedDate={formattedDate}
        isOpen={isOpen}
        showComments={showComments}
        showFullText={showFullText}
        canToggleFullText={canToggleFullText}
        showCapturePreview={showCapturePreview}
        currentCount={currentCount}
        userId={userProfile?.id || ""}
        onToggle={onToggle}
        onCommentClick={handleCommentClick}
        onToggleFullText={handleToggleFullText}
        onOpenCapture={handleOpenCapture}
        onCloseCapture={handleCloseCapture}
        onCommentCountChange={(count) =>
          setLocalCommentsCounts((prev) => ({
            ...prev,
            [descriptionId]: count,
          }))
        }
        onCommentAddedOrDeleted={() => setRefreshKey((x) => x + 1)}
      />
    );
  }

  return (
    <div
      className={`subcategory-block flat ${isOpen ? "open" : ""}`}
      data-description-id={descriptionId}
    >
      <div className="subcategory-header" onClick={onToggle}>
        <div className="subcategory-left">
          <img
            src={getCategoryIconPathFromSubcategory(
              item.subCategory.subCategory,
            )}
            className="subcategory-icon"
            alt="icon catégorie"
          />

          <div className="subcategory-text">
            <div className="subcategory-title-row">
              <h4>{item.subCategory.subCategory}</h4>

              {item.subCategory.descriptions.length > 1 && (
                <span className="count-badge">
                  {item.subCategory.descriptions.length}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="subcategory-right">
          {isOpen ? (
            <div className="expanded-header">
              <div className="avatar-logo-group">
                <Avatar
                  avatar={firstDescription.author?.avatar ?? null}
                  pseudo={firstDescription.author?.pseudo}
                  type="user"
                  className="user-avatar"
                />
                <Avatar
                  avatar={item.brandLogoUrl ?? null}
                  pseudo={item.marque}
                  type="brand"
                  className="brand-logo"
                />
              </div>

              <div className="text-meta">
                <UserBrandLine
                  userId={firstDescription.author?.id}
                  email={firstDescription.author?.email}
                  pseudo={firstDescription.author?.pseudo}
                  brand={item.marque}
                  type="report"
                />
              </div>

              <ChevronUp size={16} />
            </div>
          ) : (
            <div className="collapsed-header">
              <span className="date-subcategory">{formattedDate}</span>

              <Avatar
                avatar={item.brandLogoUrl ?? null}
                pseudo={item.marque}
                type="brand"
                className="brand-logo"
              />

              <ChevronDown size={16} />
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      {isOpen && (
        <div className="subcategory-content">
          <div className="main-description">
            <div
              className="description-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="description-text">
                <span className="description-content">{descriptionText}</span>

                {showFullText && item.capture && (
                  <div className="inline-capture">
                    <img
                      src={item.capture ?? undefined}
                      alt="Aperçu"
                      className="inline-capture-img"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenCapture();
                      }}
                    />
                  </div>
                )}

                {canToggleFullText && (
                  <button
                    className="see-more-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFullText();
                    }}
                  >
                    {showFullText ? "Voir moins" : "Voir plus"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div onClick={(e) => e.stopPropagation()}>
            <ReportActionsBarWithReactions
              userId={userProfile?.id || ""}
              descriptionId={descriptionId}
              hasBrandResponse={item.hasBrandResponse}
              reportsCount={item.subCategory.count}
              commentsCount={currentCount}
              status={item.subCategory.status}
              onReactClick={() => {}}
              onCommentClick={handleCommentClick}
              onToggleSimilarReports={() => {}}
            />
          </div>

          {/* COMMENTS */}
          {userProfile?.id && (
            <DescriptionCommentSection
              userId={userProfile.id}
              descriptionId={descriptionId}
              type="report"
              brand={item.marque}
              brandSiteUrl={item.siteUrl ?? undefined}
              brandResponse={item.hasBrandResponse}
              hideFooter={true}
              forceOpen={showComments}
              reportIds={item.hasBrandResponse ? [item.reportingId] : []}
              onCommentCountChange={(count) =>
                setLocalCommentsCounts((prev) => ({
                  ...prev,
                  [descriptionId]: count,
                }))
              }
              onCommentAddedOrDeleted={() => setRefreshKey((x) => x + 1)}
            />
          )}
        </div>
      )}

      {/* CAPTURE MODAL */}
      {showCapturePreview && item.capture && (
        <div className="capture-overlay" onClick={handleCloseCapture}>
          <div className="capture-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseCapture}>
              ✕
            </button>

            <img
              src={item.capture ?? undefined}
              alt="Capture zoom"
              className="modal-capture-img"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChronoReportCard;
