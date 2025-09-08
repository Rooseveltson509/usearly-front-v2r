import { useState, useRef, useEffect } from "react";
import type { FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import { useFetchGroupedReports } from "@src/hooks/useFetchGroupedReports";
import { usePaginatedGroupedReportsByDate } from "@src/hooks/usePaginatedGroupedReportsByDate";
import { usePaginatedGroupedReportsByPopularEngagement } from "@src/hooks/usePaginatedGroupedReportsByPopularEngagement";
import { usePaginatedGroupedReportsByRage } from "@src/hooks/usePaginatedGroupedReportsByRage";
import { useConfirmedFlatData } from "@src/hooks/useConfirmedFlatData";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import ActiveFilterBadges from "./ActiveFilterBadges";
import FilterBar from "./FilterBar";
import ConfirmedReportsList from "./confirm-reportlist/ConfirmReportsList";
import type { FilterType } from "@src/types/Filters";
import "./HomeGroupedReportsList.scss";
import RageReportsList from "./rage/RageReportsList";
import PopularReportList from "./popular/PopularReportList";
import FlatSubcategoryBlock from "./confirm-reportlist/FlatSubcategoryBlock";
import { getBrandLogo } from "@src/utils/brandLogos";
import { useBrands } from "@src/hooks/useBrands";
import { apiService } from "@src/services/apiService";

interface Props {
  activeTab: FeedbackType;
  activeFilter: string;
  onViewModeChange: (mode: "flat" | "chrono" | "confirmed") => void;
  setActiveFilter: (val: string) => void;
  viewMode: "flat" | "chrono" | "confirmed";
  renderHighlight?: (card: React.ReactNode) => React.ReactNode;

  selectedBrand: string;
  setSelectedBrand: (val: string) => void;
  setSelectedSiteUrl: (val: string | undefined) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
}

const HomeGroupedReportsList = ({
  activeTab,
  activeFilter,
  onViewModeChange,
  setActiveFilter,
  viewMode,
  selectedBrand,
  setSelectedBrand,
  setSelectedSiteUrl,
  selectedCategory,
  setSelectedCategory,
}: Props) => {
  const [filter, setFilter] = useState<FilterType>("");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [loadingFiltered, setLoadingFiltered] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const isChronoView =
    viewMode === "chrono" && (filter === undefined || filter === "chrono");

  const { brands } = useBrands();
  const availableBrands = brands.map((b) => b.marque);

  // === HOOKS data ===
  const { data: flatData, loading: loadingFlat, hasMore: hasMoreFlat } =
    useFetchGroupedReports(activeTab);

  const {
    data: chronoData,
    loading: loadingChrono,
    hasMore: hasMoreChrono,
  } = usePaginatedGroupedReportsByDate(isChronoView);

  const {
    data: popularEngagementData,
    loading: loadingPopularEngagement,
    hasMore: hasMorePopularEngagement,
  } = usePaginatedGroupedReportsByPopularEngagement(filter === "popular");

  const {
    data: rageData,
    loading: loadingRage,
    hasMore: hasMoreRage,
  } = usePaginatedGroupedReportsByRage(filter === "rage");

  const { data: confirmedData, loading: loadingConfirmed } =
    useConfirmedFlatData();

  // === auto sélection du filtre par défaut ===
  useEffect(() => {
    if (!initializing) return;

    // on attend que tous les chargements initiaux soient finis
    if (loadingConfirmed || loadingRage || loadingPopularEngagement || loadingChrono) return;

    if (confirmedData && confirmedData.length > 0) {
      setFilter("confirmed");
      setActiveFilter("confirmed");
    } else if (rageData && Object.keys(rageData || {}).length > 0) {
      setFilter("rage");
      setActiveFilter("rage");
    } else if (popularEngagementData && Object.keys(popularEngagementData || {}).length > 0) {
      setFilter("popular");
      setActiveFilter("popular");
    } else if (chronoData && Object.keys(chronoData || {}).length > 0) {
      setFilter("chrono");
      setActiveFilter("chrono");
    } else {
      setFilter("");
      setActiveFilter("");
    }

    setInitializing(false); // ✅ stoppe l’état initial
  }, [
    initializing,
    loadingConfirmed,
    loadingRage,
    loadingPopularEngagement,
    loadingChrono,
    confirmedData,
    rageData,
    popularEngagementData,
    chronoData,
    setActiveFilter,
  ]);

  // === fetch reports filtrés ===
  useEffect(() => {
    const fetchFilteredReports = async () => {
      if (!selectedBrand) {
        setFilteredReports([]);
        return;
      }
      try {
        setLoadingFiltered(true);
        const { data } = await apiService.get("/reports", {
          params: { brand: selectedBrand, page: 1, limit: 20 },
        });
        setFilteredReports(data.data);
      } catch (err) {
        console.error("Erreur fetch reports filtrés:", err);
        setFilteredReports([]);
      } finally {
        setLoadingFiltered(false);
      }
    };

    fetchFilteredReports();
  }, [selectedBrand]);

  const availableSubCategories = selectedBrand
    ? [
        ...new Set(
          filteredReports
            .filter((r) => r.marque === selectedBrand)
            .map((r) => r.subCategory)
            .filter(Boolean)
        ),
      ]
    : [];

  const reportsToDisplay = selectedCategory
    ? filteredReports.filter((r) => r.subCategory === selectedCategory)
    : filteredReports;

  // === rendu initial (skeleton si initializing) ===
  if (initializing) {
    return (
      <div className="home-grouped-reports-list">
        <SqueletonAnime loaderRef={loaderRef} loading={true} hasMore={false} error={null} />
      </div>
    );
  }

  // === rendu ===
  return (
    <div className="home-grouped-reports-list">
      <div className="controls">
        <FilterBar
          filter={filter || ""}
          setFilter={setFilter}
          viewMode={viewMode}
          setViewMode={onViewModeChange}
          setSelectedBrand={setSelectedBrand}
          setSelectedCategory={setSelectedCategory}
          setActiveFilter={setActiveFilter}
          onViewModeChange={onViewModeChange}
          isHotFilterAvailable={true}
          dropdownRef={dropdownRef}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          selectedBrand={selectedBrand}
          selectedCategory={selectedCategory}
          availableBrands={availableBrands}
          availableCategories={availableSubCategories}
          labelOverride={
            viewMode === "confirmed"
              ? "✅ Confirmés"
              : isChronoView
              ? "🏷️ Les plus récents"
              : undefined
          }
        />

        <ActiveFilterBadges
          selectedBrand={selectedBrand}
          selectedCategory={selectedCategory}
          onClearBrand={() => setSelectedBrand("")}
          onClearCategory={() => setSelectedCategory("")}
        />
      </div>

      {/* === données filtrées === */}
      {selectedBrand || selectedCategory ? (
        <div className="grouped-by-category">
          {loadingFiltered ? (
            <SqueletonAnime loaderRef={loaderRef} loading={true} hasMore={false} error={null} />
          ) : reportsToDisplay.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
              Aucun signalement trouvé pour ces filtres...
            </div>
          ) : (
            Object.entries(
              reportsToDisplay.reduce((acc: Record<string, any[]>, report) => {
                if (!acc[report.category]) acc[report.category] = [];
                acc[report.category].push(report);
                return acc;
              }, {})
            ).map(([category, reports]) => (
              <div key={category} className="category-block">
                {reports.map((report, idx) => {
                  if (idx === 0) {
                    setSelectedSiteUrl(report.siteUrl);
                  }
                  return (
                    <FlatSubcategoryBlock
                      key={`${report.reportingId}-${report.subCategory}`}
                      brand={report.marque}
                      siteUrl={report.siteUrl}
                      subcategory={report.subCategory}
                      descriptions={report.descriptions || []}
                      brandLogoUrl={getBrandLogo(report.marque, report.siteUrl)}
                      capture={report.capture}
                      hideFooter={true}
                    />
                  );
                })}
              </div>
            ))
          )}
        </div>
      ) : filter === "confirmed" ? (
        loadingConfirmed ? (
          <SqueletonAnime loaderRef={loaderRef} loading={true} hasMore={false} error={null} />
        ) : confirmedData.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
            Aucun signalement confirmé pour le moment.
          </div>
        ) : (
          <ConfirmedReportsList
            expandedItems={expandedItems}
            handleToggle={(key) =>
              setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }))
            }
          />
        )
      ) : filter === "rage" ? (
        loadingRage ? (
          <SqueletonAnime loaderRef={loaderRef} loading={true} hasMore={false} error={null} />
        ) : rageData && Object.keys(rageData).length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
            Aucun signalement rageux trouvé.
          </div>
        ) : (
          <RageReportsList
            expandedItems={expandedItems}
            handleToggle={(key) =>
              setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }))
            }
          />
        )
      ) : filter === "popular" ? (
        loadingPopularEngagement ? (
          <SqueletonAnime loaderRef={loaderRef} loading={true} hasMore={false} error={null} />
        ) : popularEngagementData && Object.keys(popularEngagementData).length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
            Aucun signalement populaire pour le moment.
          </div>
        ) : (
          <PopularReportList
            data={popularEngagementData}
            expandedItems={expandedItems}
            handleToggle={(key) =>
              setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }))
            }
            loading={loadingPopularEngagement}
          />
        )
      ) : filter === "chrono" ? (
        loadingChrono ? (
          <SqueletonAnime loaderRef={loaderRef} loading={true} hasMore={false} error={null} />
        ) : chronoData && Object.keys(chronoData).length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
            Aucun signalement récent disponible.
          </div>
        ) : (
          <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
            Vue chronologique en cours...
          </div>
        )
      ) : (
        <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
          Aucun signalement à afficher pour ce filtre.
        </div>
      )}

      {/* === skeleton scroll === */}
      {viewMode !== "confirmed" && (
        <SqueletonAnime
          loaderRef={loaderRef}
          loading={
            (filter === "chrono" && loadingChrono) ||
            (filter === "popular" && loadingPopularEngagement) ||
            (!filter && loadingFlat)
          }
          hasMore={
            (filter === "chrono" && hasMoreChrono) ||
            (filter === "popular" && hasMorePopularEngagement) ||
            (!filter && hasMoreFlat) ||
            false
          }
          error={null}
        />
      )}
    </div>
  );
};

export default HomeGroupedReportsList;
