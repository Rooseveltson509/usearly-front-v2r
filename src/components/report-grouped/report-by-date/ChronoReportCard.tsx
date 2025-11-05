import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronDown, ChevronUp } from "lucide-react";
import DescriptionCommentSection from "@src/components/report-desc-comment/DescriptionCommentSection";
import ReportActionsBarWithReactions from "@src/components/shared/ReportActionsBarWithReactions";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import { useAuth } from "@src/services/AuthContext";
import { useCommentsForDescription } from "@src/hooks/useCommentsForDescription";
import type { ExplodedGroupedReport } from "@src/types/Reports";
import "./ChronoReportCard.scss";
import Avatar from "@src/components/shared/Avatar";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";

interface Props {
  item: ExplodedGroupedReport & { brandLogoUrl?: string }; // ✅ on ajoute brandLogoUrl
  isOpen: boolean;
  onToggle: () => void;
}

const ChronoReportCard: React.FC<Props> = ({ item, isOpen, onToggle }) => {
  const { userProfile } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [localCommentsCounts, setLocalCommentsCounts] = useState<
    Record<string, number>
  >({});

  const firstDescription = item.subCategory.descriptions[0];
  const descriptionId = firstDescription.id;

  const { comments, loading } = useCommentsForDescription(
    descriptionId,
    "report",
    refreshKey,
  );

  const handleCommentClick = () => {
    if (!isOpen) {
      onToggle();
      setShowComments(true);
    } else {
      setShowComments((prev) => !prev);
    }
  };

  useEffect(() => {
    if (!loading && comments.length > 0) {
      setLocalCommentsCounts((prev) => ({
        ...prev,
        [descriptionId]: comments.length,
      }));
    }
  }, [comments.length, descriptionId, loading]);

  const currentCount = localCommentsCounts[descriptionId] ?? 0;

  return (
    <div className="report-card">
      <div className="card-header" onClick={onToggle}>
        <div className="left-icon">
          <img
            src={getCategoryIconPathFromSubcategory(
              item.subCategory.subCategory,
            )}
            alt="icon catégorie"
          />
        </div>

        <div className="card-title">
          <div className="title-and-meta">
            <h4>{item.subCategory.subCategory || "Suggestion"}</h4>
            <div className="meta-info">
              {!isOpen && (
                <span className="date-card">
                  {formatDistanceToNow(new Date(firstDescription.createdAt), {
                    locale: fr,
                    addSuffix: true,
                  }).replace("environ ", "")}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="right-section">
          {!isOpen ? (
            <div className="brand-logo-container">
              <Avatar
                avatar={item.brandLogoUrl ?? null} // ✅ logo fourni par le parent
                pseudo={item.marque}
                type="brand"
                className="brand-logo"
              />
            </div>
          ) : (
            <div className="user-brand-inline">
              <div className="avatars">
                <Avatar
                  avatar={firstDescription.user?.avatar ?? null}
                  pseudo={firstDescription.user?.pseudo}
                  type="user"
                  className="avatar"
                />
                <Avatar
                  avatar={item.brandLogoUrl ?? null} // ✅ idem ici
                  pseudo={item.marque}
                  type="brand"
                  className="avatar"
                />
              </div>
              <div className="label">
                {userProfile?.pseudo} <span className="x">×</span>{" "}
                <strong>{capitalizeFirstLetter(item.marque)}</strong>
              </div>
            </div>
          )}
        </div>

        <div className="chevron">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {isOpen && (
        <div className="card-content">
          <div className="card-description">
            <p>{firstDescription.description}</p>
          </div>

          <ReportActionsBarWithReactions
            userId={userProfile?.id || ""}
            descriptionId={descriptionId}
            reportsCount={item.subCategory.count}
            commentsCount={currentCount}
            onReactClick={() => {}}
            onCommentClick={handleCommentClick}
            onToggleSimilarReports={() => {}}
          />

          {showComments && userProfile?.id && (
            <DescriptionCommentSection
              userId={userProfile.id}
              descriptionId={descriptionId}
              type="report"
              forceOpen={true}
              hideFooter={true}
              onCommentCountChange={(count) =>
                setLocalCommentsCounts((prev) => ({
                  ...prev,
                  [descriptionId]: count,
                }))
              }
              onCommentAddedOrDeleted={() => setRefreshKey((prev) => prev + 1)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ChronoReportCard;
