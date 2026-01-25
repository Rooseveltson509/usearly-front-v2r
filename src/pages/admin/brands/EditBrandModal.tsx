import { useEffect, useState } from "react";
import { updateBrand } from "@src/services/adminService";
import { useToast } from "../hooks/useHooks";
import type { AdminBrand } from "@src/services/adminService";
import "./EditBrandModal.scss";

type Props = {
  open: boolean;
  brand: AdminBrand | null;
  onClose: () => void;
  onSuccess: () => void;
};

const EditBrandModal = ({ open, brand, onClose, onSuccess }: Props) => {
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [offres, setOffres] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const hasChanges =
    !!brand &&
    (domain !== brand.domain ||
      email !== brand.email ||
      offres !== brand.offres);

  useEffect(() => {
    if (brand) {
      setDomain(brand.domain);
      setEmail(brand.email);
      setOffres(brand.offres);
    }
  }, [brand]);

  if (!open || !brand) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateBrand(brand.id, {
        domain,
        email,
        offres,
      });

      showToast(
        email !== brand.email
          ? "Modification enregistrée. Email en attente de confirmation."
          : "Marque mise à jour",
      );

      onSuccess();
      onClose();
    } catch (e: any) {
      showToast(
        e?.response?.data?.message || "Erreur lors de la mise à jour",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Modifier la marque</h2>

        <div className="field">
          <label>Domaine</label>
          <input value={domain} onChange={(e) => setDomain(e.target.value)} />
        </div>

        <div className="field">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
          {email !== brand.email && (
            <p className="hint">
              ⚠️ Un email de confirmation sera envoyé à la nouvelle adresse.
            </p>
          )}
        </div>

        <div className="field">
          <label>Offre</label>
          <select value={offres} onChange={(e) => setOffres(e.target.value)}>
            <option value="freemium">Freemium</option>
            <option value="start">Start</option>
            <option value="start pro">Start Pro</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <div className="actions">
          <button onClick={onClose}>Annuler</button>
          <button onClick={handleSubmit} disabled={loading || !hasChanges}>
            {loading ? "…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBrandModal;
