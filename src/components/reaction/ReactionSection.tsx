/* import React from "react";
import { useReactions } from "@src/hooks/useReactions";
import ReactionSelector from "@src/utils/ReactionSelector";

interface Props {
  userId: string;
  descriptionId: string;
}

const ReactionSection: React.FC<Props> = ({ userId, descriptionId }) => {
  const { getCount, hasReactedWith, handleReact } = useReactions(userId, descriptionId);
console.log("✅ ReactionSection mounted for", descriptionId);
  return (
    <ReactionSelector
      selected={["🔥", "🙌", "💯", "😭", "😡", "💡"].find(hasReactedWith)}
      getCount={getCount}
      onSelect={handleReact}
    />
  );
};

export default ReactionSection;
 */