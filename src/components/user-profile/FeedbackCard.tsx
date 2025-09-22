/* import React, { useState } from "react";
import "./FeedbackCard.scss";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@src/services/AuthContext";
import { useReactions } from "@src/hooks/useReactions";
import ReactionBadge from "../reaction/ReactionBadge";
import type { FeedbackDescription } from "@src/types/Reports";
import ReactionSelector from "@src/utils/ReactionSelector";

export type FeedbackType = "report" | "coupdecoeur" | "suggestion";

export interface FeedbackCardProps {
  id: string;
  type: FeedbackType;
  title: string;
  reportId: string;
  description: string;
  brand: string;
  avatar: string;
  count: number;
  descriptions: FeedbackDescription[];
  isOpen: boolean;
  onToggle: () => void;
  slideEnabled?: boolean;
  author?: {
    pseudo: string;
    avatar: string;
  };
  createdAt?: string;
}

const getFullAvatarUrl = (path: string | null) => {
  if (!path) return "/default-avatar.png";
  return `${import.meta.env.VITE_API_BASE_URL}/${path}`;
};

const categoryIconMap: Record<string, string> = {
  authentification: "🔐",
  mot: "🔐",
  connexion: "🔐",
  motdepasse: "🔐",
  paiement: "💳",
  carte: "💳",
  livraison: "📦",
  adresse: "📍",
  produit: "🛍️",
  taille: "📏",
  bug: "🐛",
  erreur: "⚠️",
  categorie: "📌",
  text: "🔤",
  code: "🏷️",
};

const getCategoryIcon = (category: string | undefined): string => {
  if (!category) return "❓";
  const lower = category.toLowerCase();
  const found = Object.keys(categoryIconMap).find((key) => lower.includes(key));
  return found ? categoryIconMap[found] : "❓";
};

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  title,
  description,
  brand,
  reportId,
  avatar,
  count,
  descriptions,
  isOpen,
  onToggle,
  slideEnabled = true,
  author,
  createdAt,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { userProfile } = useAuth();

  if (!userProfile?.id) return null;

  const {
    reactions,
    getCount,
    handleReact,
  } = useReactions(userProfile.id, reportId);

  const current = descriptions[currentIndex];
  const isAuthorCurrentUser = current?.user && userProfile?.id === current.user.id;

  const getUserEmoji = () =>
    reactions.find((r) => r.userId === userProfile.id)?.emoji;

  const handleNext = () => {
    if (currentIndex < descriptions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className={`feedback-card ${isOpen ? "open" : ""}`}>
      <div className="card-header" onClick={onToggle}>
        <div className="header-left">
          <span className="category-icon">{getCategoryIcon(title)}</span>
          <div className="info">
            <h3>{title}</h3>
            <span className="brand-name">{brand}</span>
          </div>
          <div className="count-badge">{count}</div>
        </div>
        <img
          src={getFullAvatarUrl(avatar)}
          alt="avatar"
          className="brand-avatar"
        />
      </div>

      {isOpen && (
        <div className="card-body">
          <p className="main-description">{description}</p>

          {descriptions.length > 0 ? (
            <div className="description-slide-container">
              <div className={`slide-content ${slideEnabled ? "slide" : ""}`}>
                <div className="emoji">{current.emoji}</div>
                <div className="text">{current.description}</div>
                {current.user && (
                  <div className={`user ${isAuthorCurrentUser ? "highlight-self" : ""}`}>
                    <img
                      src={getFullAvatarUrl(current.user.avatar)}
                      alt={current.user.pseudo}
                    />
                    <div className="user-meta">
                      <span className="pseudo">{current.user.pseudo}</span>
                      <span className="brand">x {brand}</span>
                    </div>
                    {isAuthorCurrentUser && <span className="badge-me">Moi</span>}
                    <span className="time">
                      {formatDistanceToNow(new Date(current.createdAt), {
                        locale: fr,
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                )}
              </div>

              {slideEnabled && descriptions.length > 1 && (
                <div className="navigation">
                  <button onClick={handlePrev} disabled={currentIndex === 0}>
                    ◀
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentIndex === descriptions.length - 1}
                  >
                    ▶
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="description-single-container">
              <div className="emoji">{title}</div>
              <p className="text">{description}</p>

              {author && (
                <div className="user">
                  <img
                    src={getFullAvatarUrl(author.avatar)}
                    alt={author.pseudo}
                  />
                  <div className="user-meta">
                    <span className="pseudo">{author.pseudo}</span>
                    <span className="brand">x {brand}</span>
                  </div>
                </div>
              )}

              {createdAt && (
                <div className="time">
                  {formatDistanceToNow(new Date(createdAt), {
                    locale: fr,
                    addSuffix: true,
                  })}
                </div>
              )}
            </div>
          )}

          <div className="feedback-actions">
            <ReactionSelector
              selected={getUserEmoji()}
              onSelect={handleReact}
              getCount={getCount}
            />
            <span className="comments">💬 {getCount("💬")}</span>
            <button className="shake-button">Shake</button>
          </div>

          <ReactionBadge reactions={reactions} />
        </div>
      )}
    </div>
  );
};

export default FeedbackCard;
 */