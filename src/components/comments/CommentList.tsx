import React, { useState } from "react";
import { MoveDiagonal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import CommentItem from "./CommentItem";

interface User {
    id: string;
    pseudo: string;
    avatar: string | null;
}

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: User;
}

interface Props {
    comments: Comment[];
    userId?: string;
    filter: "pertinent" | "recents" | "anciens";
    setFilter: React.Dispatch<React.SetStateAction<"pertinent" | "recents" | "anciens">>;
    onDelete: (id: string) => void;
    getFullAvatarUrl: (avatar: string | null) => string;
}

const CommentList: React.FC<Props> = ({
    comments,
    userId,
    filter,
    setFilter,
    onDelete,
    getFullAvatarUrl,
}) => {
    const [visibleCount, setVisibleCount] = useState(3);

    const sorted = [...comments].sort((a, b) => {
        if (filter === "recents") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (filter === "anciens") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return 0;
    });

    return (
        <>
            {comments.length > 0 && (
                <div className="comments-container">
                    <div className="comments-header">
                        <label htmlFor="filter-select">Commentaires</label>
                        <select
                            id="filter-select"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as any)}
                        >
                            <option value="pertinent">Les plus pertinents</option>
                            <option value="recents">Les plus récents</option>
                            <option value="anciens">Les plus anciens</option>
                        </select>
                    </div>

                    <ul className="comment-list">
                        {sorted.slice(0, visibleCount).map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                isAuthor={comment.user.id === userId}
                                onDelete={() => onDelete(comment.id)}
                                avatarUrl={getFullAvatarUrl(comment.user.avatar)}
                                dateLabel={formatDistanceToNow(new Date(comment.createdAt), {
                                    locale: fr,
                                    addSuffix: true,
                                })}
                            />
                        ))}
                    </ul>

                    {comments.length > visibleCount && (
                        <button
                            className="load-more-comments-btn"
                            onClick={() => setVisibleCount((prev) => prev + 3)}
                        >
                            <span className="load-more-icon">
                                <MoveDiagonal size={18} />
                            </span>
                            Afficher plus de commentaires
                        </button>
                    )}
                </div>
            )}
        </>
    );
};

export default CommentList;
