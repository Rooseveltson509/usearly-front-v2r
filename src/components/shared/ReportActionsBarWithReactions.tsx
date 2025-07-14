import React, { useState } from "react";
import { ThumbsUp, MessageCircle, Share2, CheckCircle } from "lucide-react";
import { useReactionsForDescription } from "@src/hooks/useReactionsForDescription";
import { getEmojisForType } from "@src/components/constants/emojiMapByType";
import "./ReportActionsBar.scss";
import EmojiUrlyReactionPicker from "@src/utils/EmojiUrlyReactionPicker";

interface Props {
    userId: string;
    descriptionId: string;
    reportsCount: number;
    commentsCount: number; // ✅ ajouté
    onReactClick: () => void;
    onCommentClick: () => void;
    onToggleSimilarReports?: () => void;
}

const ReportActionsBarWithReactions: React.FC<Props> = ({
    userId,
    descriptionId,
    reportsCount,
    commentsCount, // ✅ récupéré
    onCommentClick,
    onToggleSimilarReports,
}) => {
    const { getCount, handleReact } = useReactionsForDescription(userId, descriptionId);
    const emojis = getEmojisForType("report");
    const reactionsCount = emojis.reduce((acc, emoji) => acc + getCount(emoji.emoji), 0);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    let hoverTimeout: NodeJS.Timeout;

    // Trouver l'emoji le plus utilisé
    const mostUsedEmoji = emojis
        .map(e => ({ emoji: e.emoji, count: getCount(e.emoji) }))
        .sort((a, b) => b.count - a.count)[0];

    const handleAddReaction = async (emoji: string) => {
        await handleReact(emoji);
        setShowEmojiPicker(false);
    };

    return (
        <div className="report-actions-bar">
            {/* Ligne des compteurs */}
            <div className="counts-row">
                <div className="count-left">
                    {mostUsedEmoji && mostUsedEmoji.count > 0 && (
                        <>
                            <span role="img" aria-label="reaction">{mostUsedEmoji.emoji}</span>
                            <span>{mostUsedEmoji.count}</span>
                        </>
                    )}
                </div>

                <div className="count-right">
                    <MessageCircle size={16} />
                    <span>{commentsCount} {commentsCount === 1 ? "commentaire" : "commentaires"}</span>
                    {reportsCount > 1 && (
                        <span className="resignalements-link" onClick={onToggleSimilarReports}>
                            {reportsCount} resignalements
                        </span>
                    )}
                </div>
            </div>

            <div className="separator" />

            <div className="actions-row">
                <div className="actions-left">
                    <div
                        className="react-hover-area"
                        onMouseEnter={() => {
                            if (hoverTimeout) clearTimeout(hoverTimeout);
                            setShowEmojiPicker(true);
                        }}
                        onMouseLeave={() => {
                            hoverTimeout = setTimeout(() => {
                                setShowEmojiPicker(false);
                            }, 250);
                        }}
                        style={{ position: "relative" }}
                    >
                        <button type="button">
                            <ThumbsUp size={18} />
                            <span>Réagir</span>
                        </button>
                        {showEmojiPicker && (
                            <div className="emoji-picker-container">
                                <EmojiUrlyReactionPicker
                                    onSelect={handleAddReaction}
                                    type="report"
                                    userId={userId}
                                    descriptionId={descriptionId}
                                />
                            </div>
                        )}
                    </div>

                    <button onClick={onCommentClick}>
                        <MessageCircle size={18} />
                        <span>Commenter</span>
                    </button>
                    <button>
                        <Share2 size={18} />
                        <span>Partager</span>
                    </button>
                </div>
                <div className="status-right">
                    <CheckCircle size={16} color="#2563eb" />
                    <span>En cours de correction</span>
                </div>
            </div>
        </div>
    );
};

export default ReportActionsBarWithReactions;
