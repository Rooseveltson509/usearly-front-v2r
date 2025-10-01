import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import "./DescriptionReactionSelector.scss";
import { useReactionsForDescription } from "@src/hooks/useReactionsForDescription";
import { useReactionsForItem } from "@src/hooks/useReactionsForItem";
import { getEmojisForType } from "@src/components/constants/emojiMapByType";
import EmojiWithTooltip from "@src/components/constants/EmojiWithTooltip";

interface Props {
  userId: string;
  descriptionId: string;
  type: "report" | "suggestion" | "coupdecoeur";
  displayAsTextLike?: boolean;
}

const DescriptionReactionSelector = forwardRef(
  function DescriptionReactionSelector(
    { userId, descriptionId, type, displayAsTextLike }: Props,
    ref,
  ) {
    const [isOpen, setIsOpen] = useState(false);
    const popupTimerRef = useRef<NodeJS.Timeout | null>(null);

    const emojiOptions = getEmojisForType(type);

    // ✅ On appelle toujours les deux hooks
    const itemReactions = useReactionsForItem(
      userId,
      descriptionId,
      (type === "suggestion" || type === "coupdecoeur"
        ? type
        : "suggestion") as "suggestion" | "coupdecoeur",
    );

    const descriptionReactions = useReactionsForDescription(
      userId,
      descriptionId,
    );

    // ✅ On choisit lequel utiliser selon le type
    const { getCount, hasReactedWith, handleReact } =
      type === "suggestion" || type === "coupdecoeur"
        ? itemReactions
        : descriptionReactions;

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

    // ✅ expose open() / close() au parent
    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }));

    // ✅ savoir si l'utilisateur a déjà réagi
    const hasReacted = emojiOptions.some((item) => hasReactedWith(item.emoji));

    return (
      <div
        className="reaction-selector"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className={`main-reaction ${displayAsTextLike ? "as-text-like" : ""} ${
            hasReacted ? "reacted" : ""
          }`}
        >
          {displayAsTextLike ? (
            <>
              <span className="like-text">J’aime</span>
              {activeReactions.length > 0 && (
                <>
                  {activeReactions.map((r) => (
                    <span className="emoji" key={r.emoji}>
                      {r.emoji}
                    </span>
                  ))}
                  <span className="total"> {total}</span>
                </>
              )}
            </>
          ) : activeReactions.length > 0 ? (
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
  },
);

export default DescriptionReactionSelector;
