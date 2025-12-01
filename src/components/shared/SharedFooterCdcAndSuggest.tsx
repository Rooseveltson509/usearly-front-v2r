import React, { useState } from "react";
import { MessageCircle, Share2 } from "lucide-react";
import { useReactionsForDescription } from "@src/hooks/useReactionsForDescription";
import { getEmojisForType } from "@src/components/constants/emojiMapByType";
import "./SharedFooterCdcAndSuggest.scss";

import EmojiSummary from "@src/components/publications/footerParts/EmojiSummary/EmojiSummary";
import CommentCountLabel from "@src/components/publications/footerParts/CommentCountLabel/CommentCountLabel";
import ReactionPickerTrigger from "@src/components/publications/footerParts/ReactionPickerTrigger/ReactionPickerTrigger";
import ShareModalSwitch from "@src/components/publications/footerParts/ShareModalSwitch/ShareModalSwitch";
import VoteButton from "@src/components/publications/footerParts/VoteButton/VoteButton";

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
  const [showShareModal, setShowShareModal] = useState(false);

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

  const safeCommentCount = isGuestMode ? 0 : commentCount;

  const handleAddReaction = async (emoji: string) => {
    await handleReact(emoji);
  };

  const toggleComments = () => onToggleComments();

  return (
    <div className={`shared-footer-cdc ${isExpired ? "expired" : ""}`}>
      {/* Ligne emoji + compteur commentaires */}
      <div className="footer-header-row">
        <EmojiSummary topReactions={topThree} totalCount={totalCount} />

        <div className="comment-count-right">
          <CommentCountLabel
            count={safeCommentCount}
            onClick={toggleComments}
          />
        </div>
      </div>

      {/* Trait séparateur */}
      <div className="footer-divider" />

      <div className="footer-bottom">
        <div className="footer-buttons">
          <div className="action-user-buttons">
            {/* Réagir */}
            <ReactionPickerTrigger
              userId={userId}
              descriptionId={descriptionId}
              type={type}
              disabled={isExpired}
              addClassName="like-btn-centre"
              onSelect={handleAddReaction}
            />

            {/* Commenter */}
            <button
              className={`comment-toggle-btn comment-btn-centre ${showComments ? "active" : ""}`}
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
              className="share-btn share-btn-centre"
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

          {/* Voter (suggestion uniquement) */}
          {type === "suggestion" && (
            <VoteButton isExpired={isExpired} onClick={onVoteClick} />
          )}

          {/* Modals de partage */}
          <ShareModalSwitch
            type={type}
            id={descriptionId}
            open={showShareModal}
            onClose={() => setShowShareModal(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default SharedFooterCdcAndSuggest;
