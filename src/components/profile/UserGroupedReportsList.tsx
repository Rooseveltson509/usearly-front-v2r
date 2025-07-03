import "./UserGroupedReportsList.scss";
import { useAuth } from "@src/services/AuthContext";
import { useState, useEffect, useRef } from "react";
import ChronologicalReportList from "@src/components/report-grouped/ChronologicalReportList";
import ChronoReportCard from "@src/components/report-grouped/report-by-date/ChronoReportCard";
import { useUserProfileFilters } from "@src/hooks/useUserProfileFilters";
import { usePaginatedUserReportsGroupedByDate } from "@src/hooks/usePaginatedUserReportsGroupedByDate";
import { getUserProfileGroupedReports } from "@src/services/feedbackService";
import ProfileFilters from "./ProfileFilters";
import type {
  UserGroupedReport,
  ExplodedGroupedReport,
} from "@src/types/Reports";
import UserBrandBlock from "../user-reports/UserBrandBlock";
import SqueletonAnime from "../loader/SqueletonAnime";
import { ArrowDownWideNarrow, ChevronDown, ListRestart } from "lucide-react";

type ViewMode = "brand" | "date";

const UserGroupedReportsList: React.FC = () => {
  const { userProfile } = useAuth();

  /* ────────────────────────────────────────────────────────────
     ÉTATS
     ──────────────────────────────────────────────────────────── */
  const [data, setData] = useState<UserGroupedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("brand");
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);

  /* Nouveaux états pour le dropdown custom */
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  /* Filtres (par marque / catégorie) */
  const {
    selectedBrand,
    setSelectedBrand,
    selectedCategory,
    setSelectedCategory,
    availableBrands,
    availableCategories,
    filteredData,
  } = useUserProfileFilters(data);

  /* Pagination pour la vue chrono */
  const {
    data: chronoData,
    loading: loadingChrono,
    hasMore,
    loadMore,
  } = usePaginatedUserReportsGroupedByDate(viewMode === "date");

  /* ────────────────────────────────────────────────────────────
     RÉCUPÉRATION DES DONNÉES (vue par MARQUE)
     ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (viewMode === "brand") {
      const fetchReports = async () => {
        try {
          setLoading(true);
          const res = await getUserProfileGroupedReports(1, 10);
          setData(res.results);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchReports();
    }
  }, [viewMode]);

  /* ────────────────────────────────────────────────────────────
     INFINITE SCROLL (vue par DATE)
     ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!loaderRef.current || viewMode !== "date") return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingChrono) {
        loadMore();
      }
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingChrono, loadMore, viewMode]);

  /* ────────────────────────────────────────────────────────────
     FERMETURE DU DROPDOWN AU CLIC EXTÉRIEUR
     ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Change de mode d’affichage (brand / date) */
  const handleDisplayChange = (mode: ViewMode) => {
    setViewMode(mode);
    setShowDropdown(false);
  };

  return (
    <div className="user-grouped-reports-list">
      <div className="controls">
        {/* === VUE PAR MARQUE : filtres === */}
        {viewMode === "brand" && (
          <div className="profile-filters-container">
            <ProfileFilters
              availableBrands={availableBrands}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              availableCategories={availableCategories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            {(selectedBrand !== "Tous" || selectedCategory !== "Tous") && (
              <div className="reset-filters-container">
                <button
                  onClick={() => {
                    setSelectedBrand("Tous");
                    setSelectedCategory("Tous");
                  }}
                  className="reset-filters-button"
                >
                  <ListRestart size={20} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* === DROPDOWN CUSTOM "TRIER PAR" === */}
        <div className="sort-dropdown" ref={dropdownRef}>
          <button
            className="dropdown-toggle"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <ArrowDownWideNarrow size={18} />
            <span>Trier par : </span>
            <strong>{viewMode === "brand" ? "Marques" : "Date"}</strong>
            <ChevronDown size={16} />
          </button>

          {showDropdown && (
            <div className="dropdown-menu">
              <button
                className={viewMode === "brand" ? "active" : ""}
                onClick={() => handleDisplayChange("brand")}
              >
                Marques
              </button>
              <button
                className={viewMode === "date" ? "active" : ""}
                onClick={() => handleDisplayChange("date")}
              >
                Date
              </button>
            </div>
          )}
        </div>
      </div>

      {/* === RENDU PAR MARQUE === */}
      {!loading &&
        viewMode === "brand" &&
        (filteredData.length === 0 ? (
          <p className="no-reports">
            Aucun signalement trouvé pour ces filtres.
          </p>
        ) : (
          Object.entries(
            filteredData.reduce((acc, curr) => {
              if (!acc[curr.marque]) acc[curr.marque] = [];
              acc[curr.marque].push(curr);
              return acc;
            }, {} as Record<string, UserGroupedReport[]>)
          ).map(([brand, reports]) => (
            <UserBrandBlock
              key={brand}
              brand={brand}
              reports={reports}
              userProfile={userProfile}
              isOpen={expandedBrand === brand}
              siteUrl={reports[0]?.siteUrl || ""}
              onToggle={() =>
                setExpandedBrand(expandedBrand === brand ? null : brand)
              }
            />
          ))
        ))}

      {/* === RENDU PAR DATE === */}
      {viewMode === "date" && chronoData && (
        <ChronologicalReportList
          groupedByDay={chronoData as Record<string, ExplodedGroupedReport[]>}
          renderCard={(item) => (
            <ChronoReportCard
              key={
                item.subCategory.descriptions[0]?.id ||
                `${item.marque}-${item.subCategory.subCategory}`
              }
              item={item}
            />
          )}
        />
      )}

      {/* === LOADER / SQUELETON === */}
      <SqueletonAnime
        loaderRef={loaderRef}
        loading={viewMode === "brand" ? loading : loadingChrono}
        hasMore={viewMode === "brand" ? false : hasMore}
        error={null}
      />
    </div>
  );
};

export default UserGroupedReportsList;
