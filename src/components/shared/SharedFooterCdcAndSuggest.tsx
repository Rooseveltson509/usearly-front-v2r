import React, { useState } from "react";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { useReactionsForDescription } from "@src/hooks/useReactionsForDescription";
import EmojiUrlyReactionPicker from "@src/utils/EmojiUrlyReactionPicker";
import { getEmojisForType } from "@src/components/constants/emojiMapByType";
import "./SharedFooterCdcAndSuggest.scss";
import ShareModal from "./share-modal/ShareModal";
import ShareCoupDeCoeurModal from "./share-modal/ShareCoupDeCoeurModal";

interface Props {
  userId?: string;
  descriptionId: string;
  type: "coupdecoeur" | "suggestion";
  statusLabel?: string;
  onToggle?: (id: string) => void;
  onVoteClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isExpired?: boolean;
  commentCount: number;
  showComments: boolean;
  onToggleComments: () => void;
  isGuest?: boolean;
  onGuestCTA?: () => void;
}

const SharedFooterCdcAndSuggest: React.FC<Props> = ({
  userId,
  descriptionId,
  type,
  isExpired = false,
  onVoteClick,
  commentCount,
  showComments,
  onToggleComments,
  isGuest = false,
}) => {
  const emojis = getEmojisForType(type);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  let hoverTimeout: NodeJS.Timeout;
  const isGuestMode = isGuest || !userId;

  const { getCount, handleReact } = useReactionsForDescription(
    userId || "",
    descriptionId,
    type,
    { enabled: !isGuestMode },
  );

  const allReactions = emojis
    .map((e) => ({ emoji: e.emoji, count: getCount(e.emoji) }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  const topThree = allReactions.slice(0, 3);
  const totalCount = isGuestMode
    ? allReactions.reduce((acc, r) => acc + r.count, 0)
    : 0;

  commentCount = isGuestMode ? 0 : commentCount;

  const handleAddReaction = async (emoji: string) => {
    await handleReact(emoji);
  };

  const toggleComments = () => {
    onToggleComments();
  };

  return (
    <div className={`shared-footer-cdc ${isExpired ? "expired" : ""}`}>
      {/* Ligne emoji + compteur commentaires */}
      <div className="footer-header-row">
        <div className={`emoji-display ${totalCount === 1 ? "single" : ""}`}>
          <span className="emoji-icons">
            {topThree.map((r) => (
              <span key={r.emoji} className="emoji-icon">
                {r.emoji}
              </span>
            ))}
          </span>
          <span className="total-reaction-count">
            {totalCount > 0 && (
              <span className="reaction-count">{totalCount}</span>
            )}
          </span>
        </div>

        <div className="comment-count-right">
          {commentCount > 0 && (
            <span
              className="comment-count-label"
              onClick={toggleComments}
              style={{ cursor: "pointer" }}
            >
              {commentCount}{" "}
              {commentCount === 1 ? "commentaire" : "commentaires"}
            </span>
          )}
        </div>
      </div>

      {/* Trait séparateur */}
      <div className="footer-divider" />

      <div className="footer-bottom">
        <div className="footer-buttons">
          <div className="action-user-buttons">
            {/* Réagir */}
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
            >
              <button type="button" disabled={isExpired}>
                <ThumbsUp size={16} />
                {type === "coupdecoeur" && <span>Réagir</span>}
              </button>
              {showEmojiPicker && !isExpired && (
                <div className="emoji-picker-container">
                  <EmojiUrlyReactionPicker
                    onSelect={handleAddReaction}
                    type={type}
                    userId={userId || ""}
                    descriptionId={descriptionId}
                  />
                </div>
              )}
            </div>

            {/* Commenter */}
            <button
              className={`comment-toggle-btn ${showComments ? "active" : ""}`}
              aria-pressed={showComments}
              onClick={toggleComments}
              disabled={isExpired}
            >
              <MessageCircle size={16} />
              {type === "coupdecoeur" && "Commenter"}
              {type === "suggestion" && (
                <span className="footer-icon-tooltip">Commenter</span>
              )}
            </button>

            {/* Partager */}
            <button
              className="share-btn"
              onClick={() => setShowShareModal(true)}
              disabled={isExpired}
            >
              <Share2 size={16} />
              {type === "coupdecoeur" && "Partager"}
              {type === "suggestion" && (
                <span className="footer-icon-tooltip">Partager</span>
              )}
            </button>
          </div>

          {/* Bouton voter (désactivé si expiré) */}
          {type === "suggestion" && onVoteClick && (
            <button
              className={`vote-button ${isExpired ? "disabled" : ""}`}
              onClick={(e) => {
                if (!isExpired) onVoteClick(e);
              }}
              disabled={isExpired}
            >
              {isExpired ? "Expiré" : "Voter"}
            </button>
          )}

          {showShareModal && (
            <>
              {type === "suggestion" ? (
                <ShareModal
                  suggestionId={descriptionId}
                  onClose={() => setShowShareModal(false)}
                />
              ) : (
                <ShareCoupDeCoeurModal
                  coupDeCoeurId={descriptionId}
                  onClose={() => setShowShareModal(false)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedFooterCdcAndSuggest;
