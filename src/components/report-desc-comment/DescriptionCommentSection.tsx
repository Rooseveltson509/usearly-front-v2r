import React, { useEffect, useState } from "react";
import "./DescriptionCommentSection.scss";
import { MessageCircleMore, Share2 } from "lucide-react";
import { useAuth } from "@src/services/AuthContext";
import CommentSection from "@src/components/comments/CommentSection";
import DescriptionReactionSelector from "@src/utils/DescriptionReactionSelector";
import { useCommentsForDescription } from "@src/hooks/useCommentsForDescription";

interface Props {
  descriptionId: string;
  userId: string;
  type: "report" | "suggestion" | "coupdecoeur";
  modeCompact?: boolean;
  triggerType?: "default" | "text";
  onOpenSimilarReports?: () => void;
  forceClose?: boolean;
  onOpen?: () => void;
  autoOpenIfComments?: boolean;
  hideFooter?: boolean;
  refreshKey?: number;
  forceOpen?: boolean;
  onCommentCountChange?: (count: number) => void;
  onCommentAddedOrDeleted?: () => void;
}

const DescriptionCommentSection: React.FC<Props> = ({
  descriptionId,
  userId,
  type,
  modeCompact = false,
  triggerType = "default",
  onOpenSimilarReports,
  forceClose = false,
  onOpen,
  autoOpenIfComments = false,
  hideFooter = false,
  refreshKey,
  forceOpen = false,
  onCommentCountChange,
  onCommentAddedOrDeleted,
}) => {
  const { userProfile } = useAuth();
  const [localRefreshKey, setLocalRefreshKey] = useState(0);
  // Choix entre prop et état local
  const effectiveRefreshKey = refreshKey ?? localRefreshKey;

  const { comments } = useCommentsForDescription(descriptionId, type, effectiveRefreshKey);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    onCommentCountChange?.(comments.length);
  }, [comments.length]);

  const toggleComments = () => {
    const newState = !showComments;
    setShowComments(newState);
    if (newState) {
      onOpen?.();
      onOpenSimilarReports?.();
    }
  };

  useEffect(() => {
    if (forceOpen) {
      setShowComments(true);
      onOpen?.();
      onOpenSimilarReports?.();
    }
  }, [forceOpen]);

  useEffect(() => {
    if (forceClose && showComments) {
      setShowComments(false);
    }
  }, [forceClose]);

  return (
    <div className={`description-comment-section ${modeCompact ? "compact" : ""}`}>
      {!hideFooter && (
        <div className="feedback-footer">
          {triggerType === "text" ? (
            <div className="reaction-comment-row">
              <DescriptionReactionSelector
                userId={userId}
                descriptionId={descriptionId}
                type={type}
                displayAsTextLike
              />
              <span className="divider">|</span>
              <button className="reply-button" onClick={toggleComments}>
                Répondre
                {comments.length > 0 && (
                  <span className="comment-count">
                    {comments.length} {comments.length === 1 ? "réponse" : "réponses"}
                  </span>
                )}
              </button>
            </div>
          ) : (
            !modeCompact && (
              <>
                <DescriptionReactionSelector
                  userId={userId}
                  descriptionId={descriptionId}
                  type={type}
                />
                <button className="comment-toggle-btn" onClick={toggleComments}>
                  <MessageCircleMore size={16} />
                  {comments.length > 0 && ` ${comments.length}`}
                </button>
                <button className="comment-toggle-btn">
                  <Share2 size={16} />
                </button>
              </>
            )
          )}
        </div>
      )}

      {showComments && (
        <CommentSection
          descriptionId={descriptionId}
          type={type}
          onCommentAdded={() => setLocalRefreshKey((k) => k + 1)}
          onCommentDeleted={() => setLocalRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
};

export default DescriptionCommentSection;
