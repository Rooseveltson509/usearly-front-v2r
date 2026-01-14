import React, { useState } from "react";
import { ThumbsUp } from "lucide-react";
import CommentActionsMenu from "../commons/CommentActionsMenu";
import Avatar from "../shared/Avatar";
import "./CommentItem.scss";
import { toggleCommentLike } from "@src/services/feedbackService";

interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    likesCount?: number;
    userHasLiked?: boolean;
    author?: {
      id?: string;
      pseudo?: string;
      avatar?: string;
    } | null;
  };
  avatarUrl: string;
  dateLabel: string;
  isAuthor: boolean;
  onDelete: () => void;
  onRefresh?: () => Promise<void>;
}

// 🔧 Formate les mentions
const formatMentions = (text: string): string => {
  if (!text) return "";
  return text.replace(
    /@([a-zA-Z0-9_]+)/g,
    `<span class="mention-tag">@$1</span>`,
  );
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  avatarUrl,
  dateLabel,
  isAuthor,
  onDelete,
}) => {
  const [likesCount, setLikesCount] = useState(comment.likesCount ?? 0);
  const [liked, setLiked] = useState(comment.userHasLiked ?? false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ AUTHOR SAFE (aligné avec l’API)
  const safeUser = {
    pseudo: comment.author?.pseudo ?? "Utilisateur",
    avatar: comment.author?.avatar ?? avatarUrl ?? null,
  };

  const handleToggleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);

    setLiked((prev) => !prev);
    setLikesCount((prev) => prev + (liked ? -1 : 1));

    try {
      const res = await toggleCommentLike(comment.id);
      if (!res.data?.success) {
        setLiked((prev) => !prev);
        setLikesCount((prev) => prev + (liked ? 1 : -1));
      } else {
        setLiked(res.data.liked);
      }
    } catch (error) {
      console.error("Erreur lors du toggle like :", error);
      setLiked((prev) => !prev);
      setLikesCount((prev) => prev + (liked ? 1 : -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li className="comment-item" data-comment-id={comment.id}>
      <Avatar
        avatar={safeUser.avatar}
        pseudo={safeUser.pseudo}
        type="user"
        className="comment-avatar"
        wrapperClassName="comment-avatar-wrapper"
      />

      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{safeUser.pseudo}</span>
          <span className="comment-time">⸱ {dateLabel}</span>
          {isAuthor && <CommentActionsMenu onDelete={onDelete} />}
        </div>

        <p
          className="comment-text"
          dangerouslySetInnerHTML={{
            __html: formatMentions(comment.content),
          }}
        />

        <div className="comment-actions">
          <button
            className={`like-button ${liked ? "active" : ""}`}
            onClick={handleToggleLike}
            disabled={isLoading}
          >
            <ThumbsUp size={14} />
            <p> utile </p>
            {likesCount > 0 && <span>({likesCount})</span>}
          </button>
        </div>
      </div>
    </li>
  );
};

export default CommentItem;
