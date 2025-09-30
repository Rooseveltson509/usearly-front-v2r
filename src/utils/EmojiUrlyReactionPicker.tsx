import React from "react";
import { getEmojisForType } from "@src/components/constants/emojiMapByType";
import EmojiWithTooltip from "@src/components/constants/EmojiWithTooltip";
import { useReactionsForDescription } from "@src/hooks/useReactionsForDescription";
import "./EmojiUrlyReactionPicker.scss";

interface Props {
  onSelect: (emoji: string) => void;
  type: "report" | "suggestion" | "coupdecoeur";
  userId: string;
  descriptionId: string;
}

const EmojiUrlyReactionPicker: React.FC<Props> = ({ onSelect, type, userId, descriptionId }) => {
  const emojis = getEmojisForType(type);

  if (process.env.NODE_ENV !== "production") {
    console.debug("Emoji picker type:", type, "emojis count:", emojis.length);
  }

  // Pour gérer le "surbrillance si déjà sélectionné"
  const { getCount, hasReactedWith } = useReactionsForDescription(userId, descriptionId);

  return (
    <div className="emoji-reaction-picker">
      {emojis.map((emojiObj) => {
        const count = getCount(emojiObj.emoji);
        const isSelected = hasReactedWith(emojiObj.emoji);

        return (
          <EmojiWithTooltip
            key={emojiObj.emoji}
            emoji={emojiObj.emoji}
            label={emojiObj.label}
            count={count}
            isSelected={isSelected}
            onClick={async () => {
              await onSelect(emojiObj.emoji);
            }}
          />
        );
      })}
    </div>
  );
};

export default EmojiUrlyReactionPicker;
