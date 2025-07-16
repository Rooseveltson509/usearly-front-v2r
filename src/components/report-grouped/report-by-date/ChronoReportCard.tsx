import { useState, useEffect } from "react";
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

interface Props {
    item: ExplodedGroupedReport;
}

const ChronoReportCard: React.FC<Props> = ({ item }) => {
    const { userProfile } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [localCommentsCounts, setLocalCommentsCounts] = useState<Record<string, number>>({});
    const firstDescription = item.subCategory.descriptions[0];
    const descriptionId = firstDescription.id;
    const userAvatar = firstDescription.user?.avatar
        ? `${import.meta.env.VITE_API_BASE_URL}/${firstDescription.user.avatar}`
        : "/default-avatar.png";

    // 🔄 Gérer l'ouverture/fermeture des commentaires
    const handleCommentClick = () => {
        if (!isOpen) {
            setIsOpen(true);
            setShowComments(true);
        } else {
            setShowComments((prev) => !prev);
        }
    };


    // 🔁 Commentaires en temps réel (comme UserBrandBlock)
    const { comments } = useCommentsForDescription(descriptionId, "report");
    const [refreshKey, setRefreshKey] = useState(0);


    useEffect(() => {
        setLocalCommentsCounts(prev => ({
            ...prev,
            [descriptionId]: comments.length,
        }));
    }, [comments.length, descriptionId]);

    const currentCount = localCommentsCounts[descriptionId] ?? 0;

    return (
        <div className="report-card">
            <div className="card-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="left-icon">
                    <img
                        src={getCategoryIconPathFromSubcategory(item.subCategory.subCategory)}
                        alt="icon"
                    />
                </div>

                <div className="card-title">
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

                <div className="user-brand">
                    <img src={userAvatar} alt="avatar" className="avatar" />
                    <span className="brand-name">
                        {firstDescription.user?.pseudo} × {item.marque}
                    </span>
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
                            hideFooter={true} // 👈 pour retirer la ligne d'icônes
                            onCommentCountChange={(count) =>
                                setLocalCommentsCounts((prev) => ({ ...prev, [descriptionId]: count }))
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







/* import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import DescriptionCommentSection from "@src/components/report-desc-comment/DescriptionCommentSection";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import type { ExplodedGroupedReport } from "@src/types/Reports";
import { useAuth } from "@src/services/AuthContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./ChronoReportCard.scss";

interface Props {
    item: ExplodedGroupedReport;
}

const ChronoReportCard: React.FC<Props> = ({ item }) => {
    const { userProfile } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const firstDescription = item.subCategory.descriptions[0];

    return (
        <div className={`subcategory-block ${isOpen ? "open" : ""}`}>
            <div className="subcategory-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="subcategory-left">
                    <img
                        src={getCategoryIconPathFromSubcategory(item.subCategory.subCategory)}
                        alt={item.subCategory.subCategory}
                        className="subcategory-icon"
                    />
                    <h4>{item.subCategory.subCategory}</h4>
                </div>
                <div className="subcategory-right">
                    <span className="subcategory-count">{item.subCategory.count}</span>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>

            {isOpen && (
                <div className="subcategory-content">
                    <div className="emoji-avatar">
                        {firstDescription.emoji && <div className="emoji">{firstDescription.emoji}</div>}
                        <img
                            src={
                                firstDescription.user?.avatar
                                    ? `${import.meta.env.VITE_API_BASE_URL}/${firstDescription.user.avatar}`
                                    : "/default-avatar.png"
                            }
                            alt={firstDescription.user?.pseudo || "Utilisateur"}
                        />
                    </div>

                    <div className="description-text">
                        <div className="user-meta">
                            <span className="pseudo">{firstDescription.user?.pseudo}</span>
                            <span className="brand"> &times; {item.marque}</span>
                            <span className="time">
                                &nbsp;&middot;&nbsp;
                                {formatDistanceToNow(new Date(firstDescription.createdAt), {
                                    locale: fr,
                                    addSuffix: true,
                                })}
                            </span>
                            {firstDescription.user?.id === userProfile?.id && (
                                <span className="badge-me">Moi</span>
                            )}
                        </div>
                        <div className="text">{firstDescription.description}</div>
                    </div>

                    {userProfile?.id && firstDescription.id && (
                        <DescriptionCommentSection
                            userId={userProfile.id}
                            descriptionId={firstDescription.id}
                            type="report"
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default ChronoReportCard;
 */