import React, { useRef, useState } from "react";
import "./ReactionSelector.scss";
import { useReactionsForDescription } from "@src/hooks/useReactionsForDescription";

const emojiOptions = ["🔥", "🙌", "💯", "😭", "😡", "💡"];

interface Props {
  userId: string;
  descriptionId: string;
}

const DescriptionReactionSelector: React.FC<Props> = ({ userId, descriptionId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { getCount, hasReactedWith, handleReact } = useReactionsForDescription(userId, descriptionId);

  const selected = emojiOptions.find(hasReactedWith);

  const handleMouseEnter = () => {
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    popupTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <div
      className="reaction-selector"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="main-reaction">
        {selected || "😊"} {selected ? getCount(selected) : ""}
      </button>

      {isOpen && (
        <div className="reaction-popup">
          {emojiOptions.map((emoji) => (
            <button
              key={emoji}
              className="emoji-button"
              onClick={async () => {
                await handleReact(emoji);
                setIsOpen(false);
              }}
            >
              {emoji}
              <span className="count">{getCount(emoji)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DescriptionReactionSelector;
