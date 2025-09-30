import { useState, useRef, useEffect, useMemo } from "react";
import type { FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import { useFetchGroupedReports } from "@src/hooks/useFetchGroupedReports";
import { usePaginatedGroupedReportsByDate } from "@src/hooks/usePaginatedGroupedReportsByDate";
import { usePaginatedGroupedReportsByPopularEngagement } from "@src/hooks/usePaginatedGroupedReportsByPopularEngagement";
import { usePaginatedGroupedReportsByRage } from "@src/hooks/usePaginatedGroupedReportsByRage";
import { useConfirmedFlatData } from "@src/hooks/useConfirmedFlatData";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import ActiveFilterBadges from "./ActiveFilterBadges";
import FilterBar from "./FilterBar";
const FilterBarAny = (FilterBar as unknown) as React.ComponentType<any>;
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
  filter: any;
  setFilter: (val: FilterType) => void;
  viewMode: "flat" | "chrono" | "confirmed";
  setViewMode: (mode: "flat" | "chrono" | "confirmed") => void;
  setSelectedBrand: (val: string) => void;
  setSelectedCategory: (val: string) => void;
  setActiveFilter: (val: string) => void;
  onViewModeChange: (mode: "flat" | "chrono" | "confirmed") => void;
  isHotFilterAvailable: boolean;
  dropdownRef: React.RefObject<HTMLDivElement>;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (val: boolean) => void;
  selectedBrand: string;
  selectedCategory: string;
  availableBrands: string[];
  availableCategories: string[];
  searchTerm: string;
  onSearchTermChange: (val: string) => void;
  activeTab: FeedbackType;
  activeFilter: string;
  setSelectedSiteUrl: (val: string | undefined) => void;
}

type ReportDescription = {
  id?: string | number;
  title?: string;
  description?: string;
  text?: string;
  [key: string]: unknown;
};

type FilteredReport = {
  reportingId: string | number;
  marque: string;
  category: string;
  subCategory: string;
  descriptions?: ReportDescription[];
  capture?: string;
  siteUrl?: string;
};

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const getSearchableStrings = (report: FilteredReport) => {
  const values: string[] = [];

  if (report.subCategory) {
    values.push(report.subCategory);
  }

  if (report.category) {
    values.push(report.category);
  }

  if (Array.isArray(report.descriptions)) {
    report.descriptions.forEach((item) => {
      if (typeof item === "string") {
        values.push(item);
        return;
      }

      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        const description = record.description;
        if (typeof description === "string") {
          values.push(description);
        }
        const title = record.title;
        if (typeof title === "string") {
          values.push(title);
        }
        const text = record.text;
        if (typeof text === "string") {
          values.push(text);
        }
      }
    });
  }

  return values;
};

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
  const [filteredReports, setFilteredReports] = useState<FilteredReport[]>([]);
  const [loadingFiltered, setLoadingFiltered] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const isChronoView =
    viewMode === "chrono" && (filter === undefined || filter === "chrono");

  const { brands } = useBrands();
  const availableBrands = useMemo(
    () => brands.map((b) => b.marque),
    [brands]
  );

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

  useEffect(() => {
    setSearchTerm("");
  }, [selectedBrand]);

  const availableSubCategories = useMemo(() => {
    if (!selectedBrand) {
      return [] as string[];
    }

    const subCategories = filteredReports
      .filter((report) => report.marque === selectedBrand)
      .map((report) => report.subCategory)
      .filter((value): value is string => typeof value === "string" && value.trim().length > 0);

    const unique = Array.from(new Set(subCategories));

    return unique.sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" }));
  }, [filteredReports, selectedBrand]);

  const filteredByCategory = useMemo(() => {
    if (selectedCategory) {
      return filteredReports.filter(
        (report) => report.subCategory === selectedCategory
      );
    }
    return filteredReports;
  }, [filteredReports, selectedCategory]);

  const normalizedSearchTerm = useMemo(() => {
    const trimmed = searchTerm.trim();
    return trimmed ? normalizeText(trimmed) : "";
  }, [searchTerm]);

  const reportsToDisplay = useMemo(() => {
    if (!normalizedSearchTerm) {
      return filteredByCategory;
    }

    return filteredByCategory.filter((report) => {
      const searchableValues = getSearchableStrings(report);
      return searchableValues.some((value) =>
        normalizeText(value).includes(normalizedSearchTerm)
      );
    });
  }, [filteredByCategory, normalizedSearchTerm]);
  useEffect(() => {
    if (!selectedBrand && !selectedCategory) {
      setSelectedSiteUrl(undefined);
      return;
    }

    if (reportsToDisplay.length === 0) {
      setSelectedSiteUrl(undefined);
      return;
    }

    setSelectedSiteUrl(reportsToDisplay[0].siteUrl);
  }, [reportsToDisplay, selectedBrand, selectedCategory, setSelectedSiteUrl]);

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
        <FilterBarAny
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
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
        />
        

        <ActiveFilterBadges
          selectedBrand={selectedBrand}
          selectedCategory={selectedCategory}
          onClearBrand={() => setSelectedBrand("")}
          onClearCategory={() => setSelectedCategory("")}
        />

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
              reportsToDisplay.reduce((acc: Record<string, FilteredReport[]>, report) => {
                if (!acc[report.category]) acc[report.category] = [];
                acc[report.category].push(report);
                return acc;
              }, {})
            ).map(([category, reports]) => (
              <div key={category} className="category-block">
                {reports.map((report) => (
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
                ))}
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
            searchTerm={searchTerm}
            onClearSearchTerm={() => setSearchTerm("")}
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
            searchTerm={searchTerm}
            onClearSearchTerm={() => setSearchTerm("")}
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
