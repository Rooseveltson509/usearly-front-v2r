import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { apiService } from "@src/services/apiService";
import { showToast } from "@src/utils/toastUtils";
import "./ShareModal.scss";
import Avatar from "../Avatar";

interface Props {
    suggestionId: string;
    onClose: () => void;
}

const ShareModal: React.FC<Props> = ({ suggestionId, onClose }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<any | null>(null);

    // 🔎 recherche utilisateurs avec debounce
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            setLoading(true);
            try {
                // 🟢 utilise "q" comme dans ton ancien code
                const res = await apiService.get(
                    `/users/search?q=${encodeURIComponent(query)}`
                );
                setResults(res.data.users || res.data || []); // selon ce que renvoie ton backend
            } catch (err) {
                console.error("❌ Erreur recherche user:", err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);


    const handleShare = async () => {
        try {
            const payload = selected?.id
                ? { recipientId: selected.id }
                : { recipientEmail: query };

            const res = await apiService.post(
                `/share/suggestion/${suggestionId}`,
                payload
            );

            const sharedId = res.data.sharedId;
            const shareUrl = `${window.location.origin}/share/${sharedId}/public`;

            // Copier le lien dans le presse-papier (mais si ça échoue → pas une erreur critique)
            try {
                await navigator.clipboard.writeText(shareUrl);
                showToast("✅ Suggestion partagée ! Lien copié dans le presse-papier", "success");
            } catch {
                showToast("✅ Suggestion partagée ! Copie du lien échouée, voici le lien :", "warning");
                console.log("👉 Lien à partager :", shareUrl);
            }

            onClose();
        } catch (err: any) {
            console.error("❌ Erreur partage:", err);
            showToast("❌ Impossible de partager la suggestion", "error");
        }
    };


    return (
        <div className="share-modal-overlay" onClick={onClose}>
            <div className="share-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Partager la suggestion</h3>
                    <button className="close-btn" onClick={onClose}>
                        <X />
                    </button>
                </div>
                <div style={{ position: "relative" }}>
                    <input
                        type="text"
                        placeholder="Rechercher un utilisateur"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />

                    {/* 🟢 Afficher l’utilisateur sélectionné */}
                    {selected ? (
                        <div className="selected-user">
                            <Avatar avatar={selected.avatar} pseudo={selected.pseudo} type="user" />
                            <span>{selected.pseudo}</span>
                            <button onClick={() => setSelected(null)}>×</button>
                        </div>
                    ) : (
                        results.length > 0 && (
                            <ul className="results">
                                {results.map((u) => (
                                    <li
                                        key={u.id}
                                        onClick={() => {
                                            setSelected(u);
                                            setQuery("");
                                            setResults([]);
                                        }}
                                    >
                                        <Avatar avatar={u.avatar} pseudo={u.pseudo} type="user" />
                                        <span>{u.pseudo}</span>
                                    </li>
                                ))}
                            </ul>
                        )
                    )}

                </div>

                <div className="modal-actions">
                    <button className="cancel-btn" onClick={onClose}>
                        Annuler
                    </button>
                    <button
                        className="share-btn"
                        onClick={handleShare}
                        disabled={!query && !selected}
                    >
                        Partager
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
