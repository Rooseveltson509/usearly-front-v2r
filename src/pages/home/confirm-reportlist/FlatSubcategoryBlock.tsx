import { useState } from "react";
import { ChevronDown, ChevronUp, Image } from "lucide-react";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import "./FlatSubcategoryBlock.scss";
import CommentSection from "@src/components/comments/CommentSection";
import DescriptionCommentSection from "@src/components/report-desc-comment/DescriptionCommentSection";
import ReportActionsBarWithReactions from "@src/components/shared/ReportActionsBarWithReactions";
import { useCommentsForDescription } from "@src/hooks/useCommentsForDescription";
import { getFullAvatarUrl } from "@src/utils/avatarUtils";

interface Props {
    brand: string;
    brandLogoUrl: string;
    subcategory: string;
    descriptions: any[]; // adapte si besoin avec ton type exact
    hideFooter?: boolean;
}

const FlatSubcategoryBlock: React.FC<Props> = ({
    brand,
    brandLogoUrl,
    subcategory,
    descriptions,
    hideFooter,
}) => {
    const [expanded, setExpanded] = useState(true);
    const [showComments, setShowComments] = useState(false);
    const [showSimilarReports, setShowSimilarReports] = useState(false);
    const [modalImage, setModalImage] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const initialDescription = descriptions[0];
    const { comments } = useCommentsForDescription(initialDescription.id, "report", refreshKey);
    const [visibleDescriptionsCount, setVisibleDescriptionsCount] = useState(2); // par défaut 2 visibles
    const [showCapture, setShowCapture] = useState(false);


    const toggleExpanded = () => {
        setExpanded((prev) => !prev);
        setShowComments(false);
        setShowSimilarReports(false);
    };

    return (
        <div className={`subcategory-block flat ${expanded ? "open" : ""}`}>
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
                            {descriptions.length > 1 && <span className="count-badge">{descriptions.length}</span>}
                        </div>
                    </div>
                </div>

                <div className="subcategory-right">
                    {expanded ? (
                        <div className="expanded-header">
                            <div className="avatar-logo-group">
                                <img
                                    className="user-avatar"
                                    src={getFullAvatarUrl(initialDescription.user.avatar)}
                                    alt="user"
                                />
                                <img className="brand-logo" src={brandLogoUrl} alt="brand" />
                            </div>

                            <div className="text-meta">
                                <span className="user-brand-line">
                                    {initialDescription.user.pseudo} <span className="cross">×</span>{" "}
                                    <strong>{brand}</strong>
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
                            <div className="avatars">
                                <img className="brand-logo" src={brandLogoUrl} alt="brand" />
                            </div>
                            <ChevronDown size={16} />
                        </div>
                    )}
                </div>


            </div>

            {expanded && (
                <div className="subcategory-content">
                    <div className="main-description">
                        <p className="description-text">{initialDescription.description}</p>
                        {initialDescription.capture && (
                            <div className="screenshot-section">
                                <button
                                    className="show-capture-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowCapture((prev) => !prev);
                                    }}
                                >
                                    <Image size={16} style={{ marginRight: 6 }} />
                                    {showCapture ? "Masquer la capture" : "Voir la capture"}
                                </button>

                                {showCapture && (
                                    <div className="inline-capture">
                                        <img
                                            src={initialDescription.capture}
                                            alt="Capture"
                                            className="inline-capture-img"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                    </div>

                    <ReportActionsBarWithReactions
                        userId={initialDescription.user.id}
                        descriptionId={initialDescription.id}
                        reportsCount={descriptions.length}
                        commentsCount={comments.length}
                        onReactClick={() => { }}
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
                            {descriptions.slice(1, 1 + visibleDescriptionsCount).map((desc) => (
                                <div key={desc.id} className="feedback-card">
                                    <div className="feedback-avatar">
                                        <div className="feedback-avatar-wrapper">
                                            <img
                                                src={getFullAvatarUrl(desc.user.avatar)}
                                                alt={desc.user.pseudo}
                                                className="avatar"
                                            />
                                            {desc.emoji && <div className="emoji-overlay">{desc.emoji}</div>}
                                        </div>
                                    </div>
                                    <div className="feedback-content">
                                        <div className="feedback-meta">
                                            <span className="pseudo">{desc.user.pseudo}</span>
                                            <span className="brand"> · {brand}</span>
                                            <span className="time">
                                                · {formatDistanceToNow(new Date(desc.createdAt), {
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
