import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@src/services/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminBrandsHeader from "./AdminBrandsHeader";
import "./AdminBrandsPage.scss";
import { getBrands, type AdminBrand } from "@src/services/adminService";
import CreateBrandModal from "./CreateBrandModal";
import EditBrandModal from "./EditBrandModal";
import DataTable from "@src/components/dashboard/components/DataTable";
import DashboardPagination from "@src/components/dashboard/components/DashboardPagination";
import useDashboardData from "@src/components/dashboard/hooks/useDashboardData";
import useDashboardFilters from "@src/components/dashboard/hooks/useDashboardFilters";
import usePagination from "@src/components/dashboard/hooks/usePagination";
import {
  ADMIN_BRANDS_FILTER_DEFAULTS,
  type AdminBrandsFiltersState,
} from "@src/types/Filters";
import { createAdminBrandsColumns } from "@src/pages/admin/brands/config/table";
import { filterBrands } from "@src/utils/brandFilters";

const PAGE_SIZE = 6;
const MAX_MEMBER = 10;

function isAllowedRole(role: string | undefined) {
  const ALLOWED_ROLES = ["admin"];
  return typeof role === "string" && ALLOWED_ROLES.includes(role);
}

const AdminBrandsPage = () => {
  const { userProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedBrand] = useState<AdminBrand | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const { filters, setFilter, resetFilters } =
    useDashboardFilters<AdminBrandsFiltersState>(ADMIN_BRANDS_FILTER_DEFAULTS);

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
    enabled: userProfile?.role === "admin",
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

  const columns = useMemo(
    () =>
      createAdminBrandsColumns(
        (brandId) => navigate(`/admin/${brandId}`),
        MAX_MEMBER,
      ),
    [navigate],
  );

  if (isLoading || userProfile?.role !== "admin") return null;

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
      <CreateBrandModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={loadBrands}
      />

      <EditBrandModal
        open={showEditModal}
        brand={selectedBrand}
        onClose={() => setShowEditModal(false)}
        onSuccess={loadBrands}
      />
      <DashboardPagination
        page={page}
        totalPages={totalPages}
        onPrev={goPrev}
        onNext={goNext}
      />
    </div>
  );
};

export default AdminBrandsPage;
