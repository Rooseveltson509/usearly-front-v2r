import React from "react";
import CommentActionsMenu from "../commons/CommentActionsMenu";

interface CommentItemProps {
  comment: {
    content: string;
    user: {
      pseudo: string;
    };
  };
  avatarUrl: string;
  dateLabel: string;
  isAuthor: boolean;
  onDelete: () => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, avatarUrl, dateLabel, isAuthor, onDelete }) => {
  return (
    <li className="comment-item">
      <img src={avatarUrl} alt="avatar" className="comment-avatar" />
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{comment.user.pseudo}</span>
          <span className="comment-time">⸱ {dateLabel}</span>
          {isAuthor && <CommentActionsMenu onDelete={onDelete} />}
        </div>
        <p className="comment-text">{comment.content}</p>
        <div className="comment-actions">
          <button type="button">J’aime</button>
          <span> | </span>
          <button type="button">Répondre</button>
        </div>
      </div>
    </li>
  );
};

export default CommentItem;
