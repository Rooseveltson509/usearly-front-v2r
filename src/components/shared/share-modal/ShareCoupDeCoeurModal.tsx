import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { FaWhatsapp, FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import { apiService } from "@src/services/apiService";
import { showToast } from "@src/utils/toastUtils";
import "./ShareModal.scss"; // ✅ on réutilise le même style
import Avatar from "../Avatar";

interface Props {
  coupDeCoeurId: string;
  onClose: () => void;
}

const ShareCoupDeCoeurModal: React.FC<Props> = ({ coupDeCoeurId, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [, setLoading] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  // 🔎 Recherche d’utilisateurs
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await apiService.get(
          `/users/search?q=${encodeURIComponent(query)}`,
        );
        setResults(res.data.users || res.data || []);
      } catch (err) {
        console.error("❌ Erreur recherche utilisateur:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  // ✅ Partage interne (vers un autre utilisateur)
  const handleShareInternal = async () => {
    try {
      const payload = selected?.id
        ? { recipientId: selected.id }
        : { recipientEmail: query };

      const res = await apiService.post(
        `/share/coupdecoeur/${coupDeCoeurId}`,
        payload,
      );

      const sharedId = res.data.sharedId;
      const url = `${window.location.origin}/share/${sharedId}/public-cdc`;

      try {
        await navigator.clipboard.writeText(url);
        showToast(
          "💖 Coup de cœur partagé ! Lien copié dans le presse-papier",
          "success",
        );
      } catch {
        showToast(
          "💖 Coup de cœur partagé ! Mais impossible de copier le lien automatiquement",
          "warning",
        );
        console.log("👉 Lien à partager :", url);
      }

      onClose();
    } catch (err: any) {
      console.error("❌ Erreur partage interne (CDC):", err);
      showToast("❌ Impossible de partager le coup de cœur", "error");
    }
  };

  // ✅ Partage sur les réseaux sociaux
  const handleShareSocial = async (
    network: "whatsapp" | "facebook" | "linkedin" | "twitter",
  ) => {
    try {
      const res = await apiService.post(
        `/share/coupdecoeur/${coupDeCoeurId}/social`,
      );
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
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent("Découvrez ce coup de cœur 💖 sur Usearly !")}`;
      }

      window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
    } catch (err) {
      console.error("❌ Erreur partage social (CDC):", err);
      showToast("❌ Impossible de générer l’aperçu social", "error");
    }
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Partager le coup de cœur 💖</h3>
          <button className="close-btn" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Champ de recherche utilisateur */}
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Rechercher un utilisateur ou email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {selected ? (
            <div className="selected-user">
              <Avatar
                avatar={selected.avatar}
                pseudo={selected.pseudo}
                type="user"
              />
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

        {/* Section réseaux sociaux */}
        <div className="social-share">
          <p>Partager sur :</p>
          <div className="social-buttons">
            <button
              onClick={() => handleShareSocial("whatsapp")}
              className="whatsapp"
            >
              <FaWhatsapp size={18} /> WhatsApp
            </button>
            <button
              onClick={() => handleShareSocial("facebook")}
              className="facebook"
            >
              <FaFacebook size={18} /> Facebook
            </button>
            <button
              onClick={() => handleShareSocial("linkedin")}
              className="linkedin"
            >
              <FaLinkedin size={18} /> LinkedIn
            </button>
            <button
              onClick={() => handleShareSocial("twitter")}
              className="twitter"
            >
              <FaTwitter size={18} /> Twitter/X
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareCoupDeCoeurModal;
