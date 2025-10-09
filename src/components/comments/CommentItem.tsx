import React from "react";
import CommentActionsMenu from "../commons/CommentActionsMenu";
import Avatar from "../shared/Avatar";
import "./CommentItem.scss"; // 👈 Ajoute ce fichier SCSS juste à côté

interface CommentItemProps {
  comment: {
    id: string;
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

// 🔧 Fonction utilitaire pour formater les mentions
const formatMentions = (text: string): string => {
  if (!text) return "";
  // Transforme les @pseudo en balises stylées
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
  return (
    <li className="comment-item" data-comment-id={comment.id}>
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

        {/* 🟦 Texte du commentaire avec mentions stylées */}
        <p
          className="comment-text"
          dangerouslySetInnerHTML={{
            __html: formatMentions(comment.content),
          }}
        />

        {/* (optionnel) future zone pour like/répondre */}
        {/* <div className="comment-actions">
          <button type="button">J’aime</button>
          <span> | </span>
          <button type="button">Répondre</button>
        </div> */}
      </div>
    </li>
  );
};

export default CommentItem;
