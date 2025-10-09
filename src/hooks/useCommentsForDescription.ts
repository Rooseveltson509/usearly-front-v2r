import { useEffect, useState } from "react";
import { apiService } from "@src/services/apiService";

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    pseudo: string;
    avatar: string | null;
  };
}

export const useCommentsForDescription = (
  descriptionId: string | undefined,
  type: "report" | "suggestion" | "coupdecoeur",
  refreshKey = 0, // permet de recharger manuellement
) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const buildCommentEndpoint = () => {
    if (!descriptionId) return null; // ✅ aucune requête si id manquant
    if (type === "report") return `/descriptions/${descriptionId}/comments`;
    if (type === "suggestion") return `/suggestions/${descriptionId}/comments`;
    return `/coupdecoeurs/${descriptionId}/comments`;
  };

  const fetchComments = async () => {
    const url = buildCommentEndpoint();
    if (!url) return; // ✅ sécurité anti-404

    try {
      setLoading(true);
      const res = await apiService.get(url);
      // certains back renvoient { comments: [...] }, d'autres { data: [...] }
      setComments(res.data.comments || res.data.data || []);
    } catch (err) {
      console.error("Erreur lors du chargement des commentaires :", err);
    } finally {
      setLoading(false);
    }
  };

  const addComment = (comment: Comment) => {
    setComments((prev) => [...prev, comment]);
  };

  const deleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  useEffect(() => {
    fetchComments();
  }, [descriptionId, type, refreshKey]);

  return {
    comments,
    loading,
    addComment,
    deleteComment,
    refreshComments: fetchComments,
  };
};
