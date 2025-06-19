import React, { useRef, useState } from "react";
import "./DescriptionReactionSelector.scss";
import { useReactionsForDescription } from "@src/hooks/useReactionsForDescription";
import { useReactionsForItem } from "@src/hooks/useReactionsForItem";
import { emojiLabelMap, emojiMapByType } from "@src/components/constants/emojiMapByType";
import EmojiWithTooltip from "@src/components/constants/EmojiWithTooltip";

interface Props {
  userId: string;
  descriptionId: string;
  type: "report" | "suggestion" | "coupdecoeur";
}

const DescriptionReactionSelector: React.FC<Props> = ({ userId, descriptionId, type }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupTimerRef = useRef<NodeJS.Timeout | null>(null);
  const emojiOptions = emojiMapByType[type];

  const {
    getCount,
    hasReactedWith,
    handleReact,
  } = type === "suggestion" || type === "coupdecoeur"
      ? useReactionsForItem(userId, descriptionId, type)
      : useReactionsForDescription(userId, descriptionId);


  const activeReactions = emojiOptions
    .map((emoji) => ({ emoji, count: getCount(emoji) }))
    .filter((r) => r.count > 0);

  const total = activeReactions.reduce((acc, r) => acc + r.count, 0);

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
        {activeReactions.length > 0
          ? (
            <>
              {activeReactions.map((r) => (
                <span className="emoji" key={r.emoji}>{r.emoji}</span>
              ))}
              <span className="total">{total}</span>
            </>
          ) : "😊"}
      </button>

      {isOpen && (
        <div className="reaction-popup">
          {emojiOptions.map((emoji) => {
            const count = getCount(emoji);
            const isSelected = hasReactedWith(emoji);

            return (
              <EmojiWithTooltip
                key={emoji}
                emoji={emoji}
                label={emojiLabelMap[emoji]}
                count={count}
                isSelected={isSelected}
                onClick={async () => {
                  await handleReact(emoji);
                  setIsOpen(false);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DescriptionReactionSelector;
