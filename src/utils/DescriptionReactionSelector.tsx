import React, { useRef, useState } from "react";
import "./DescriptionReactionSelector.scss";
import { useReactionsForDescription } from "@src/hooks/useReactionsForDescription";
import { useReactionsForItem } from "@src/hooks/useReactionsForItem";
import { getEmojisForType } from "@src/components/constants/emojiMapByType";
import EmojiWithTooltip from "@src/components/constants/EmojiWithTooltip";

interface Props {
  userId: string;
  descriptionId: string;
  type: "report" | "suggestion" | "coupdecoeur";
}

const DescriptionReactionSelector: React.FC<Props> = ({
  userId,
  descriptionId,
  type,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Récupérer les emojis pour le type actuel
  const emojiOptions = getEmojisForType(type);

  const { getCount, hasReactedWith, handleReact } =
    type === "suggestion" || type === "coupdecoeur"
      ? useReactionsForItem(userId, descriptionId, type)
      : useReactionsForDescription(userId, descriptionId);

  const activeReactions = emojiOptions
    .map((item) => ({ emoji: item.emoji, count: getCount(item.emoji) }))
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
        {activeReactions.length > 0 ? (
          <>
            {activeReactions.map((r) => (
              <span className="emoji" key={r.emoji}>
                {r.emoji}
              </span>
            ))}
            <span className="total">{total}</span>
          </>
        ) : (
          "😊"
        )}
      </button>

      {isOpen && (
        <div className="reaction-popup">
          {emojiOptions.map((item) => {
            const count = getCount(item.emoji);
            const isSelected = hasReactedWith(item.emoji);

            return (
              <EmojiWithTooltip
                key={item.emoji}
                emoji={item.emoji}
                label={item.label}
                count={count}
                isSelected={isSelected}
                onClick={async () => {
                  await handleReact(item.emoji);
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
