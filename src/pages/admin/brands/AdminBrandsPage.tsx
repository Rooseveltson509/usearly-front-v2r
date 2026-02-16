import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@src/services/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminBrandsHeader from "./AdminBrandsHeader";
import "./AdminBrandsPage.scss";
import {
  deleteBrand,
  getBrands,
  getSectors,
  resetBrandPassword,
  toggleBrandStatus,
  type AdminBrand,
} from "@src/services/adminService";
import CreateBrandModal from "./CreateBrandModal";
import EditBrandModal from "./EditBrandModal";
import DataTable from "@src/components/dashboard/components/DataTable";
import DashboardPagination from "@src/components/dashboard/components/DashboardPagination";
import useDashboardData from "@src/components/dashboard/hooks/useDashboardData";
import useDashboardFilters from "@src/components/dashboard/hooks/useDashboardFilters";
import usePagination from "@src/components/dashboard/hooks/usePagination";
import {
  ADMIN_BRANDS_FILTER_CONFIG,
  ADMIN_BRANDS_FILTER_DEFAULTS,
  type AdminBrandsFiltersState,
  type FilterOption,
} from "@src/types/Filters";
import { createAdminBrandsColumns } from "@src/pages/admin/brands/config/table";
import { filterBrands } from "@src/utils/brandFilters";
import Toast from "@src/components/ommons/Toast";
import AdminAIFloatingAssistant from "../ai-brand-by-admin/AdminAIFloatingAssistant";

const PAGE_SIZE = 6;
const MAX_MEMBER = 10;

const ALLOWED_ROLES = ["admin", "super_admin"] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

const isAllowedRole = (role?: string): role is AllowedRole => {
  return ALLOWED_ROLES.includes(role as AllowedRole);
};

const AdminBrandsPage = () => {
  const { userProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<AdminBrand | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sectorOptions, setSectorOptions] = useState<FilterOption[]>([]);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<AdminBrand | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const { filters, setFilter, resetFilters } =
    useDashboardFilters<AdminBrandsFiltersState>(ADMIN_BRANDS_FILTER_DEFAULTS);

  const dynamicFilterConfig = useMemo(() => {
    return ADMIN_BRANDS_FILTER_CONFIG.map((filter) =>
      filter.key === "sectors" ? { ...filter, options: sectorOptions } : filter,
    );
  }, [sectorOptions]);

  useEffect(() => {
    console.log("Sectors from API:", sectorOptions);
  }, [sectorOptions]);

  // 🔐 Sécurité admin
  useEffect(() => {
    if (!isLoading && userProfile && !isAllowedRole(userProfile.role)) {
      navigate("/home");
    }
  }, [isLoading, userProfile, navigate]);

  const {
    data: brands,
    loading,
    reload: loadBrands,
  } = useDashboardData<AdminBrand[]>({
    initialData: [],
    fetcher: async () => ({ data: (await getBrands()) ?? [] }),
    deps: [userProfile],
    enabled: isAllowedRole(userProfile?.role),
  });

  const filteredBrands = useMemo(
    () => filterBrands(brands, search, filters),
    [brands, search, filters],
  );

  const { page, totalPages, pageItems, goPrev, goNext } = usePagination({
    items: filteredBrands,
    pageSize: PAGE_SIZE,
    resetDeps: [search, filters.plans, filters.sectors, filters.lastAction],
    overflowStrategy: "reset",
  });
  const requestDeleteBrand = (brand: AdminBrand) => {
    setBrandToDelete(brand);
  };

  const handleEditBrand = (brand: AdminBrand) => {
    setSelectedBrand(brand);
    setShowEditModal(true);
  };

  useEffect(() => {
    const loadSectors = async () => {
      try {
        const sectors = await getSectors();
        setSectorOptions(
          sectors.map((s) => ({
            label: s,
            value: s,
          })),
        );
      } catch {
        setSectorOptions([]);
      }
    };

    loadSectors();
  }, []);

  const handleDeleteBrand = async () => {
    if (!brandToDelete) return;

    setLoadingActionId(brandToDelete.id);

    try {
      await deleteBrand(brandToDelete.id);
      setToast({ message: "Marque supprimée", type: "success" });
      setBrandToDelete(null);
      loadBrands();
    } catch {
      setToast({
        message: "Erreur lors de la suppression",
        type: "error",
      });
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleBrandCreated = async () => {
    resetFilters();
    setSearch("");
    await loadBrands();
    setToast({ message: "Marque créée avec succès", type: "success" });
  };

  const handleToggleStatus = async (brand: AdminBrand) => {
    setLoadingActionId(brand.id);

    try {
      await toggleBrandStatus(brand.id);
      setToast({ message: "Statut mis à jour", type: "success" });
      loadBrands();
    } catch {
      setToast({
        message: "Erreur lors du changement de statut",
        type: "error",
      });
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleResetPassword = async (brand: AdminBrand) => {
    setLoadingActionId(brand.id);

    try {
      await resetBrandPassword(brand.id);
      setToast({ message: "Mot de passe réinitialisé", type: "success" });
    } catch {
      setToast({ message: "Erreur lors du reset", type: "error" });
    } finally {
      setLoadingActionId(null);
    }
  };
  const columns = useMemo(
    () =>
      createAdminBrandsColumns(
        {
          onNavigate: (brandId) => navigate(`/admin/${brandId}`),
          onEdit: handleEditBrand,
          onToggleStatus: handleToggleStatus,
          onResetPassword: handleResetPassword,
          onDelete: requestDeleteBrand, // ✅ ICI
          loadingActionId,
        },
        MAX_MEMBER,
      ),
    [navigate, loadingActionId],
  );

  if (isLoading || !userProfile || !isAllowedRole(userProfile.role)) {
    return null;
  }

  return (
    <div className="admin-brands-page">
      <AdminBrandsHeader
        search={search}
        onSearchChange={setSearch}
        onAddBrand={() => setShowModal(true)}
        brandsLength={brands.length}
        filters={filters}
        onFilterChange={setFilter}
        onClearFilters={resetFilters}
        filterConfig={dynamicFilterConfig}
      />

      <div className="brand-feed-table-container">
        {loading ? (
          <p className="loading">Chargement des marques…</p>
        ) : filteredBrands.length === 0 ? (
          <p className="empty">Aucune marque trouvée</p>
        ) : (
          <DataTable
            columns={columns}
            rows={pageItems}
            getRowKey={(brand) => brand.id}
            tableClassName="brand-feed-table"
            headClassName="brand-feed-table-head"
            headRowClassName="brand-feed-table-head-title"
            bodyClassName="brand-feed-table-body"
            rowClassName="brand-feed-table-body-line"
            emptyState={{
              message: "Aucun utilisateur",
              colSpan: 11,
              rowClassName:
                "brand-feed-table-body-line brand-feed-table-body-line--empty",
              cellClassName: "brand-feed-table-body-line-data",
              containerClassName: "brand-feed-table-body-line-data",
              messageClassName: "brand-feed-table-body-line-data-empty",
            }}
          />
        )}
      </div>
      {brandToDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Supprimer la marque</h3>
            <p>
              Voulez-vous vraiment supprimer{" "}
              <strong>{brandToDelete.name}</strong> ?
              <br />
              Cette action est irréversible.
            </p>

            <div className="modal-actions">
              <button onClick={() => setBrandToDelete(null)}>Annuler</button>
              <button className="danger" onClick={handleDeleteBrand}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateBrandModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleBrandCreated}
      />

      <CreateBrandModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={loadBrands}
        onCreated={() =>
          setToast({ message: "Marque créée avec succès", type: "success" })
        }
      />

      {showEditModal && selectedBrand && (
        <EditBrandModal
          open={showEditModal}
          brand={selectedBrand}
          onClose={() => {
            setShowEditModal(false);
            setSelectedBrand(null);
          }}
          onSuccess={() => {
            loadBrands();
            setShowEditModal(false);
            setSelectedBrand(null);
            setToast({ message: "Marque mise à jour", type: "success" });
          }}
        />
      )}

      <DashboardPagination
        page={page}
        totalPages={totalPages}
        onPrev={goPrev}
        onNext={goNext}
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <AdminAIFloatingAssistant />
    </div>
  );
};

export default AdminBrandsPage;
