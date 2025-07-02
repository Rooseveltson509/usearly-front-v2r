import { useState } from "react";
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

    // Première description pour l'affichage de l'aperçu
    const firstDescription = item.subCategory.descriptions[0];

    return (
        <div className={`chrono-card ${isOpen ? "open" : ""}`}>
            {/* Header clickable pour toggle */}
            <div className="chrono-card-header" onClick={() => setIsOpen(!isOpen)}>
                <img
                    src={getCategoryIconPathFromSubcategory(item.subCategory.subCategory)}
                    alt={item.subCategory.subCategory}
                    className="subcategory-icon"
                />
                <h4>{item.subCategory.subCategory}</h4>
                <span className="count-badge">{item.subCategory.count}</span>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {isOpen && (
                <div className="chrono-card-body">
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

                    {/* Section de commentaires si connecté */}
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
