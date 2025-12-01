import React, { useState } from "react";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { useReactionsForDescription } from "@src/hooks/useReactionsForDescription";
import { getEmojisForType } from "@src/components/constants/emojiMapByType";
import "./ReportActionsBar.scss";
import EmojiUrlyReactionPicker from "@src/utils/EmojiUrlyReactionPicker";
import statutIcon from "/assets/statut-icon.svg";

interface Props {
  userId: string;
  descriptionId: string;
  reportsCount: number;
  commentsCount: number;
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
  /* reactions, */
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

  // ✅ Récupérer toutes les réactions avec leur count
  const allReactions = emojis
    .map((e) => ({ emoji: e.emoji, count: getCount(e.emoji) }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  const topThree = allReactions.slice(0, 3);
  const totalCount = allReactions.reduce((acc, r) => acc + r.count, 0);

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
          {commentsCount > 0 && (
            <>
              <span className="comments-link" onClick={onCommentClick}>
                {commentsCount}{" "}
                {commentsCount === 1 ? "commentaire" : "commentaires"}
              </span>
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
        <div className="status-right">
          <img src={statutIcon} className="icon-statut" />
          {/* <CheckCircle size={16} color="#2563eb" /> */}
          <span>En cours de correction</span>
        </div>
      </div>
    </div>
  );
};

export default ReportActionsBarWithReactions;
