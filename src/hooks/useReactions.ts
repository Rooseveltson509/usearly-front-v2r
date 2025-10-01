import { useEffect, useState } from "react";
import { fetchReactions, sendReaction } from "@src/services/reactionService";
import type { UserReaction } from "@src/types/reaction";

export const useReactions = (currentUserId: string, reportId: string) => {
  const [reactions, setReactions] = useState<UserReaction[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Chargement initial des réactions depuis l’API
  useEffect(() => {
    const loadReactions = async () => {
      try {
        const data = await fetchReactions(reportId);
        setReactions(data);
      } catch (err) {
        console.error("❌ Erreur de chargement des réactions :", err);
      } finally {
        setLoading(false);
      }
    };
    loadReactions();
  }, [reportId]);

  const getCount = (emoji: string) =>
    reactions.filter((r) => r.emoji === emoji).length;

  const hasReactedWith = (emoji: string) =>
    reactions.some((r) => r.userId === currentUserId && r.emoji === emoji);

  const getUserEmoji = () =>
    reactions.find((r) => r.userId === currentUserId)?.emoji;

  const handleReact = async (emoji: string) => {
    setReactions((prev) => {
      const existing = prev.find((r) => r.userId === currentUserId);
      if (existing) {
        return existing.emoji === emoji
          ? prev.filter((r) => r.userId !== currentUserId)
          : prev.map((r) => (r.userId === currentUserId ? { ...r, emoji } : r));
      } else {
        return [...prev, { userId: currentUserId, emoji }];
      }
    });

    try {
      const { reactions: updated } = await sendReaction(reportId, emoji);
      setReactions(updated);
    } catch (err) {
      console.error("❌ Erreur d’envoi de la réaction :", err);
    }
  };

  return {
    reactions,
    getCount,
    hasReactedWith,
    handleReact,
    getUserEmoji,
    loading,
  };
};
