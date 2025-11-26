import React from "react";

interface Props {
  count: number;
  onClick?: () => void;
}

export default function CommentCountLabel({ count, onClick }: Props) {
  if (count <= 0) return null;
  return (
    <span
      className="comment-count-label"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {count} {count === 1 ? "commentaire" : "commentaires"}
    </span>
  );
}
