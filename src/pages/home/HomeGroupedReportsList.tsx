import { useState, useRef, useEffect, useMemo } from "react";
import type { FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import { useFetchGroupedReports } from "@src/hooks/useFetchGroupedReports";
import { usePaginatedGroupedReportsByDate } from "@src/hooks/usePaginatedGroupedReportsByDate";
import { usePaginatedGroupedReportsByPopularEngagement } from "@src/hooks/usePaginatedGroupedReportsByPopularEngagement";
import { usePaginatedGroupedReportsByRage } from "@src/hooks/usePaginatedGroupedReportsByRage";
import { useConfirmedFlatData } from "@src/hooks/useConfirmedFlatData";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import FilterBar from "./FilterBar";
const FilterBarAny = FilterBar as unknown as React.ComponentType<any>;
import ConfirmedReportsList from "./confirm-reportlist/ConfirmReportsList";
import type { FilterType } from "@src/types/Filters";
import "./HomeGroupedReportsList.scss";
import RageReportsList from "./rage/RageReportsList";
import PopularReportList from "./popular/PopularReportList";
import FlatSubcategoryBlock from "./confirm-reportlist/FlatSubcategoryBlock";
import { getBrandLogo } from "@src/utils/brandLogos";
import { useBrands } from "@src/hooks/useBrands";
import { apiService } from "@src/services/apiService";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";

type ViewMode = "flat" | "chrono" | "confirmed";

interface Props {
  activeTab: FeedbackType;

  // Gestion du filtre actif
  activeFilter: string;
  setActiveFilter: (val: string) => void;

  // Gestion du mode d’affichage
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;

  // Sélections
  selectedBrand: string;
  setSelectedBrand: (val: string) => void;

  selectedCategory: string;
  setSelectedCategory: (val: string) => void;

  setSelectedSiteUrl: (val: string | undefined) => void;
  totalityCount: number;
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

// ---------------- Utils ----------------
const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const getSearchableStrings = (report: FilteredReport) => {
  const values: string[] = [];
  if (report.subCategory) values.push(report.subCategory);
  if (report.category) values.push(report.category);

  if (Array.isArray(report.descriptions)) {
    report.descriptions.forEach((item) => {
      if (typeof item === "string") {
        values.push(item);
      } else if (item && typeof item === "object") {
        const description = (item as any).description;
        if (typeof description === "string") values.push(description);
        const title = (item as any).title;
        if (typeof title === "string") values.push(title);
        const text = (item as any).text;
        if (typeof text === "string") values.push(text);
      }
    });
  }

  return values;
};

// ---------------- Component ----------------
const HomeGroupedReportsList = ({
  activeTab,
  onViewModeChange,
  setActiveFilter,
  viewMode,
  selectedBrand,
  setSelectedBrand,
  setSelectedSiteUrl,
  selectedCategory,
  setSelectedCategory,
  totalityCount,
}: Props) => {
  const [filter, setFilter] = useState<FilterType>("");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredReports, setFilteredReports] = useState<FilteredReport[]>([]);
  const [loadingFiltered, setLoadingFiltered] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(totalityCount);

  const isChronoView =
    viewMode === "chrono" && (filter === undefined || filter === "chrono");

  const { brands } = useBrands();
  const availableBrands = useMemo(() => brands.map((b) => b.marque), [brands]);

  // ---------------- Data hooks (toujours appelés) ----------------
  const flatData = useFetchGroupedReports(activeTab);
  const chronoData = usePaginatedGroupedReportsByDate(isChronoView);
  const popularEngagementData = usePaginatedGroupedReportsByPopularEngagement(
    filter === "popular",
  );
  const rageData = usePaginatedGroupedReportsByRage(filter === "rage");
  const confirmedData = useConfirmedFlatData();

  // ---------------- Initial filter selection ----------------
  useEffect(() => {
    if (!initializing) return;

    if (
      confirmedData.loading ||
      rageData.loading ||
      popularEngagementData.loading ||
      chronoData.loading
    )
      return;

    if ((confirmedData.data ?? []).length > 0) {
      setFilter("confirmed");
      setActiveFilter("confirmed");
    } else if (rageData.data && Object.keys(rageData.data).length > 0) {
      setFilter("rage");
      setActiveFilter("rage");
    } else if (
      popularEngagementData.data &&
      (popularEngagementData.data ?? []).length > 0
    ) {
      setFilter("popular");
      setActiveFilter("popular");
    } else if (chronoData.data && Object.keys(chronoData.data).length > 0) {
      setFilter("chrono");
      setActiveFilter("chrono");
    } else {
      setFilter("");
      setActiveFilter("");
    }

    setInitializing(false);
  }, [
    initializing,
    confirmedData.loading,
    rageData.loading,
    popularEngagementData.loading,
    chronoData.loading,
    confirmedData.data,
    rageData.data,
    popularEngagementData.data,
    chronoData.data,
    setActiveFilter,
  ]);

  // ---------------- Fetch filtered reports by brand ----------------
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
        setTotalCount(data.data.length);
      } catch (err) {
        console.error("Erreur fetch reports filtrés:", err);
        setFilteredReports([]);
      } finally {
        setLoadingFiltered(false);
      }
    };

    fetchFilteredReports();
  }, [selectedBrand]);

  // ---------------- Search & filters ----------------
  useEffect(() => {
    setSearchTerm("");
  }, [selectedBrand]);

  const availableSubCategories = useMemo(() => {
    if (!selectedBrand) return [];
    const subCategories = filteredReports
      .filter((report) => report.marque === selectedBrand)
      .map((report) => report.subCategory)
      .filter((v): v is string => typeof v === "string" && v.trim().length > 0);
    return Array.from(new Set(subCategories)).sort((a, b) =>
      a.localeCompare(b, "fr", { sensitivity: "base" }),
    );
  }, [filteredReports, selectedBrand]);

  const filteredByCategory = useMemo(() => {
    if (selectedCategory) {
      return filteredReports.filter(
        (report) => report.subCategory === selectedCategory,
      );
    }
    return filteredReports;
  }, [filteredReports, selectedCategory]);

  const normalizedSearchTerm = useMemo(
    () => (searchTerm.trim() ? normalizeText(searchTerm) : ""),
    [searchTerm],
  );

  const reportsToDisplay = useMemo(() => {
    if (!normalizedSearchTerm) return filteredByCategory;
    return filteredByCategory.filter((report) => {
      const searchableValues = getSearchableStrings(report);
      console.log("searchableValues", searchableValues);
      return searchableValues.some((value) =>
        normalizeText(value).includes(normalizedSearchTerm),
      );
    });
  }, [filteredByCategory, normalizedSearchTerm]);

  // ---------------- Update selected siteUrl ----------------
  useEffect(() => {
    if (!selectedBrand && !selectedCategory) {
      setSelectedSiteUrl(undefined);
      return;
    }
    if ((reportsToDisplay ?? []).length === 0) {
      setSelectedSiteUrl(undefined);
      return;
    }
    setSelectedSiteUrl(reportsToDisplay[0]?.siteUrl);
  }, [reportsToDisplay, selectedBrand, selectedCategory, setSelectedSiteUrl]);

  // ---------------- Render ----------------
  if (initializing) {
    return (
      <div className="home-grouped-reports-list">
        <SqueletonAnime
          loaderRef={loaderRef}
          loading={true}
          hasMore={false}
          error={null}
        />
      </div>
    );
  }

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

      {/* === données filtrées === */}
      {selectedBrand || selectedCategory ? (
        <div className="grouped-by-category">
          {loadingFiltered ? (
            <SqueletonAnime
              loaderRef={loaderRef}
              loading={true}
              hasMore={false}
              error={null}
            />
          ) : reportsToDisplay.length === 0 ? (
            <div
              style={{ padding: "20px", textAlign: "center", color: "#888" }}
            >
              Aucun signalement trouvé pour ces filtres...
            </div>
          ) : (
            Object.entries(
              reportsToDisplay.reduce(
                (acc: Record<string, FilteredReport[]>, report) => {
                  if (!acc[report.category]) acc[report.category] = [];
                  acc[report.category].push(report);
                  return acc;
                },
                {},
              ),
            ).map(([category, reports]) => (
              <>
                {selectedBrand && (
                  <div className="selected-brand-summary">
                    <div className="selected-brand-summary__brand">
                      <div className="selected-brand-summary__logo">
                        <img
                          src={getBrandLogo(selectedBrand)}
                          alt={selectedBrand}
                        />
                      </div>
                      <div className="selected-brand-summary__info-container">
                        {selectedCategory ? (
                          <>
                            <span className="count">
                              {filteredByCategory.length}
                            </span>
                            <span className="text">
                              signalement
                              {filteredByCategory.length > 1 ? "s" : ""} lié
                              {filteredByCategory.length > 1 ? "s" : ""} à «{" "}
                              <b>{selectedCategory}</b> » sur{" "}
                              {` ${capitalizeFirstLetter(selectedBrand)}`}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="count">{totalCount}</span>
                            <span className="text">
                              signalement{totalCount > 1 ? "s" : ""} sur{" "}
                              {` ${capitalizeFirstLetter(selectedBrand)}`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div key={category} className="category-block">
                  {reports.map((report, i) => (
                    <FlatSubcategoryBlock
                      key={`${report.reportingId}-${report.subCategory}-${i}`}
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
              </>
            ))
          )}
        </div>
      ) : filter === "confirmed" ? (
        confirmedData.loading ? (
          <SqueletonAnime
            loaderRef={loaderRef}
            loading={true}
            hasMore={false}
            error={null}
          />
        ) : (confirmedData.data ?? []).length === 0 ? (
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
        rageData.loading ? (
          <SqueletonAnime
            loaderRef={loaderRef}
            loading={true}
            hasMore={false}
            error={null}
          />
        ) : rageData.data && Object.keys(rageData.data).length === 0 ? (
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
        popularEngagementData.loading ? (
          <SqueletonAnime
            loaderRef={loaderRef}
            loading={true}
            hasMore={false}
            error={null}
          />
        ) : (popularEngagementData.data ?? []).length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
            Aucun signalement populaire pour le moment.
          </div>
        ) : (
          <PopularReportList
            data={popularEngagementData.data}
            expandedItems={expandedItems}
            handleToggle={(key) =>
              setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }))
            }
            loading={popularEngagementData.loading}
          />
        )
      ) : filter === "chrono" ? (
        chronoData.loading ? (
          <SqueletonAnime
            loaderRef={loaderRef}
            loading={true}
            hasMore={false}
            error={null}
          />
        ) : chronoData.data && Object.keys(chronoData.data).length === 0 ? (
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
            (filter === "chrono" && chronoData.loading) ||
            (filter === "popular" && popularEngagementData.loading) ||
            (!filter && flatData.loading)
          }
          hasMore={
            (filter === "chrono" && chronoData.hasMore) ||
            (filter === "popular" && popularEngagementData.hasMore) ||
            (!filter && flatData.hasMore) ||
            false
          }
          error={null}
        />
      )}
    </div>
  );
};

export default HomeGroupedReportsList;
