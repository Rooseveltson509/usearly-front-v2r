import React, { useState } from "react";

interface Props {
  avatarUrl: string;
  value: string;
  onSubmit: (text: string) => void;
}

const CommentForm: React.FC<Props> = ({ avatarUrl, value, onSubmit }) => {
  const [text, setText] = useState(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <img src={avatarUrl} alt="avatar" className="comment-avatar" />
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
