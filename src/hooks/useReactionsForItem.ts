import { useEffect, useState } from "react";
import {
  fetchCoupDeCoeurReactions,
  fetchSuggestionReactions,
  sendCoupDeCoeurReaction,
  sendSuggestionReaction,
} from "@src/services/reactionService";
import type { UserReaction } from "@src/types/reaction";

export const useReactionsForItem = (
  userId: string,
  itemId: string,
  type: "suggestion" | "coupdecoeur",
) => {
  const [reactions, setReactions] = useState<UserReaction[]>([]);

  useEffect(() => {
    if (!itemId) return;

    const fetchReactions = async () => {
      try {
        const res =
          type === "suggestion"
            ? await fetchSuggestionReactions(itemId)
            : await fetchCoupDeCoeurReactions(itemId);

        setReactions(res || []);
      } catch (error) {
        console.error("❌ Erreur fetchReactionsForItem :", error);
      }
    };

    fetchReactions();
  }, [itemId, type]);

  const getCount = (emoji: string) =>
    reactions.filter((r) => r.emoji === emoji).length;

  const hasReactedWith = (emoji: string) =>
    reactions.some((r) => r.userId === userId && r.emoji === emoji);

  const handleReact = async (emoji: string) => {
    try {
      const res =
        type === "suggestion"
          ? await sendSuggestionReaction(itemId, emoji)
          : await sendCoupDeCoeurReaction(itemId, emoji);

      setReactions(res.reactions || []);
    } catch (err) {
      console.error("❌ Erreur sendReactionForItem :", err);
    }
  };

  return {
    reactions,
    getCount,
    hasReactedWith,
    handleReact,
  };
};
