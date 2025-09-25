import React, { useState } from "react";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { useReactionsForDescription } from "@src/hooks/useReactionsForDescription";
import EmojiUrlyReactionPicker from "@src/utils/EmojiUrlyReactionPicker";
import { getEmojisForType } from "@src/components/constants/emojiMapByType";
import DescriptionCommentSection from "../report-desc-comment/DescriptionCommentSection";
import "./SharedFooterCdcAndSuggest.scss";
import ShareModal from "./share-modal/ShareModal";

interface Props {
  userId: string;
  descriptionId: string;
  type: "coupdecoeur" | "suggestion";
  statusLabel?: string;
  onToggle?: (id: string) => void;
}

const SharedFooterCdcAndSuggest: React.FC<Props> = ({
  userId,
  descriptionId,
  type,
  onToggle,
  statusLabel = "En cours de correction",
}) => {
  const emojis = getEmojisForType(type);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  let hoverTimeout: NodeJS.Timeout;

  const { reactions, getCount, handleReact } = useReactionsForDescription(
    userId,
    descriptionId,
    type
  );

  const allReactions = emojis
    .map((e) => ({ emoji: e.emoji, count: getCount(e.emoji) }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  const topThree = allReactions.slice(0, 3);
  const totalCount = allReactions.reduce((acc, r) => acc + r.count, 0);

  const handleAddReaction = async (emoji: string) => {
    await handleReact(emoji);
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <div className="shared-footer-cdc">
      {/* Ligne emoji + compteur commentaires */}
      <div className="footer-header-row">
        <div className="emoji-display">
          {topThree.map((r) => (
            <span key={r.emoji} className="emoji-icon">
              {r.emoji}
            </span>
          ))}
          {totalCount > 0 && (
            <span className="reaction-count">{totalCount}</span>
          )}
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
            <button type="button">
              <ThumbsUp size={16} />
              <span>Réagir</span>
            </button>
            {showEmojiPicker && (
              <div className="emoji-picker-container">
                <EmojiUrlyReactionPicker
                  onSelect={handleAddReaction}
                  type={type}
                  userId={userId}
                  descriptionId={descriptionId}
                />
              </div>
            )}
          </div>

          {/* Commenter */}
          <button className="comment-toggle-btn" onClick={toggleComments}>
            <MessageCircle size={16} /> Commenter
          </button>

          {/* Partager */}
          <button
            className="share-btn"
            onClick={() => setShowShareModal(true)}
          >
            <Share2 size={16} /> Partager
          </button>

          {showShareModal && (
            <ShareModal
              suggestionId={descriptionId}
              onClose={() => setShowShareModal(false)}
            />
          )}

        </div>

        <div className="comments-section">
          <DescriptionCommentSection
            userId={userId}
            descriptionId={descriptionId}
            type={type}
            hideFooter={true}
            autoOpenIfComments={false}
            forceOpen={showComments}
            onCommentCountChange={setCommentCount}
            onCommentAddedOrDeleted={() => {
              setCommentCount((prev) => prev + 1);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SharedFooterCdcAndSuggest;
