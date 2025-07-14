import React, { useEffect, useState } from "react";
import "./DescriptionCommentSection.scss";
import { MessageCircleMore, Share2 } from "lucide-react";
import { useAuth } from "@src/services/AuthContext";
import CommentSection from "@src/components/comments/CommentSection";
import DescriptionReactionSelector from "@src/utils/DescriptionReactionSelector";
import { useCommentsForDescription } from "@src/hooks/useCommentsForDescription"; // ✅ manquant

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
}) => {
  const { userProfile } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { comments } = useCommentsForDescription(descriptionId, type, refreshKey);

  const toggleComments = () => {
    const newState = !showComments;
    setShowComments(newState);
    if (newState) {
      onOpen?.();
      onOpenSimilarReports?.();
    }
  };

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
                    · {comments.length} {comments.length === 1 ? "réponse" : "réponses"}
                  </span>
                )}
              </button>
            {/*   <button className="comment-toggle-btn">
                <Share2 size={16} />
              </button> */}
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
          onCommentAdded={() => setRefreshKey((k) => k + 1)}
          onCommentDeleted={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
};

export default DescriptionCommentSection;