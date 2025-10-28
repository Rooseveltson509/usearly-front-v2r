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
import Avatar from "@src/components/shared/Avatar";
import "./countBarBrand.scss";
import { useLocation } from "react-router-dom";

type ViewMode = "flat" | "chrono" | "confirmed";

type SectionKey =
  | "loading"
  | "brandFiltered"
  | "confirmed"
  | "rage"
  | "popular"
  | "chrono"
  | "urgent"
  | "default";

interface Props {
  activeTab: FeedbackType;
  activeFilter: string;
  setActiveFilter: (val: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedBrand: string;
  setSelectedBrand: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedMainCategory: string;
  setSelectedMainCategory: (val: string) => void;
  setSelectedSiteUrl: (val: string | undefined) => void;
  selectedSiteUrl?: string;

  totalityCount: number;
  onSectionChange?: (section: SectionKey) => void;
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
      if (typeof item === "string") values.push(item);
      else if (item && typeof item === "object") {
        if (typeof (item as any).description === "string")
          values.push((item as any).description);
        if (typeof (item as any).title === "string")
          values.push((item as any).title);
        if (typeof (item as any).text === "string")
          values.push((item as any).text);
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
  selectedMainCategory,
  setSelectedMainCategory,
  selectedSiteUrl,
  totalityCount,
  onSectionChange,
}: Props) => {
  const [filter, setFilter] = useState<FilterType>("chrono");
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
  const [currentSection, setCurrentSection] = useState<SectionKey>("loading");
  const location = useLocation(); // pour focus depuis une notif

  /* const isChronoView =
    viewMode === "chrono" && (filter === undefined || filter === "chrono"); */

  const { brands } = useBrands();
  const availableBrands = useMemo(() => brands.map((b) => b.marque), [brands]);

  // ⚡ Un seul hook est utilisé selon le filtre actif
  const confirmedData = useConfirmedFlatData();
  const rageData = usePaginatedGroupedReportsByRage(filter === "rage", 10);
  const derivedSection = useMemo<SectionKey>(() => {
    if (initializing) {
      return "loading";
    }

    const hasBrand = Boolean(selectedBrand?.trim());
    const hasCategory = Boolean(selectedCategory?.trim());

    if (hasBrand || hasCategory) {
      return "brandFiltered";
    }

    switch (filter) {
      case "confirmed":
        return "confirmed";
      case "rage":
        return "rage";
      case "popular":
        return "popular";
      case "chrono":
        return "chrono";
      case "urgent":
        return "urgent";
      default:
        return "default";
    }
  }, [filter, initializing, selectedBrand, selectedCategory]);

  useEffect(() => {
    if (currentSection !== derivedSection) {
      setCurrentSection(derivedSection);
    }
  }, [currentSection, derivedSection]);

  useEffect(() => {
    if (onSectionChange) {
      onSectionChange(currentSection);
    }
  }, [currentSection, onSectionChange]);

  // ---------------- Data hooks (toujours appelés) ----------------
  // const flatData = useFetchGroupedReports(activeTab);
  // const chronoData = usePaginatedGroupedReportsByDate(isChronoView);
  const popularEngagementData = usePaginatedGroupedReportsByPopularEngagement(
    filter === "popular",
    20,
  );
  const chronoData = usePaginatedGroupedReportsByDate(filter === "chrono");

  const flatData = useFetchGroupedReports(activeTab);

  let reportData: { data?: any; loading: boolean; hasMore?: boolean } = {
    loading: false,
  };

  switch (filter) {
    case "confirmed":
      reportData = confirmedData;
      break;
    case "rage":
      reportData = rageData;
      break;
    case "popular":
      reportData = popularEngagementData;
      break;
    case "chrono":
      reportData = chronoData;
      break;
    default:
      reportData = flatData;
  }

  // ---------------- Initial filter selection ----------------
  useEffect(() => {
    if (!initializing) return;

    // 🚀 Toujours démarrer sur les plus récents
    setFilter("chrono");
    setActiveFilter("chrono");
    onViewModeChange?.("chrono");

    setInitializing(false);
  }, [initializing, onViewModeChange, setActiveFilter]);

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
          params: { brand: selectedBrand, page: 1, limit: 10 },
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
      return searchableValues.some((value) =>
        normalizeText(value).includes(normalizedSearchTerm),
      );
    });
  }, [filteredByCategory, normalizedSearchTerm]);

  const availableSubCategoriesByBrandAndCategory = useMemo(() => {
    const grouped: Record<string, Record<string, string[]>> = {};

    (filteredReports ?? []).forEach((report) => {
      const brand = report.marque || "Autre";
      const category = Array.isArray(report.category)
        ? report.category[0]
        : report.category || "Autre catégorie";
      const sub = report.subCategory || "Autre sous-catégorie";

      if (!grouped[brand]) grouped[brand] = {};
      if (!grouped[brand][category]) grouped[brand][category] = [];

      if (!grouped[brand][category].includes(sub)) {
        grouped[brand][category].push(sub);
      }
    });

    return grouped;
  }, [filteredReports]);

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

  // 💡 Effet d’ouverture et focus automatique depuis une notif
  useEffect(() => {
    const focusId = location.state?.focusDescriptionId;
    if (!focusId) return;

    const timeout = setTimeout(() => {
      const el = document.querySelector(`[data-description-id="${focusId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("highlight-flash");
        setTimeout(() => el.classList.remove("highlight-flash"), 2500);
      } else {
        console.warn("⚠️ Aucun bloc trouvé pour focusDescriptionId:", focusId);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [location]);

  // ---------------- Render ----------------
  if (initializing) {
    return (
      <div
        className="home-grouped-reports-list"
        data-current-section={currentSection}
      >
        <SqueletonAnime
          loaderRef={loaderRef}
          loading
          hasMore={false}
          error={null}
        />
      </div>
    );
  }

  // ---------------- Render ----------------
  if (initializing) {
    return (
      <div
        className="home-grouped-reports-list"
        data-current-section={currentSection}
      >
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
    <div
      className="home-grouped-reports-list"
      data-current-section={currentSection}
    >
      <FilterBarAny
        filter={filter || ""}
        setFilter={setFilter}
        viewMode={viewMode}
        setViewMode={onViewModeChange}
        setSelectedBrand={setSelectedBrand}
        setSelectedCategory={setSelectedCategory}
        selectedMainCategory={selectedMainCategory}
        setSelectedMainCategory={setSelectedMainCategory}
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
        availableSubCategoriesByBrandAndCategory={
          availableSubCategoriesByBrandAndCategory
        } // ✅ ajout ici
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
      />

      {/* === données filtrées === */}
      {selectedBrand || selectedCategory ? (
        <div className="grouped-by-category">
          {selectedBrand && (
            <div className="selected-brand-summary">
              <div className="selected-brand-summary__brand">
                <div className="selected-brand-summary__logo">
                  <Avatar
                    avatar={getBrandLogo(selectedBrand, selectedSiteUrl)}
                    pseudo={selectedBrand}
                    type="brand"
                  />
                </div>
                <div className="selected-brand-summary__info-container">
                  {selectedCategory ? (
                    <>
                      <span className="count">{filteredByCategory.length}</span>
                      <span className="text">
                        Signalement
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
                        Signalement{totalCount > 1 ? "s" : ""} sur{" "}
                        {` ${capitalizeFirstLetter(selectedBrand)}`}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
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
            reportsToDisplay.map((report, i) => (
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
            ))
          )}
        </div>
      ) : filter === "confirmed" ? (
        reportData.loading ? (
          <SqueletonAnime
            loaderRef={loaderRef}
            loading={true}
            hasMore={false}
            error={null}
          />
        ) : (reportData.data ?? []).length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
            Aucun signalement confirmé pour le moment.
          </div>
        ) : (
          <>
            {selectedBrand && (
              <div className="selected-brand-summary">
                <div className="selected-brand-summary__brand">
                  <div className="selected-brand-summary__logo">
                    <Avatar
                      avatar={getBrandLogo(selectedBrand, selectedSiteUrl)}
                      pseudo={selectedBrand}
                      type="brand"
                    />
                  </div>
                  <div className="selected-brand-summary__info-container">
                    {selectedCategory ? (
                      <>
                        <span className="count">
                          {filteredByCategory.length}
                        </span>
                        <span className="text">
                          Signalement
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
                          Signalement{totalCount > 1 ? "s" : ""} sur{" "}
                          {` ${capitalizeFirstLetter(selectedBrand)}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            <ConfirmedReportsList
              expandedItems={expandedItems}
              handleToggle={(key) =>
                setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }))
              }
              searchTerm={searchTerm}
              onClearSearchTerm={() => setSearchTerm("")}
            />
          </>
        )
      ) : filter === "rage" ? (
        reportData.loading ? (
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
          <>
            {selectedBrand && (
              <div className="selected-brand-summary">
                <div className="selected-brand-summary__brand">
                  <div className="selected-brand-summary__logo">
                    <Avatar
                      avatar={getBrandLogo(selectedBrand, selectedSiteUrl)}
                      pseudo={selectedBrand}
                      type="brand"
                    />
                  </div>
                  <div className="selected-brand-summary__info-container">
                    {selectedCategory ? (
                      <>
                        <span className="count">
                          {filteredByCategory.length}
                        </span>
                        <span className="text">
                          Signalement
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
                          Signalement{totalCount > 1 ? "s" : ""} sur{" "}
                          {` ${capitalizeFirstLetter(selectedBrand)}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            <RageReportsList
              expandedItems={expandedItems}
              handleToggle={(key) =>
                setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }))
              }
              searchTerm={searchTerm}
              onClearSearchTerm={() => setSearchTerm("")}
            />
          </>
        )
      ) : filter === "popular" ? (
        reportData.loading ? (
          <SqueletonAnime
            loaderRef={loaderRef}
            loading={true}
            hasMore={false}
            error={null}
          />
        ) : (reportData.data ?? []).length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
            Aucun signalement populaire pour le moment.
          </div>
        ) : (
          <>
            <PopularReportList
              data={reportData.data}
              expandedItems={expandedItems}
              handleToggle={(key) =>
                setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }))
              }
              loading={reportData.loading}
            />
            {selectedBrand && (
              <div className="selected-brand-summary">
                <div className="selected-brand-summary__brand">
                  <div className="selected-brand-summary__logo">
                    <Avatar
                      avatar={getBrandLogo(selectedBrand, selectedSiteUrl)}
                      pseudo={selectedBrand}
                      type="brand"
                    />
                  </div>
                  <div className="selected-brand-summary__info-container">
                    {selectedCategory ? (
                      <>
                        <span className="count">
                          {filteredByCategory.length}
                        </span>
                        <span className="text">
                          Signalement
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
                          Signalement{totalCount > 1 ? "s" : ""} sur{" "}
                          {` ${capitalizeFirstLetter(selectedBrand)}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            <PopularReportList
              data={popularEngagementData.data}
              expandedItems={expandedItems}
              handleToggle={(key) =>
                setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }))
              }
              loading={popularEngagementData.loading}
            />
          </>
        )
      ) : filter === "chrono" ? (
        reportData.loading || chronoData.loading ? (
          <SqueletonAnime
            loaderRef={loaderRef}
            loading={true}
            hasMore={false}
            error={null}
          />
        ) : !chronoData.data || chronoData.data.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
            Aucun signalement récent disponible.
          </div>
        ) : (
          <div className="recent-reports-list">
            {chronoData.data.map((report: any, i: number) => (
              <div
                key={`${report.reportingId}-${i}`}
                className="recent-report-item"
              >
                <div className="recent-report-date">
                  🗓️{" "}
                  {new Date(report.date).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </div>

                <FlatSubcategoryBlock
                  brand={report.marque}
                  siteUrl={report.siteUrl}
                  subcategory={report.subCategory.subCategory} // ✅ nom réel
                  descriptions={report.subCategory.descriptions || []} // ✅ descriptions correctes
                  brandLogoUrl={getBrandLogo(report.marque, report.siteUrl)}
                  hideFooter={true}
                />
              </div>
            ))}
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
          loading={reportData.loading}
          hasMore={reportData.hasMore || false}
          error={null}
        />
      )}
    </div>
  );
};

export default HomeGroupedReportsList;
