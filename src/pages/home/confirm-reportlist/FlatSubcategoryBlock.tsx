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
import {
  normalizeDomain,
  FALLBACK_BRAND_PLACEHOLDER,
} from "@src/utils/brandLogos";
import { useBrandLogos } from "@src/hooks/useBrandLogos";
import UserBrandLine from "@src/components/shared/UserBrandLine";
import CloseButton from "@src/components/buttons/CloseButtons";

interface Props {
  brand: string;
  siteUrl?: string;
  subcategory: string;
  capture?: string | null;
  descriptions: any[];
  hideFooter?: boolean;
  forceOpenComments?: boolean;
}

const FlatSubcategoryBlock: React.FC<Props> = ({
  brand,
  siteUrl,
  subcategory,
  descriptions,
  capture,
  forceOpenComments = false,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showSimilarReports, setShowSimilarReports] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [visibleDescriptionsCount, setVisibleDescriptionsCount] = useState(2);
  const [showFullText, setShowFullText] = useState(false);
  const initialDescription = descriptions?.[0];
  const [showCapturePreview, setShowCapturePreview] = useState(false);

  // ✅ Appelé avant tout return
  const brandLogos = useBrandLogos([{ brand, siteUrl }]);

  const { comments } = useCommentsForDescription(
    initialDescription?.id,
    "report",
    refreshKey,
  );

  const captureUrl = capture || initialDescription?.capture || null;

  useEffect(() => {
    if (window.location.hash === `#${initialDescription?.id}`) {
      setExpanded(true);
      setShowComments(true);
    }
  }, [initialDescription?.id]);

  useEffect(() => {
    if (forceOpenComments) setShowComments(true);
  }, [forceOpenComments]);

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
    setShowComments(false);
    setShowSimilarReports(false);
  };

  // ✅ return après tous les hooks
  if (!initialDescription) return null;

  // 🔧 Assure une clé cohérente
  const normalizedDomain = siteUrl ? normalizeDomain(siteUrl) : "";
  const key = brand.toLowerCase().trim();

  const possibleKeys = [
    key,
    `${key}.com`,
    normalizedDomain,
    `${key}.fr`,
    `${key}.ai`,
  ];

  const resolvedLogo =
    possibleKeys.map((k) => brandLogos[k]).find(Boolean) ||
    FALLBACK_BRAND_PLACEHOLDER;

  return (
    <div
      className={`subcategory-block flat ${expanded ? "open" : ""}`}
      data-description-id={initialDescription.id}
    >
      {/* === HEADER === */}
      <div className="subcategory-header" onClick={toggleExpanded}>
        <div className="subcategory-left">
          <img
            src={getCategoryIconPathFromSubcategory(subcategory)}
            alt={subcategory}
            className="subcategory-icon"
          />
          <div className="subcategory-text">
            <div className="subcategory-title-row">
              <h4>
                {subcategory?.trim().length
                  ? subcategory
                  : initialDescription?.title || "Autre problème"}
              </h4>
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
                  avatar={resolvedLogo}
                  pseudo={brand}
                  type="brand"
                  className="brand-logo"
                  wrapperClassName="brand-logo-wrapper"
                  preferBrandLogo={true}
                  siteUrl={siteUrl}
                />
              </div>
              <div className="text-meta">
                <UserBrandLine
                  userId={initialDescription.user?.id}
                  email={initialDescription.user?.email}
                  pseudo={initialDescription.user?.pseudo}
                  brand={brand}
                  type="report"
                />
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
                avatar={resolvedLogo}
                pseudo={brand}
                type="brand"
                className="brand-logo"
                wrapperClassName="avatars"
                preferBrandLogo={true}
                siteUrl={siteUrl}
              />
              <ChevronDown size={16} />
            </div>
          )}
        </div>
      </div>

      {/* === CONTENU === */}
      {expanded && (
        <div className="subcategory-content">
          <div className="main-description">
            <p className="description-text">
              {showFullText
                ? `${initialDescription.description} ${
                    initialDescription.emoji || ""
                  }`
                : `${initialDescription.description.slice(0, 100)}${
                    initialDescription.description.length > 100 ? "…" : ""
                  }`}

              {(initialDescription.description.length > 100 || captureUrl) && (
                <span
                  className="see-more-section"
                  style={{ display: "inline" }}
                >
                  {showFullText && <br />}
                  {!showFullText &&
                    initialDescription.description.length > 100 &&
                    "\u00A0"}
                  <button
                    className="see-more-button"
                    style={showFullText ? { marginTop: "5px" } : {}}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFullText((prev) => !prev);
                    }}
                  >
                    {showFullText ? "Voir moins" : "Voir plus"}
                  </button>
                </span>
              )}

              {showFullText && captureUrl && (
                <div className="inline-capture">
                  <img
                    src={captureUrl}
                    alt="Capture du signalement"
                    className="inline-capture-img"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowCapturePreview(true);
                    }}
                  />

                  {showCapturePreview && (
                    <div
                      className="lightbox"
                      onClick={() => setShowCapturePreview(false)}
                    >
                      <div
                        className="lightbox-content"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <CloseButton
                          stateSetter={setShowCapturePreview}
                          stateValue={false}
                        />
                        <img src={captureUrl} alt="Aperçu capture" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </p>
          </div>

          <ReportActionsBarWithReactions
            userId={initialDescription.user?.id}
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
                userId={initialDescription.user?.id}
                descriptionId={initialDescription.id}
                type="report"
                hideFooter={true}
                refreshKey={refreshKey}
                forceOpen={forceOpenComments}
              />
            </>
          )}

          {showSimilarReports && descriptions.length > 1 && (
            <div className="other-descriptions">
              {descriptions
                .slice(1, 1 + visibleDescriptionsCount)
                .map((desc) => (
                  <div key={desc.id} className="feedback-card">
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
                        {/* <span className="brand"> · {brand}</span> */}
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
                    <>
                      <button
                        className="see-more-descriptions"
                        onClick={() => setVisibleDescriptionsCount(2)}
                      >
                        Voir moins
                      </button>
                    </>
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
