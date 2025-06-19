import React from "react";
import "./EmojiWithTooltip.scss";

interface Props {
  emoji: string;
  label: string;
  onClick?: () => void;
  count?: number;
  isSelected?: boolean;
}

const EmojiWithTooltip: React.FC<Props> = ({ emoji, label, onClick, count, isSelected }) => {
  return (
    <div className="emoji-tooltip-wrapper">
      <button
        className={`emoji-button ${isSelected ? "selected" : ""}`}
        onClick={onClick}
      >
        <span className="emoji">{emoji}</span>
        {count !== undefined && count > 0 && <span className="count">{count}</span>}
        <span className="custom-tooltip">{label}</span>
      </button>
    </div>
  );
};

export default EmojiWithTooltip;
