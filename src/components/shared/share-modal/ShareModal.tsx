import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { FaWhatsapp, FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
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
        const res = await apiService.get(
          `/users/search?q=${encodeURIComponent(query)}`
        );
        setResults(res.data.users || res.data || []);
      } catch (err) {
        console.error("❌ Erreur recherche user:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  // ✅ Partage interne
  const handleShareInternal = async () => {
    try {
      const payload = selected?.id
        ? { recipientId: selected.id }
        : { recipientEmail: query };

      const res = await apiService.post(
        `/share/suggestion/${suggestionId}`,
        payload
      );

      const sharedId = res.data.sharedId;
      const url = `${window.location.origin}/share/${sharedId}/public`;

      try {
        await navigator.clipboard.writeText(url);
        showToast("✅ Suggestion partagée ! Lien copié dans le presse-papier", "success");
      } catch {
        showToast("✅ Suggestion partagée ! Mais impossible de copier le lien automatiquement", "warning");
        console.log("👉 Lien à partager :", url);
      }

      onClose();
    } catch (err: any) {
      console.error("❌ Erreur partage interne:", err);
      showToast("❌ Impossible de partager la suggestion", "error");
    }
  };

  // ✅ Partage social
  const handleShareSocial = async (network: "whatsapp" | "facebook" | "linkedin" | "twitter") => {
    try {
      // Appel backend qui génère l'image + renvoie publicUrl
      const res = await apiService.post(`/share/suggestion/${suggestionId}/social`);
      const { publicUrl } = res.data;

      let url = "";
      if (network === "whatsapp") {
        url = `https://wa.me/?text=${encodeURIComponent(publicUrl)}`;
      }
      if (network === "facebook") {
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`;
      }
      if (network === "linkedin") {
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`;
      }
      if (network === "twitter") {
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent("Découvrez cette suggestion 🚀")}`;
      }

      window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
    } catch (err) {
      console.error("❌ Erreur partage social:", err);
      showToast("❌ Impossible de générer l’aperçu social", "error");
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

        {/* Champ recherche user interne */}
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Rechercher un utilisateur"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

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

        {/* Actions principales */}
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Annuler
          </button>
          <button
            className="share-btn"
            onClick={handleShareInternal}
            disabled={!query && !selected}
          >
            Partager
          </button>
        </div>

        {/* Section Réseaux sociaux */}
        <div className="social-share">
          <p>Partager sur :</p>
          <div className="social-buttons">
            <button onClick={() => handleShareSocial("whatsapp")} className="whatsapp">
              <FaWhatsapp size={18} /> WhatsApp
            </button>
            <button onClick={() => handleShareSocial("facebook")} className="facebook">
              <FaFacebook size={18} /> Facebook
            </button>
            <button onClick={() => handleShareSocial("linkedin")} className="linkedin">
              <FaLinkedin size={18} /> LinkedIn
            </button>
            <button onClick={() => handleShareSocial("twitter")} className="twitter">
              <FaTwitter size={18} /> Twitter/X
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
