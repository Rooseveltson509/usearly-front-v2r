/* import { useEffect, useState } from "react";
import { fetchComments, sendComment, deleteComment } from "@src/services/commentService";
import type { CommentItem } from "@src/types/comment";

export const useComments = (
  type: "report" | "suggestion" | "coupdecoeur",
  itemId: string,
  userId: string
) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchComments(type, itemId);
        setComments(res);
      } catch (err) {
        console.error("❌ Erreur fetchComments", err);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) load();
  }, [itemId, type]);

  const addComment = async (content: string) => {
    try {
      const res = await sendComment(type, itemId, content);
      setComments((prev) => [...prev, res.comment]);
    } catch (err) {
      console.error("❌ Erreur sendComment", err);
    }
  };

  const removeComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("❌ Erreur deleteComment", err);
    }
  };

  return {
    comments,
    loading,
    addComment,
    removeComment,
  };
};
 */