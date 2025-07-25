import React, { useEffect, useState } from "react";
import { apiService } from "@src/services/apiService";
import { useAuth } from "@src/services/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import "./CommentInputSection.scss";
import { MoveDiagonal, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import CommentActionsMenu from "../commons/CommentActionsMenu";
import { getFullAvatarUrl } from "@src/utils/avatarUtils";
import Avatar from "../shared/Avatar";
//import CommentActionsMenu from "./CommentActionsMenu";

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
    type: "report" | "suggestion" | "coupdecoeur";
    onCommentAdded?: () => void;
    onCommentDeleted?: () => void;
}

const CommentInputSection: React.FC<Props> = ({ descriptionId, type, onCommentAdded, onCommentDeleted }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [visibleCount, setVisibleCount] = useState(3);
    const [filter, setFilter] = useState<"pertinent" | "recents" | "anciens">("pertinent");
    const { userProfile } = useAuth();

    const buildCommentEndpoint = () => {
        if (type === "report") return `/descriptions/${descriptionId}/comments`;
        if (type === "suggestion") return `/suggestions/${descriptionId}/comments`;
        return `/coupdecoeurs/${descriptionId}/comments`;
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await apiService.get(buildCommentEndpoint());
                setComments(res.data.comments || []);
            } catch (err) {
                console.error("Erreur de chargement des commentaires :", err);
            }
        };
        fetchComments();
    }, [descriptionId, type]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const res = await apiService.post(buildCommentEndpoint(), { content: newComment });
            if (res.data.comment) {
                const commentWithUser = {
                    ...res.data.comment,
                    user: {
                        id: userProfile?.id ?? res.data.comment.user.id ?? "",
                        pseudo: userProfile?.pseudo ?? res.data.comment.user.pseudo ?? "Utilisateur",
                        avatar: userProfile?.avatar ?? res.data.comment.user.avatar ?? null,
                    },
                };
                setComments(prev => [commentWithUser, ...prev]);
                setNewComment("");
                onCommentAdded?.();
            }

        } catch (err) {
            console.error("Erreur envoi commentaire :", err);
        }
    };

    const sortedComments = [...comments].sort((a, b) => {
        if (filter === "recents") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (filter === "anciens") {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return 0; // pertinent par défaut
    });

    const handleDeleteComment = async (commentId: string) => {
        const result = await Swal.fire({
            title: "Supprimer le commentaire ?",
            text: "Cette action est irréversible.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui, supprimer",
            cancelButtonText: "Annuler",
        });
        if (!result.isConfirmed) return;
        try {
            await apiService.delete(`/comments/${commentId}`);
            setComments(prev => prev.filter(comment => comment.id !== commentId));
            Swal.fire("Supprimé", "Le commentaire a été supprimé.", "success");
            onCommentDeleted?.();
        } catch (err) {
            console.error("Erreur suppression commentaire :", err);
            Swal.fire("Erreur", "Impossible de supprimer ce commentaire.", "error");
        }
    };
    return (
        <div className="comment-input-section">
            {userProfile && (
                <form onSubmit={handleSubmit} className="comment-form">
                    <img src={getFullAvatarUrl(userProfile.avatar)} alt="avatar" className="comment-avatar" />
                          <Avatar
                            avatar={userProfile.avatar}
                            pseudo={userProfile.pseudo}
                            type="user"
                            className="comment-avatar"
                            wrapperClassName="comment-avatar-wrapper"
                          />
                    <input
                        type="text"
                        placeholder="Commenter…"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button type="submit">Envoyer</button>
                </form>
            )}

            {comments.length > 0 && (
                <div className="comments-container">
                    <div className="comments-header">
                        <label htmlFor="filter-select">Commentaires</label>
                        <select
                            id="filter-select"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as "pertinent" | "recents" | "anciens")}
                        >
                            <option value="pertinent">Les plus pertinents</option>
                            <option value="recents">Les plus récents</option>
                            <option value="anciens">Les plus anciens</option>
                        </select>
                    </div>

                    <ul className="comment-list">
                        {sortedComments.slice(0, visibleCount).map((comment) => (
                            <li key={comment.id} className="comment-item">
                                <Avatar
                                    avatar={comment.user.avatar}
                                    pseudo={comment.user.pseudo}
                                    type="user"
                                    className="comment-avatar"
                                    wrapperClassName="comment-avatar-wrapper"
                                />
                                <div className="comment-content">
                                    <div className="comment-header">
                                        <span className="comment-author">{comment.user.pseudo}</span>
                                        <span className="comment-time">
                                            ⸱ {formatDistanceToNow(new Date(comment.createdAt), { locale: fr, addSuffix: true })}
                                        </span>
                                        {comment?.user.id === userProfile?.id && (
                                            <CommentActionsMenu onDelete={() => handleDeleteComment(comment.id)} />
                                        )}
                                    </div>
                                    <p className="comment-text">{comment.content}</p>
                                    <div className="comment-actions">
                                        <button type="button">J’aime</button>
                                        <span> | </span>
                                        <button type="button">Répondre</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>


                    {comments.length > visibleCount && (
                        <button
                            className="load-more-comments-btn"
                            onClick={() => setVisibleCount(prev => prev + 3)}
                        >
                            <span className="load-more-icon">
                                <MoveDiagonal size={18} />
                            </span>
                            Afficher plus de commentaires
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentInputSection;
