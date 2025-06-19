import React, { useEffect, useState } from "react";
import "./DescriptionCommentSection.scss";
import { useAuth } from "@src/services/AuthContext";
import { apiService } from "@src/services/apiService";
import Swal from "sweetalert2";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        pseudo: string;
        avatar: string | null;
    };
}

interface Props {
    descriptionId: string;
    userId: string;
    type: "report" | "suggestion" | "coupdecoeur";
}

const getFullAvatarUrl = (path: string | null) => {
    if (!path) return "/default-avatar.png";
    return `${import.meta.env.VITE_API_BASE_URL}/${path}`;
};

const DescriptionCommentSection: React.FC<Props> = ({ descriptionId, userId, type }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const { userProfile } = useAuth();

    const buildCommentEndpoint = () => {
        if (type === "report") return `/descriptions/${descriptionId}/comments`;
        if (type === "suggestion") return `/suggestions/${descriptionId}/comments`;
        return `/coupdecoeurs/${descriptionId}/comments`;
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const url = buildCommentEndpoint();
                const res = await apiService.get(url);
                setComments(res.data.comments || []);
            } catch (err) {
                console.error("Erreur lors du chargement des commentaires :", err);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [descriptionId, type]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const url = buildCommentEndpoint();
            const res = await apiService.post(url, { content: newComment });

            if (res.data.comment) {
                const newCommentWithUserId = {
                    ...res.data.comment,
                    user: {
                        ...res.data.comment.user,
                        id: userProfile?.id, // 🔑 on force l'id de l'utilisateur actuel ici
                    },
                };

                setComments((prev) => [...prev, newCommentWithUserId]);
                setNewComment("");
            }
        } catch (err) {
            console.error("Erreur lors de l’envoi du commentaire :", err);
        }
    };


    const handleDeleteComment = async (commentId: string) => {
        const result = await Swal.fire({
            title: "Supprimer le commentaire ?",
            text: "Cette action est irréversible.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d9534f",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Oui, supprimer",
            cancelButtonText: "Annuler",
        });

        if (!result.isConfirmed) return;

        try {
            await apiService.delete(`/comments/${commentId}`);
            setComments((prev) => prev.filter((c) => c.id !== commentId));
            Swal.fire("Supprimé", "Le commentaire a été supprimé.", "success");
        } catch (err) {
            console.error("❌ Erreur suppression :", err);
            Swal.fire("Erreur", "Impossible de supprimer ce commentaire.", "error");
        }
    };

    return (
        <div className="description-comment-section">
            <h4 className="comment-title">💬 Commentaires</h4>

            {loading ? (
                <p>Chargement...</p>
            ) : (
                <ul className="comment-list">
                    {comments.map((comment) => (
                        <li key={comment.id} className="comment-item">
                            <img
                                src={getFullAvatarUrl(comment.user?.avatar)}
                                alt="avatar"
                                className="comment-avatar"
                            />
                            <div className="comment-content">
                                <span className="comment-author">{comment.user?.pseudo}</span>
                                <p>{comment.content}</p>
                                {comment.user.id === userProfile?.id && (
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteComment(comment.id)}
                                    >
                                        🗑
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {userProfile && (
                <form onSubmit={handleSubmit} className="comment-form">
                    <input
                        type="text"
                        placeholder="Écris un commentaire..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button type="submit">Envoyer</button>
                </form>
            )}
        </div>
    );
};

export default DescriptionCommentSection;
