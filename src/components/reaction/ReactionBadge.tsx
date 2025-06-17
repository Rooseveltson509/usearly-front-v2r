import React, { useState } from "react";
import "./ReactionBadge.scss";
import type { UserReaction } from "@src/types/reaction"; // ⚠️ adapte le chemin si besoin

interface Props {
    reactions: UserReaction[];
}

const emojiOrder = ["🔥", "🙌", "💯", "😭", "😡", "💡"];

const ReactionBadge: React.FC<Props> = ({ reactions }) => {
    const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);

    // Regroupement par emoji
    const grouped: Record<
        string,
        {
            count: number;
            users: { userId: string; userPseudo: string; userAvatar?: string | null }[];
        }
    > = {};

    for (const r of reactions) {
        if (!grouped[r.emoji]) {
            grouped[r.emoji] = { count: 0, users: [] };
        }
        grouped[r.emoji].count++;
        grouped[r.emoji].users.push({
            userId: r.userId,
            userPseudo: r.userPseudo || "Anonyme",
            userAvatar: r.userAvatar || null,
        });
    }

    const visibleEmojis = emojiOrder.filter((emoji) => grouped[emoji]);

    if (visibleEmojis.length === 0) return null;

    return (
        <div className="reaction-badge">
            {visibleEmojis.map((emoji) => (
                <div
                    key={emoji}
                    className="emoji-count"
                    onMouseEnter={() => setHoveredEmoji(emoji)}
                    onMouseLeave={() => setHoveredEmoji(null)}
                >
                    {emoji} {grouped[emoji].count}

                    {hoveredEmoji === emoji && (
                        <div className="reaction-popup">
                            {grouped[emoji].users.map((user) => (
                                <div key={user.userId} className="reaction-user">
                                    <img
                                        src={
                                            user.userAvatar
                                                ? `${import.meta.env.VITE_API_BASE_URL}/${user.userAvatar}`
                                                : "/default-avatar.png"
                                        }
                                        alt={user.userPseudo}
                                        className="reaction-avatar"
                                    />

                                    <span className="reaction-name">{user.userPseudo}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReactionBadge;
