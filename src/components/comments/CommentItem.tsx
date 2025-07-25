import React from "react";
import CommentActionsMenu from "../commons/CommentActionsMenu";
import Avatar from "../shared/Avatar";

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
      <Avatar
        avatar={avatarUrl}
        pseudo={comment.user.pseudo}
        type="user"
        className="comment-avatar"
        wrapperClassName="comment-avatar-wrapper"
      />
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{comment.user.pseudo}</span>
          <span className="comment-time">⸱ {dateLabel}</span>
          {isAuthor && <CommentActionsMenu onDelete={onDelete} />}
        </div>
        <p className="comment-text">{comment.content}</p>
        {/* A implémenter plus tar */}
        {/*         <div className="comment-actions">
          <button type="button">J’aime</button>
          <span> | </span>
          <button type="button">Répondre</button>
        </div> */}
      </div>
    </li>
  );
};

export default CommentItem;
