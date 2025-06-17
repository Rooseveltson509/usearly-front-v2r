import React, { useState } from "react";
import "./InteractiveFeedbackCard.scss";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import { useAuth } from "@src/services/AuthContext";
import { useReactions } from "@src/hooks/useReactions";
import type { UserReaction } from "@src/types/reaction";

interface Props {
    item: CoupDeCoeur | Suggestion;
    initialReactions: UserReaction[];

}

const getFullUrl = (path: string | null) => {
    if (!path) return "/default-avatar.png";
    return `${import.meta.env.VITE_API_BASE_URL}/${path}`;
};

const isValidDate = (value: any) => {
    const d = new Date(value);
    return !isNaN(d.getTime());
};

const InteractiveFeedbackCard: React.FC<Props> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showFullText, setShowFullText] = useState(false);
    const { userProfile } = useAuth();

    const toggle = () => setIsOpen((prev) => !prev);
    const toggleText = () => setShowFullText((prev) => !prev);

    const title = item.description?.split(":")[0] || item.emoji || "Feedback";
    const rawDescription = item.description || "";
    const description =
        rawDescription.split(":").slice(1).join(":").trim() || rawDescription;
    if (!userProfile || !userProfile.id) return null;

    const {
        getCount,
        getUserEmoji,
        handleReact,
    } = useReactions(userProfile?.id, item.id);

    const emoji = getUserEmoji();

    return (
        <div className={`interactive-feedback-card ${isOpen ? "open" : ""}`} onClick={toggle}>
            <div className="card-header">
                <div className="emoji">{emoji || item.emoji || "💬"}</div>
                <div className="title-section">
                    <h3 className="title">{title}</h3>
                    <div className="feedback-desc">
                        <p>
                            {showFullText || description.length <= 120
                                ? description
                                : description.slice(0, 120) + "..."}
                            {description.length > 120 && (
                                <button
                                    className="see-more"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleText();
                                    }}
                                >
                                    {showFullText ? "Voir moins" : "Voir plus"}
                                </button>
                            )}
                        </p>
                    </div>
                </div>
                <div className="user-info">
                    <img className="avatar" src={getFullUrl(item.author?.avatar || null)} alt="avatar" />
                    <div className="meta">
                        <span className="pseudo">{item.author?.pseudo}</span>
                        <span className="brand">x {item.marque}</span>
                    </div>
                    <img
                        className="brand-logo"
                        src={`/${item.marque}-logo.png`}
                        alt={`${item.marque} logo`}
                        onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                </div>
            </div>

            {isOpen && item.capture && (
                <div className="capture-wrapper">
                    <img src={item.capture ?? undefined} alt="capture" className="capture" />
                </div>
            )}

            <div className="card-footer">
                {isValidDate(item.createdAt) && (
                    <span className="time">
                        {formatDistanceToNow(new Date(item.createdAt), {
                            locale: fr,
                            addSuffix: true,
                        })}
                    </span>
                )}
                <div className="reactions">
                    <span onClick={() => handleReact("🔥")}>🔥 {getCount("🔥")}</span>
                    <span onClick={() => handleReact("🙌")}>🙌 {getCount("🙌")}</span>
                    <span onClick={() => handleReact("💬")}>💬 {getCount("💬")}</span>
                </div>
            </div>
        </div>
    );
};

export default InteractiveFeedbackCard;
