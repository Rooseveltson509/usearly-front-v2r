import { useState } from "react";
import DescriptionCommentSection from "../report-desc-comment/DescriptionCommentSection";
import { getBrandLogo } from "@src/utils/brandLogos";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { UserGroupedReport, User } from "@src/types/Reports";

interface Props {
    brand: string;
    siteUrl: string;
    reports: UserGroupedReport[];
    userProfile: { id?: string } | null;
    isOpen: boolean;
    onToggle: () => void;
}

const UserBrandBlock: React.FC<Props> = ({ brand, siteUrl, reports, userProfile, isOpen, onToggle }) => {
    const [expandedSub, setExpandedSub] = useState<string | null>(null);
    const [currentIndexes, setCurrentIndexes] = useState<Record<string, number>>({});
    const getFullAvatarUrl = (path: string | null | undefined) => {
        if (!path) return "/default-avatar.png";
        return `${import.meta.env.VITE_API_BASE_URL}/${path}`;
    };
    const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});

    const lastDate = reports
        .flatMap((r) => r.descriptions)
        .map((d) => new Date(d.createdAt).getTime())
        .sort((a, b) => b - a)[0];

    const totalCount = reports.reduce((sum, r) => {
        const userDescriptions = r.descriptions.filter(d => d.user.id === userProfile?.id);
        return sum + userDescriptions.length;
    }, 0);

    return (
        <div className={`brand-block ${isOpen ? "open" : ""}`}>
            <div className="brand-header" onClick={onToggle}>
                <div className="brand-info">
                    <h3>
                        {totalCount} signalement{totalCount > 1 ? "s" : ""} sur <strong>{brand}</strong>
                    </h3>
                </div>
                <span className="brand-date">
                    {lastDate ? formatDistanceToNow(new Date(lastDate), { locale: fr, addSuffix: true }) : ""}
                </span>
                <img src={getBrandLogo(brand, siteUrl)} alt={brand} className="brand-logo" />
            </div>

            {isOpen && (
                <div className="subcategories-list">
                    {reports.map((sub) => {
                        const currentIndex = currentIndexes[sub.subCategory] || 0;
                        const currentDesc = sub.descriptions[currentIndex];
                        const initialDescription = sub.descriptions[0];

                        return (
                            <div
                                key={sub.subCategory}
                                className={`subcategory-block ${expandedSub === sub.subCategory ? "open" : ""}`}
                            >
                                <div
                                    className="subcategory-header"
                                    onClick={() =>
                                        setExpandedSub(prev => prev === sub.subCategory ? null : sub.subCategory)
                                    }
                                >
                                    <div className="subcategory-header-left">
                                        <img
                                            src={getCategoryIconPathFromSubcategory(sub.subCategory)}
                                            alt={sub.subCategory}
                                            className="subcategory-icon"
                                        />
                                        <h4>{sub.subCategory}</h4>
                                        <span className="count-badge">{sub.count}</span>
                                    </div>

                                    {expandedSub === sub.subCategory && initialDescription && (
                                        <div className="subcategory-user-preview">
                                            <div className="subcategory-avatar-wrapper">
                                                <img
                                                    src={initialDescription.user.avatar ? getFullAvatarUrl(initialDescription.user.avatar) : "/default-avatar.png"}
                                                    alt={initialDescription.user.pseudo}
                                                    className="user-avatar-overlay"
                                                />
                                                <img
                                                    src={getBrandLogo(brand, siteUrl)}
                                                    alt={brand}
                                                    className="brand-avatar-circle"
                                                />
                                            </div>
                                            <div className="user-brand-info">
                                                <span className="pseudo">{initialDescription.user.pseudo}</span>
                                                &nbsp;x&nbsp;
                                                <span className="brand">{brand}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* ✅ Ajout de la description courte du premier user sous le header */}
                                {expandedSub === sub.subCategory && initialDescription && (
                                    <div className="subcategory-initial-description">
                                        {initialDescription.description.length > 12 && !expandedDescriptions[sub.subCategory] ? (
                                            <>
                                                {initialDescription.description.slice(0, 120)}...
                                                <button
                                                    className="see-more-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setExpandedDescriptions((prev) => ({
                                                            ...prev,
                                                            [sub.subCategory]: true,
                                                        }));
                                                    }}
                                                >
                                                    Voir plus
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {initialDescription.description}
                                                {initialDescription.description.length > 120 && (
                                                    <button
                                                        className="see-more-button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setExpandedDescriptions((prev) => ({
                                                                ...prev,
                                                                [sub.subCategory]: false,
                                                            }));
                                                        }}
                                                    >
                                                        Voir moins
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}



                                {expandedSub === sub.subCategory && currentDesc && (
                                    <div className="feedback-card open">
                                        <div className="card-body">
                                            <div className="description-slide-container">
                                                <div className="slide-content slide">
                                                    <div className="emoji-avatar">
                                                        {currentDesc.emoji && <div className="emoji">{currentDesc.emoji}</div>}
                                                        <img
                                                            src={currentDesc.user.avatar ? getFullAvatarUrl(currentDesc.user.avatar) : "/default-avatar.png"}
                                                            alt={currentDesc.user.pseudo}
                                                        />
                                                    </div>
                                                    <div className="description-text">
                                                        <div className="user-meta">
                                                            <span className="pseudo">{currentDesc.user.pseudo}&nbsp;</span>x
                                                            <span className="brand">&nbsp;{brand}</span>
                                                            <span className="time">
                                                                ⸱&nbsp;
                                                                {formatDistanceToNow(new Date(currentDesc.createdAt), {
                                                                    locale: fr,
                                                                    addSuffix: true,
                                                                })}
                                                            </span>
                                                            {userProfile?.id === currentDesc.user.id && (
                                                                <span className="badge-me">Moi</span>
                                                            )}
                                                        </div>
                                                        <div className="text">{currentDesc.description}</div>
                                                    </div>
                                                    {sub.descriptions.length > 1 && (
                                                        <div className="description-chevrons">
                                                            <div className="navigation">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setCurrentIndexes(prev => ({
                                                                            ...prev,
                                                                            [sub.subCategory]: Math.max((prev[sub.subCategory] || 0) - 1, 0),
                                                                        }));
                                                                    }}
                                                                    disabled={currentIndex === 0}
                                                                >
                                                                    <ChevronLeft size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setCurrentIndexes(prev => ({
                                                                            ...prev,
                                                                            [sub.subCategory]: Math.min((prev[sub.subCategory] || 0) + 1, sub.descriptions.length - 1),
                                                                        }));
                                                                    }}
                                                                    disabled={currentIndex === sub.descriptions.length - 1}
                                                                >
                                                                    <ChevronRight size={18} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {userProfile?.id && currentDesc?.id && (
                                                <DescriptionCommentSection
                                                    userId={userProfile.id}
                                                    descriptionId={currentDesc.id}
                                                    type="report"
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

    );
};

export default UserBrandBlock;
