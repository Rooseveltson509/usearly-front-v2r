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
  descriptionId: string,
  type: "report" | "suggestion" | "coupdecoeur",
  refreshKey = 0, // Ajout d'un refreshKey pour forcer la récupération des commentaires
) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const buildCommentEndpoint = () => {
    if (type === "report") return `/descriptions/${descriptionId}/comments`;
    if (type === "suggestion") return `/suggestions/${descriptionId}/comments`;
    return `/coupdecoeurs/${descriptionId}/comments`;
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const url = buildCommentEndpoint();
      const res = await apiService.get(url);
      setComments(res.data.comments || []);
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
