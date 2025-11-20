import { apiService } from "@src/services/apiService";
import type { UserReaction } from "@src/types/reaction";
import { useEffect, useState } from "react";

interface Options {
  enabled?: boolean;
}

export const useReactionsForDescription = (
  userId: string,
  id: string,
  type?: "coupdecoeur" | "suggestion",
  options?: Options,
) => {
  const [reactions, setReactions] = useState<UserReaction[]>([]);
  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!id || !enabled) return;

    const fetchReactions = async () => {
      try {
        const endpoint = type
          ? type === "coupdecoeur"
            ? `/coupdecoeurs/${id}/reactions`
            : `/suggestions/${id}/reactions`
          : `/descriptions/${id}/reactions`; // fallback pour ne rien casser

        const res = await apiService.get(endpoint);
        setReactions(res.data.reactions || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des réactions :", error);
      }
    };

    fetchReactions();
  }, [id, type, enabled]);

  const getCount = (emoji: string) =>
    reactions.filter((r) => r.emoji === emoji).length;

  const hasReactedWith = (emoji: string) =>
    reactions.some((r) => r.userId === userId && r.emoji === emoji);

  const handleReact = async (emoji: string) => {
    if (!enabled) return;
    try {
      const endpoint = type
        ? type === "coupdecoeur"
          ? `/coupdecoeurs/${id}/reactions`
          : `/suggestions/${id}/reactions`
        : `/descriptions/${id}/reactions`; // fallback aussi ici

      const res = await apiService.put(endpoint, { emoji });
      setReactions(res.data.reactions || []);
    } catch (error) {
      console.error("Erreur lors de la réaction :", error);
    }
  };

  return {
    reactions,
    getCount,
    hasReactedWith,
    handleReact,
  };
};
