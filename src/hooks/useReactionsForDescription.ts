import { apiService } from "@src/services/apiService";
import type { UserReaction } from "@src/types/reaction";
import { useEffect, useState } from "react";

export const useReactionsForDescription = (
  userId: string,
  descriptionId: string
) => {
  const [reactions, setReactions] = useState<UserReaction[]>([]);

  useEffect(() => {
    if (!descriptionId) return;

    const fetchReactions = async () => {
      try {
        const res = await apiService.get(`/descriptions/${descriptionId}/reactions`);
        setReactions(res.data.reactions || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des réactions :", error);
      }
    };

    fetchReactions();
  }, [descriptionId]);

  const getCount = (emoji: string) =>
    reactions.filter((r) => r.emoji === emoji).length;

  const hasReactedWith = (emoji: string) =>
    reactions.some((r) => r.userId === userId && r.emoji === emoji);

  const handleReact = async (emoji: string) => {
    try {
      const res = await apiService.put(`/descriptions/${descriptionId}/reactions`, {
        emoji,
      });
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
