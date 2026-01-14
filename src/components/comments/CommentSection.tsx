import React, { useEffect, useState, useCallback } from "react";
import { apiService } from "@src/services/apiService";
import { useAuth } from "@src/services/AuthContext";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import Swal from "sweetalert2";
import { getFullAvatarUrl } from "@src/utils/avatarUtils";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  likesCount?: number;
  userHasLiked?: boolean;
  user: {
    id: string;
    pseudo: string;
    avatar: string | null;
  };
}

interface Props {
  descriptionId: string;
  type: "report" | "suggestion" | "coupdecoeur";
  onCommentAdded?: () => void;
  onCommentDeleted?: () => void;
}

const CommentSection: React.FC<Props> = ({
  descriptionId,
  type,
  onCommentAdded,
  onCommentDeleted,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState<"pertinent" | "recents" | "anciens">(
    "pertinent",
  );
  const { userProfile } = useAuth();

  const buildCommentEndpoint = () => {
    if (type === "report") return `/descriptions/${descriptionId}/comments`;
    if (type === "suggestion") return `/suggestions/${descriptionId}/comments`;
    return `/coupdecoeurs/${descriptionId}/comments`;
  };

  // ✅ centralise la récupération des commentaires
  const fetchComments = useCallback(async () => {
    try {
      const res = await apiService.get(buildCommentEndpoint());
      const normalized = (res.data.comments || []).map((c: any) => ({
        ...c,
        user: c.user ??
          c.author ?? {
            id: c.userId,
            pseudo: "Utilisateur",
            avatar: null,
          },
      }));

      setComments(normalized);
    } catch (err) {
      console.error("Erreur de chargement des commentaires :", err);
    }
  }, [descriptionId, type]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAdd = async (content: string) => {
    try {
      const res = await apiService.post(buildCommentEndpoint(), { content });
      const added = {
        ...res.data.comment,
        user: {
          id: userProfile?.id ?? res.data.comment.user.id,
          pseudo: userProfile?.pseudo ?? res.data.comment.user.pseudo,
          avatar: userProfile?.avatar ?? res.data.comment.user.avatar,
        },
      };
      setComments((prev) => [added, ...prev]);
      onCommentAdded?.();
    } catch (err) {
      console.error("Erreur envoi commentaire :", err);
    }
  };

  const handleDelete = async (commentId: string) => {
    const result = await Swal.fire({
      title: "Supprimer le commentaire ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4e8cff",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (!result.isConfirmed) return;

    try {
      await apiService.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      Swal.fire("Supprimé", "Le commentaire a été supprimé.", "success");
      onCommentDeleted?.();
    } catch (err) {
      console.error("Erreur suppression :", err);
      Swal.fire("Erreur", "Impossible de supprimer ce commentaire.", "error");
    }
  };

  return (
    <div className="comment-input-section">
      {userProfile && (
        <CommentForm
          avatarUrl={getFullAvatarUrl(userProfile.avatar)}
          value=""
          onSubmit={handleAdd}
        />
      )}
      <CommentList
        comments={comments}
        userId={userProfile?.id}
        filter={filter}
        setFilter={setFilter}
        onDelete={handleDelete}
        getFullAvatarUrl={getFullAvatarUrl}
        // 🔁 on rafraîchira depuis ici plus tard si besoin (like, etc.)
      />
    </div>
  );
};

export default CommentSection;
