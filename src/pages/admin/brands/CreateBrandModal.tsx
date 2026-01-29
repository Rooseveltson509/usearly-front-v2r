import { useState } from "react";
import { createBrand } from "@src/services/adminService";
import "./CreateBrandModal.scss";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onCreated?: () => void;
}

const CreateBrandModal = ({ open, onClose, onSuccess, onCreated }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [domain, setDomain] = useState("");
  const [offres, setOffres] = useState<
    "freemium" | "start" | "start pro" | "premium"
  >("freemium");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createBrand({ name, email, domain, offres });
      onSuccess();
      onCreated?.();
      onClose();
      setName("");
      setDomain("");
      setEmail("");
      setOffres("freemium");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Erreur lors de la création de la marque",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Créer une marque</h2>

        <form onSubmit={handleSubmit}>
          <label>Nom de la marque</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Domaine</label>
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
          />

          <label>Offre</label>
          <select
            value={offres}
            onChange={(e) => setOffres(e.target.value as any)}
          >
            <option value="freemium">Freemium</option>
            <option value="start">Start</option>
            <option value="start pro">Start Pro</option>
            <option value="premium">Premium</option>
          </select>

          {error && <p className="error">{error}</p>}

          <div className="actions">
            <button type="button" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Création…" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBrandModal;
