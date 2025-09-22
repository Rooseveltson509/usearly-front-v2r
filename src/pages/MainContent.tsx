import { useState } from "react";
import "./MainContent.scss";
import type { FeedbackType } from "@src/types/Reports";

const filters = [
    { key: "hot", label: "Ça chauffe par ici 🔥" },
    { key: "rage", label: "Les plus rageants 😡" },
    { key: "popular", label: "Les plus populaires 👍" },
    { key: "urgent", label: "À shaker vite 👀" },
];

const signalements = [
    {
        id: 1,
        title: "Impossible de retirer un article du panier",
        content: 'Je viens de passer une commande sur votre site en utilisant le code promo "HAPPY20".. Voir plus',
        count: 139,
        comments: 12,
        reactions: 45,
        status: "En cours de correction",
        user: "Zaïa",
        brand: "Decathlon",
        icon: "🛒",
        avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    },
    {
        id: 2,
        title: "Le code promo ne s’affiche pas",
        content: 'Je viens de passer une commande sur votre site en utilisant le code promo "HAPPY20".',
        count: 79,
        comments: 12,
        reactions: 45,
        status: "En cours de correction",
        user: "Zaïa",
        brand: "Spotify",
        icon: "🏷️",
        avatar: "https://avatars.githubusercontent.com/u/2?v=4",
    },
    {
        id: 3,
        title: "Texte illisible",
        content: 'Je viens de passer une commande sur votre site en utilisant le code promo "HAPPY20".',
        count: 24,
        comments: 12,
        reactions: 45,
        status: "En cours de correction",
        user: "Zaïa",
        brand: "Netflix",
        icon: "🔠",
        avatar: "https://avatars.githubusercontent.com/u/3?v=4",
    },
];

interface Props {
    activeTab: FeedbackType;
}

const MainContent: React.FC<Props> = ({ activeTab }) => {
    const [selectedFilter, setSelectedFilter] = useState("");

    return (
        <div className="main-wrapper">
            <div className="purple-background" />

            <div className="main-content">
                <div className="left-column">
                    <div className="filter-header">
                        <h2>{selectedFilter || "Signalements récents"}</h2>
                        <button className="filter-btn">⚙️ Filtrer</button>
                    </div>

                    <div className="signalement-list">
                        {signalements.map((s) => (
                            <div className="card" key={s.id}>
                                <div className="card-header">
                                    <span className="emoji">{s.icon}</span>
                                    <h3>{s.title}</h3>
                                    <span className="badge">{s.count}</span>
                                </div>
                                <p className="card-content">{s.content}</p>
                                <div className="card-meta">
                                    <span>🔥 {s.reactions}</span>
                                    <span>💬 {s.comments} commentaires</span>
                                    <span>📢 {s.count} signalements</span>
                                    <span className="status">🛠️ {s.status}</span>
                                </div>
                                <div className="card-actions">
                                    <button>👍 Réagir</button>
                                    <button>💬 Commenter</button>
                                    <button>🔗 Partager</button>
                                </div>
                                <div className="user-info">
                                    <img src={s.avatar} alt="avatar" />
                                    <span>
                                        {s.user} x <strong>{s.brand}</strong>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="right-column">
                    <div className="illustration-box">
                        <h3>Les signalements récents !</h3>
                        <img src="/illustration.png" alt="illustration" />
                    </div>
                </div>
            </div>

            {/* ✅ Filtres déplacés ici (en dehors du bloc violet) */}
            <div className="filters-row">
                <div className="filters-wrapper">
                    {filters.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setSelectedFilter(f.label)}
                            className={selectedFilter === f.label ? "active" : ""}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MainContent;