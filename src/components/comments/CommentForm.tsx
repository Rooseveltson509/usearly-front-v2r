import React, { useState } from "react";
import Avatar from "../shared/Avatar";
import { useAuth } from "@src/services/AuthContext";

interface Props {
  avatarUrl: string;
  value: string;
  onSubmit: (text: string) => void;
}

const CommentForm: React.FC<Props> = ({ avatarUrl, value, onSubmit }) => {
  const [text, setText] = useState(value);
     const { userProfile } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <Avatar
        avatar={avatarUrl}
        type="user"
        pseudo={userProfile?.pseudo}
        className="comment-avatar"
        wrapperClassName="comment-avatar-wrapper"
      />
      <input
        type="text"
        placeholder="Commenter…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Envoyer</button>
    </form>
  );
};

export default CommentForm;
