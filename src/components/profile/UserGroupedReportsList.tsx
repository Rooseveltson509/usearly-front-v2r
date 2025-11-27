import "./UserGroupedReportsList.scss";
import { useState, useEffect, useRef, useMemo } from "react";
import ChronologicalReportList from "@src/components/report-grouped/ChronologicalReportList";
import ChronoReportCard from "@src/components/report-grouped/report-by-date/ChronoReportCard";
import { useUserProfileFilters } from "@src/hooks/useUserProfileFilters";
import { usePaginatedUserReportsGroupedByDate } from "@src/hooks/usePaginatedUserReportsGroupedByDate";
import ProfileFilters from "./ProfileFilters";
import type {
  UserGroupedReport,
  ExplodedGroupedReport,
} from "@src/types/Reports";
import UserBrandBlock from "../user-reports/UserBrandBlock";
import SqueletonAnime from "../loader/SqueletonAnime";
import { useInfiniteGroupedReports } from "@src/hooks/useInfiniteGroupedReports";
import { useBrandLogos } from "@src/hooks/useBrandLogos";
import Champs, { type SelectFilterOption } from "@src/components/champs/Champs";

type ViewMode = "brand" | "date";

const VIEW_MODE_OPTIONS: SelectFilterOption<ViewMode>[] = [
  { value: "brand", label: "Marques" },
  { value: "date", label: "Date" },
];

const UserGroupedReportsList: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("brand");
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const resetKey = `${viewMode}`;

  /* Scroll infini pour vue PAR MARQUE */
  const { reports, loading, error, hasMore, loadMore } =
    useInfiniteGroupedReports(10, resetKey);

  /* Filtres (par marque / catégorie) */
  const {
    selectedBrand,
    setSelectedBrand,
    selectedCategory,
    setSelectedCategory,
    availableBrands,
    availableCategories,
    filteredData,
  } = useUserProfileFilters(reports);

  /* Pagination pour la vue chrono */
  const {
    data: chronoData,
    loading: loadingChrono,
    hasMore: hasMoreChrono,
    loadMore: loadMoreChrono,
  } = usePaginatedUserReportsGroupedByDate(viewMode === "date");

  /* ────────────────────────────────────────────────────────────
   Enrichir les données chrono avec brandLogoUrl (version hook)
   ──────────────────────────────────────────────────────────── */

  // 🔹 Crée une liste unique de couples (brand, siteUrl)
  const chronoEntries = useMemo(() => {
    if (!chronoData) return [];
    const entries: { brand: string; siteUrl?: string }[] = [];
    for (const items of Object.values(chronoData)) {
      for (const item of items) {
        if (item.marque) {
          entries.push({
            brand: item.marque,
            siteUrl: item.siteUrl || undefined,
          });
        }
      }
    }
    return entries;
  }, [chronoData]);

  // 🔹 Charge tous les logos nécessaires d’un coup
  const logos = useBrandLogos(chronoEntries);

  // 🔹 Génère les données enrichies instantanément
  const enrichedChronoData = useMemo(() => {
    if (!chronoData) return {};

    const result: Record<
      string,
      (ExplodedGroupedReport & { brandLogoUrl?: string })[]
    > = {};

    for (const [day, items] of Object.entries(chronoData)) {
      result[day] = items.map((item) => ({
        ...item,
        brandLogoUrl: logos[item.marque] ?? undefined,
      }));
    }

    return result;
  }, [chronoData, logos]);

  /* INFINITE SCROLL (vue par MARQUE) */
  useEffect(() => {
    if (!loaderRef.current || viewMode !== "brand") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore, viewMode]);

  /* INFINITE SCROLL (vue par DATE) */
  useEffect(() => {
    if (!loaderRef.current || viewMode !== "date") return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMoreChrono && !loadingChrono) {
        loadMoreChrono();
      }
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMoreChrono, loadingChrono, loadMoreChrono, viewMode]);

  const handleDisplayChange = (mode: ViewMode) => {
    setViewMode(mode);
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
          </div>
        )}

        {/* === DROPDOWN CUSTOM "TRIER PAR" === */}
        <div className="view-mode-select">
          <Champs
            options={VIEW_MODE_OPTIONS}
            value={viewMode}
            onChange={handleDisplayChange}
            className="view-mode-select__control"
            iconVisible={false}
            minWidth={150}
            minWidthPart="2"
            align="left"
          />
        </div>
      </div>

      {/* === RENDU PAR MARQUE === */}
      {viewMode === "brand" &&
        (!loading && filteredData.length === 0 ? (
          <p className="no-reports">
            Aucun signalement trouvé pour ces filtres...
          </p>
        ) : (
          Object.entries(
            filteredData.reduce(
              (acc, curr) => {
                if (!acc[curr.marque]) acc[curr.marque] = [];
                acc[curr.marque].push(curr);
                return acc;
              },
              {} as Record<string, UserGroupedReport[]>,
            ),
          ).map(([brand, reports]) => (
            <UserBrandBlock
              key={brand}
              brand={brand}
              reports={reports}
              /* userProfile={userProfile} */
              isOpen={expandedBrand === brand}
              siteUrl={reports[0]?.siteUrl || ""}
              onToggle={() =>
                setExpandedBrand(expandedBrand === brand ? null : brand)
              }
            />
          ))
        ))}

      {/* === RENDU PAR DATE === */}
      {viewMode === "date" && enrichedChronoData && (
        <ChronologicalReportList
          groupedByDay={enrichedChronoData}
          renderCard={(item) => {
            const id =
              item.subCategory.descriptions[0]?.id ||
              `${item.marque}-${item.subCategory.subCategory}`;
            return (
              <ChronoReportCard
                key={id}
                item={item}
                isOpen={activeCardId === id}
                onToggle={() =>
                  setActiveCardId((prev) => (prev === id ? null : id))
                }
              />
            );
          }}
        />
      )}

      {/* === LOADER / SQUELETON === */}
      <SqueletonAnime
        loaderRef={loaderRef}
        loading={viewMode === "brand" ? loading : loadingChrono}
        hasMore={viewMode === "brand" ? hasMore : hasMoreChrono}
        error={error}
      />
    </div>
  );
};

export default UserGroupedReportsList;
