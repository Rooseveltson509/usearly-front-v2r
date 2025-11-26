import React from "react";

type ReactionStat = { emoji: string; count: number };

interface Props {
  topReactions: ReactionStat[];
  totalCount: number;
  onCommentsClick?: () => void; // optionnel si tu veux cliquer le bloc
}

export default function EmojiSummary({ topReactions, totalCount }: Props) {
  return (
    <div className={`emoji-display ${totalCount === 1 ? "single" : ""}`}>
      <span className="emoji-icons">
        {topReactions.map((r) => (
          <span key={r.emoji} className="emoji-icon">
            {r.emoji}
          </span>
        ))}
      </span>
      <span className="total-reaction-count">
        {totalCount > 0 && <span className="reaction-count">{totalCount}</span>}
      </span>
    </div>
  );
}
