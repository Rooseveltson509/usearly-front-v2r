import React, { useState } from "react";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { useReactionsForDescription } from "@src/hooks/useReactionsForDescription";
import { getEmojisForType } from "@src/components/constants/emojiMapByType";
import "./ReportActionsBar.scss";
import EmojiUrlyReactionPicker from "@src/utils/EmojiUrlyReactionPicker";
import StatutIcon from "@src/assets/statut-icon.svg?react";
import { TICKET_STATUSES, type TicketStatusKey } from "@src/types/ticketStatus";
import Avatar from "@src/components/shared/Avatar";
import type { HasBrandResponse } from "@src/types/brandResponse";
import { getBrandAvatarFromResponse } from "@src/utils/brandResponse";

interface Props {
  userId: string;
  descriptionId: string;
  reportsCount: number;
  reportId?: string;
  hasBrandResponse?: HasBrandResponse;
  commentsCount: number;
  status: TicketStatusKey;
  brandLogoUrl?: string;
  reactions?: any[];
  onReactClick: () => void;
  onCommentClick: () => void;
  onToggleSimilarReports?: () => void;
}

const ReportActionsBarWithReactions: React.FC<Props> = ({
  userId,
  descriptionId,
  reportsCount,
  commentsCount,
  hasBrandResponse,
  status,
  onCommentClick,
  onToggleSimilarReports,
}) => {
  const { getCount, handleReact } = useReactionsForDescription(
    userId,
    descriptionId,
  );
  const emojis = getEmojisForType("report");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  let hoverTimeout: NodeJS.Timeout;
  const statusConfig = TICKET_STATUSES.find((s) => s.key === status);

  if (!statusConfig) {
    console.warn("❌ Status inconnu reçu:", status);
    return null; // ou un badge neutre "—"
  }
  // ✅ Récupérer toutes les réactions avec leur count
  const allReactions = emojis
    .map((e) => ({ emoji: e.emoji, count: getCount(e.emoji) }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  const topThree = allReactions.slice(0, 3);
  const totalCount = allReactions.reduce((acc, r) => acc + r.count, 0);
  const brandAvatar = getBrandAvatarFromResponse(hasBrandResponse);

  const handleAddReaction = async (emoji: string) => {
    await handleReact(emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="report-actions-bar">
      <div className="counts-row">
        <div className="count-left">
          {topThree.length > 0 && (
            <>
              {topThree.map((r) => (
                <span
                  key={r.emoji}
                  role="img"
                  aria-label="reaction"
                  className="emoji-icon"
                >
                  {r.emoji}
                </span>
              ))}
              <span className="reaction-count">{totalCount}</span>
            </>
          )}
        </div>

        <div className="count-right">
          {commentsCount > 0 ? (
            <>
              {hasBrandResponse && brandAvatar && (
                <span
                  onClick={onCommentClick}
                  role="button"
                  tabIndex={0}
                  className="brand-avatar-clickable"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      onCommentClick();
                    }
                  }}
                >
                  <Avatar
                    avatar={brandAvatar.avatar}
                    pseudo={brandAvatar.pseudo}
                    type={brandAvatar.type}
                    siteUrl={brandAvatar.siteUrl ?? undefined}
                    sizeHW={20}
                  />
                </span>
              )}

              <span className="comments-link" onClick={onCommentClick}>
                {commentsCount}{" "}
                {commentsCount === 1 ? "commentaire" : "commentaires"}
              </span>
            </>
          ) : (
            <>
              {hasBrandResponse && brandAvatar && (
                <Avatar
                  avatar={brandAvatar.avatar}
                  pseudo={brandAvatar.pseudo}
                  type={brandAvatar.type}
                  siteUrl={brandAvatar.siteUrl ?? undefined}
                  sizeHW={20}
                />
              )}
            </>
          )}

          {reportsCount > 1 && (
            <>
              <span className="dot-separator">·</span>
              <span
                className="resignalements-link"
                onClick={onToggleSimilarReports}
              >
                {reportsCount}{" "}
                {reportsCount === 1 ? "signalement" : "signalements"}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="separator" />

      <div className="actions-row">
        <div className="actions-left">
          <div
            className="react-hover-area"
            onMouseEnter={() => {
              if (hoverTimeout) clearTimeout(hoverTimeout);
              setShowEmojiPicker(true);
            }}
            onMouseLeave={() => {
              hoverTimeout = setTimeout(() => {
                setShowEmojiPicker(false);
              }, 250);
            }}
            style={{ position: "relative" }}
          >
            <button type="button">
              <ThumbsUp size={18} />
              <span className="reagir-span-btn">Réagir</span>
            </button>
            {showEmojiPicker && (
              <div className="emoji-picker-container">
                <EmojiUrlyReactionPicker
                  onSelect={handleAddReaction}
                  type="report"
                  userId={userId}
                  descriptionId={descriptionId}
                />
              </div>
            )}
          </div>

          <button onClick={onCommentClick}>
            <MessageCircle size={18} />
            <span className="commenter-span-btn">Commenter</span>
          </button>
          <button>
            <Share2 size={18} />
            <span className="partager-span-btn">Partager</span>
          </button>
        </div>
        <div
          className={`status-badge status-${status}`}
          style={{
            color: statusConfig.color,
            backgroundColor: statusConfig.bg,
          }}
        >
          <StatutIcon className={`status-icon status-icon-${status}`} />
          <span>{statusConfig.label}</span>
        </div>
      </div>
    </div>
  );
};

export default ReportActionsBarWithReactions;
