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
import { getBrandLogo } from "@src/utils/brandLogos";

interface Props {
    item: ExplodedGroupedReport;
    isOpen: boolean;
    onToggle: () => void;
}

const ChronoReportCard: React.FC<Props> = ({ item, isOpen, onToggle }) => {
    const { userProfile } = useAuth();
    const [showComments, setShowComments] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [localCommentsCounts, setLocalCommentsCounts] = useState<Record<string, number>>({});

    const firstDescription = item.subCategory.descriptions[0];
    const descriptionId = firstDescription.id;

    const userAvatar = firstDescription.user?.avatar
        ? `${import.meta.env.VITE_API_BASE_URL}/${firstDescription.user.avatar}`
        : "/default-avatar.png";

    const { comments, loading } = useCommentsForDescription(descriptionId, "report", refreshKey);

    const handleCommentClick = () => {
        if (!isOpen) {
            onToggle();
            setShowComments(true);
        } else {
            setShowComments(prev => !prev);
        }
    };

    useEffect(() => {
        if (!loading && comments.length > 0) {
            setLocalCommentsCounts(prev => ({
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
                    <img src={getCategoryIconPathFromSubcategory(item.subCategory.subCategory)} alt="icon" />
                </div>

                <div className="card-title">
                    <div className="title-and-meta">
                        <h4>{item.marque || "Suggestion"}</h4>
                        <div className="meta-info">
                            <span className="count">{item.subCategory.count}</span>
                            <span className="date">
                                {formatDistanceToNow(new Date(firstDescription.createdAt), {
                                    locale: fr,
                                    addSuffix: true,
                                })}
                            </span>
                        </div>
                    </div>
                </div>


                <div className="right-section">
                    {!isOpen ? (
                        <div className="brand-logo-container">
                            <img
                                src={getBrandLogo(item.marque, item.siteUrl)}
                                alt={item.marque}
                                className="brand-logo"
                            />
                        </div>
                    ) : (
                        <div className="user-brand-inline">
                            <div className="avatars">
                                <img src={userAvatar} alt="avatar" className="avatar" />
                                <img
                                    src={getBrandLogo(item.marque, item.siteUrl)}
                                    alt="logo"
                                    className="avatar"
                                />
                            </div>
                            <div className="label">
                                {userProfile?.pseudo} <span className="x">×</span>{" "}
                                <strong>{item.marque}</strong>
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
                        onReactClick={() => { }}
                        onCommentClick={handleCommentClick}
                        onToggleSimilarReports={() => { }}
                    />

                    {showComments && userProfile?.id && (
                        <DescriptionCommentSection
                            userId={userProfile.id}
                            descriptionId={descriptionId}
                            type="report"
                            forceOpen={true}
                            hideFooter={true}
                            onCommentCountChange={(count) =>
                                setLocalCommentsCounts(prev => ({ ...prev, [descriptionId]: count }))
                            }
                            onCommentAddedOrDeleted={() => setRefreshKey(prev => prev + 1)}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default ChronoReportCard;
