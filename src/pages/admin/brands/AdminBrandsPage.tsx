import { useEffect, useState } from "react";
import { useAuth } from "@src/services/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminBrandsHeader from "./AdminBrandsHeader";
import "./AdminBrandsPage.scss";
import {
  getBrands,
  resetBrandPassword,
  toggleBrandStatus,
  type AdminBrand,
} from "@src/services/adminService";
import CreateBrandModal from "./CreateBrandModal";
import { useToast } from "../hooks/useHooks";
import Toast from "../toast/Toast";

const AdminBrandsPage = () => {
  const { userProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { toast, showToast } = useToast();

  // 🔐 Sécurité admin
  useEffect(() => {
    if (!isLoading && userProfile?.role !== "admin") {
      navigate("/home");
    }
  }, [isLoading, userProfile, navigate]);

  // 📋 Load brands
  const loadBrands = async () => {
    setLoading(true);
    try {
      const data = await getBrands();
      setBrands(data ?? []);
    } catch (err) {
      console.error("Erreur chargement marques", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile?.role === "admin") {
      loadBrands();
    }
  }, [userProfile]);

  if (isLoading || userProfile?.role !== "admin") return null;

  const filteredBrands = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()),
  );

  const confirmToggle = async (brandId: string) => {
    setLoadingActionId(brandId);

    // optimistic UI
    setBrands((prev) =>
      prev.map((b) => (b.id === brandId ? { ...b, isActive: !b.isActive } : b)),
    );

    try {
      await toggleBrandStatus(brandId);
      showToast("Statut mis à jour");
    } catch {
      showToast("Erreur lors du changement de statut", "error");
      loadBrands();
    } finally {
      setLoadingActionId(null);
    }
  };

  const confirmReset = async (brandId: string) => {
    setLoadingActionId(brandId);

    try {
      await resetBrandPassword(brandId);
      showToast("Mot de passe réinitialisé");
    } catch {
      showToast("Erreur lors du reset", "error");
    } finally {
      setLoadingActionId(null);
    }
  };

  return (
    <div className="admin-brands-page">
      <AdminBrandsHeader
        search={search}
        onSearchChange={setSearch}
        onAddBrand={() => setShowModal(true)}
      />

      <div className="admin-brands-card">
        {loading ? (
          <p className="loading">Chargement des marques…</p>
        ) : filteredBrands.length === 0 ? (
          <p className="empty">Aucune marque trouvée</p>
        ) : (
          <table className="brands-table">
            <thead>
              <tr>
                <th>Nom Marque </th>
                <th>Domaine</th>
                <th>Email</th>
                <th>Offre</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredBrands.map((brand) => (
                <tr key={brand.id}>
                  <td className="brand-name">
                    {brand.logo ? (
                      <img src={brand.logo} alt={brand.name} />
                    ) : (
                      <div className="brand-avatar">{brand.name[0]}</div>
                    )}
                    {brand.name}
                  </td>
                  <td>{brand.domain}</td>
                  <td>{brand.email}</td>
                  <td>{brand.offres}</td>
                  <td>
                    <span
                      className={`status ${
                        brand.isActive ? "active" : "inactive"
                      }`}
                    >
                      {brand.isActive ? "Active" : "Désactivée"}
                    </span>
                  </td>
                  <td className="actions">
                    {/* Toggle status */}
                    <button
                      disabled={loadingActionId === brand.id}
                      className={`btn-status ${brand.isActive ? "danger" : "success"} ${
                        loadingActionId === brand.id ? "loading" : ""
                      }`}
                      onClick={() => confirmToggle(brand.id)}
                    >
                      {loadingActionId === brand.id
                        ? "…"
                        : brand.isActive
                          ? "Désactiver"
                          : "Activer"}
                    </button>

                    {/* Reset password */}
                    <button
                      disabled={loadingActionId === brand.id}
                      className="btn-reset"
                      onClick={() => confirmReset(brand.id)}
                    >
                      Reset MDP
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <CreateBrandModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={loadBrands}
      />
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default AdminBrandsPage;
