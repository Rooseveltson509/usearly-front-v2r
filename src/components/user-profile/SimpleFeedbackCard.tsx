import React from "react";
import "./FeedbackCard.scss";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";

interface SimpleFeedbackCardProps {
  item: CoupDeCoeur | Suggestion;
}

const getFullAvatarUrl = (path: string | null) => {
  if (!path) return "/default-avatar.png";
  return `${import.meta.env.VITE_API_BASE_URL}/${path}`;
};

const isValidDate = (value: any) => {
  const d = new Date(value);
  return !isNaN(d.getTime());
};

const SimpleFeedbackCard: React.FC<SimpleFeedbackCardProps> = ({ item }) => {
  return (
    <div className="feedback-card open">
      <div className="card-header">
        <div className="header-left">
          <span className="category-icon">{item.emoji || "💡"}</span>
          <div className="info">
            <h3>{item.emoji || "💡"}</h3>
            <span className="brand-name">{item.marque}</span>
          </div>
          <div className="count-badge">0</div>
        </div>
      </div>

      <div className="card-body">
        <p className="main-description">{item.description}</p>

        {item.capture ? (
          <img
            src={item.capture ?? undefined}
            alt="capture"
            className="feedback-capture"
          />
        ) : (
          <div className="empty-capture" />
        )}

        <div className="user">
          <img
            src={getFullAvatarUrl(item.author?.avatar || "")}
            alt={item.author?.pseudo || "avatar"}
          />
          <div className="user-meta">
            <span className="pseudo">{item.author?.pseudo}</span>
            <span className="brand">x {item.marque}</span>
          </div>

          {isValidDate(item.createdAt) && (
            <span className="time">
              {formatDistanceToNow(new Date(item.createdAt), {
                locale: fr,
                addSuffix: true,
              })}
            </span>
          )}
        </div>

        <div className="feedback-actions">
          <span className="reaction">🔥 0</span>
          <span className="comments">💬 0</span>
          <button className="shake-button">Shake</button>
        </div>
      </div>
    </div>
  );
};

export default SimpleFeedbackCard;
