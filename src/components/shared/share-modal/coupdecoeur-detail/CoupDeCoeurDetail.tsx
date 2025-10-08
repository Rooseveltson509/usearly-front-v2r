import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { CoupDeCoeur } from "@src/types/Reports";
import "./CoupDeCoeurDetail.scss";
import { getCoupDeCoeurById } from "@src/services/coupDeCoeurService";
import InteractiveFeedbackCard from "@src/components/user-profile/InteractiveFeedbackCard";

const CoupDeCoeurDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [coupDeCoeur, setCoupDeCoeur] = useState<CoupDeCoeur | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Coup de cœur - Usearly 💖";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const data = await getCoupDeCoeurById(id);
        setCoupDeCoeur(data);
      } catch (err) {
        console.error("❌ Erreur fetchCoupDeCoeurById:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (!coupDeCoeur) return <p>Coup de cœur introuvable 💔</p>;

  return (
    <div className="coupdecoeur-detail-page">
      <h2 className="page-title">Détail du coup de cœur</h2>
      <div className="coupdecoeur-card-wrapper">
        <InteractiveFeedbackCard
          key={coupDeCoeur.id}
          item={{ ...coupDeCoeur, type: "coupdecoeur" }}
          isOpen={true}
          onToggle={() => {}}
        />
      </div>
    </div>
  );
};

export default CoupDeCoeurDetail;
