import { useState, useRef, useEffect } from "react";
import type { FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import { useFetchGroupedReports } from "@src/hooks/useFetchGroupedReports";
import { usePaginatedGroupedReportsByDate } from "@src/hooks/usePaginatedGroupedReportsByDate";
import { usePaginatedGroupedReportsByHot } from "@src/hooks/usePaginatedGroupedReportsByHot";
import { usePaginatedGroupedReportsByPopularEngagement } from "@src/hooks/usePaginatedGroupedReportsByPopularEngagement";
import { usePaginatedGroupedReportsByRage } from "@src/hooks/usePaginatedGroupedReportsByRage";
import { getGroupedReportsByHot } from "@src/services/feedbackService";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import "./HomeGroupedReportsList.scss";
import ActiveFilterBadges from "./ActiveFilterBadges";
import FilterBar from "./FilterBar";
import ReportListView from "./ReportListView";
import { useGroupedReportsScroll } from "@src/hooks/useGroupedReportsScroll";

interface Props {
  activeTab: FeedbackType;
  activeFilter: string;
  onViewModeChange?: (mode: "flat" | "chrono") => void;
  setActiveFilter: (val: string) => void;
}

const HomeGroupedReportsList: React.FC<Props> = ({ activeTab, activeFilter, onViewModeChange, setActiveFilter }) => {
  const [filter, setFilter] = useState<"hot" | "rage" | "popular" | "urgent" | "">("");
  const [viewMode, setViewMode] = useState<"flat" | "chrono">("flat");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHotFilterAvailable, setIsHotFilterAvailable] = useState(false);

  const {
    data: flatData,
    loading: loadingFlat,
    hasMore: hasMoreFlat,
    loadMore: loadMoreFlat,
  } = useFetchGroupedReports(activeTab);

  const {
    data: chronoData,
    loading: loadingChrono,
    hasMore: hasMoreChrono,
    loadMore: loadMoreChrono,
  } = usePaginatedGroupedReportsByDate(viewMode === "chrono" && filter === "");

  const {
    data: popularData,
    loading: loadingPopular,
    hasMore: hasMorePopular,
    loadMore: loadMorePopular,
  } = usePaginatedGroupedReportsByHot(filter, filter !== "");

  const {
    data: popularEngagementData,
    loading: loadingPopularEngagement,
    hasMore: hasMorePopularEngagement,
    loadMore: loadMorePopularEngagement,
  } = usePaginatedGroupedReportsByPopularEngagement(filter, filter === "popular");

  const {
    data: rageData,
    loading: loadingRage,
    hasMore: hasMoreRage,
    loadMore: loadMoreRage,
  } = usePaginatedGroupedReportsByRage(filter === "rage");

  useEffect(() => {
    const checkHotAvailability = async () => {
      try {
        const res = await getGroupedReportsByHot(1, 1, "hot");
        setIsHotFilterAvailable(Object.keys(res.data || {}).length > 0);
      } catch (e) {
        setIsHotFilterAvailable(false);
      }
    };
    checkHotAvailability();
  }, []);

  useEffect(() => {
    if (isHotFilterAvailable && filter === "") {
      setFilter("hot");
      setViewMode("chrono");
      setActiveFilter("hot");
      onViewModeChange?.("chrono");
    }
  }, [isHotFilterAvailable]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setFilter(activeFilter as typeof filter);
  }, [activeFilter]);

  useGroupedReportsScroll({
    loaderRef,
    filter,
    viewMode,
    loadingFlat,
    loadingChrono,
    loadingPopular,
    loadingPopularEngagement,
    hasMoreFlat,
    hasMoreChrono,
    hasMorePopular,
    hasMorePopularEngagement,
    loadMoreFlat,
    loadMoreChrono,
    loadMorePopular,
    loadMorePopularEngagement,
  });

  const filteredFlatData = flatData.filter((report) => {
    const brandMatch = selectedBrand ? report.marque === selectedBrand : true;
    const categoryMatch = selectedCategory ? report.subCategories.some((sc) => sc.subCategory === selectedCategory) : true;
    return brandMatch && categoryMatch;
  });

  const handleToggle = (key: string) => {
    setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const availableBrands = Array.from(new Set(flatData.map((d) => d.marque))).sort();
  const availableCategories = Array.from(new Set(flatData.flatMap((d) => d.subCategories.map((sc) => sc.subCategory)))).sort();

  return (
    <div className="home-grouped-reports-list">
      <div className="controls">
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          setSelectedBrand={setSelectedBrand}
          setSelectedCategory={setSelectedCategory}
          setActiveFilter={setActiveFilter}
          onViewModeChange={onViewModeChange}
          isHotFilterAvailable={isHotFilterAvailable}
          dropdownRef={dropdownRef}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          selectedBrand={selectedBrand}
          selectedCategory={selectedCategory}
          availableBrands={availableBrands}
          availableCategories={availableCategories}
        />
        <ActiveFilterBadges
          selectedBrand={selectedBrand}
          selectedCategory={selectedCategory}
          onClearBrand={() => setSelectedBrand("")}
          onClearCategory={() => setSelectedCategory("")}
        />
      </div>

      <ReportListView
        filter={filter}
        viewMode={viewMode}
        flatData={filteredFlatData}
        chronoData={chronoData}
        popularData={popularData}
        popularEngagementData={popularEngagementData}
        rageData={rageData}
        expandedItems={expandedItems}
        handleToggle={handleToggle}
      />

      <SqueletonAnime
        loaderRef={loaderRef}
        loading={
          filter === "popular"
            ? loadingPopularEngagement
            : filter !== ""
            ? loadingPopular
            : viewMode === "chrono"
            ? loadingChrono
            : loadingFlat
        }
        hasMore={
          filter === "popular"
            ? hasMorePopularEngagement
            : filter !== ""
            ? hasMorePopular
            : viewMode === "chrono"
            ? hasMoreChrono
            : hasMoreFlat
        }
        error={null}
      />
    </div>
  );
};

export default HomeGroupedReportsList;

/* import { useState, useRef, useEffect } from "react";
import type { FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import { useFetchGroupedReports } from "@src/hooks/useFetchGroupedReports";
import { usePaginatedGroupedReportsByDate } from "@src/hooks/usePaginatedGroupedReportsByDate";
import { usePaginatedGroupedReportsByHot } from "@src/hooks/usePaginatedGroupedReportsByHot";

import ChronologicalReportList from "@src/components/report-grouped/ChronologicalReportList";
import ChronoReportCard from "@src/components/report-grouped/report-by-date/ChronoReportCard";
import HomeBrandBlock from "@src/components/home-grouped-reports-list/HomeBrandBlock";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import type { ExplodedGroupedReport } from "@src/types/Reports";

import "./HomeGroupedReportsList.scss";
import PopularReportCard from "@src/components/report-grouped/reports-popular/PopularReportCard";
import { Folder, SlidersHorizontal, Tag } from "lucide-react";
import { getGroupedReportsByHot } from "@src/services/feedbackService";
import { usePaginatedGroupedReportsByPopularEngagement } from "@src/hooks/usePaginatedGroupedReportsByPopularEngagement";
import { usePaginatedGroupedReportsByRage } from "@src/hooks/usePaginatedGroupedReportsByRage";

interface Props {
    activeTab: FeedbackType;
    activeFilter: string;
    onViewModeChange?: (mode: "flat" | "chrono") => void;
    setActiveFilter: (val: string) => void;
}


const HomeGroupedReportsList: React.FC<Props> = ({ activeTab, activeFilter, onViewModeChange, setActiveFilter }) => {
    const [filter, setFilter] = useState<"hot" | "rage" | "popular" | "urgent" | "">("");
    const [viewMode, setViewMode] = useState<"flat" | "chrono">("flat");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isHotFilterAvailable, setIsHotFilterAvailable] = useState(false);


    useEffect(() => {
        const checkHotAvailability = async () => {
            try {
                const res = await getGroupedReportsByHot(1, 1, "hot");
                setIsHotFilterAvailable(Object.keys(res.data || {}).length > 0);
            } catch (e) {
                setIsHotFilterAvailable(false);
            }
        };

        checkHotAvailability();
    }, []);


    useEffect(() => {
        if (isHotFilterAvailable && filter === "") {
            setFilter("hot");
            setViewMode("chrono");
            setActiveFilter("hot");
            onViewModeChange?.("chrono");
        }
    }, [isHotFilterAvailable]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);



    // 🔁 synchronisation avec le filtre venant de Home.tsx
    useEffect(() => {
        setFilter(activeFilter as "hot" | "rage" | "popular" | "urgent" | "");
    }, [activeFilter]);

    const {
        data: flatData,
        loading: loadingFlat,
        hasMore: hasMoreFlat,
        loadMore: loadMoreFlat,
    } = useFetchGroupedReports(activeTab);

    const {
        data: chronoData,
        loading: loadingChrono,
        hasMore: hasMoreChrono,
        loadMore: loadMoreChrono,
    } = usePaginatedGroupedReportsByDate(viewMode === "chrono" && filter === "");

    const {
        data: popularData,
        loading: loadingPopular,
        hasMore: hasMorePopular,
        loadMore: loadMorePopular,
    } = usePaginatedGroupedReportsByHot(filter, filter !== "");

    const {
        data: popularEngagementData,
        loading: loadingPopularEngagement,
        hasMore: hasMorePopularEngagement,
        loadMore: loadMorePopularEngagement,
    } = usePaginatedGroupedReportsByPopularEngagement(filter, filter === "popular");

    const {
        data: rageData,
        loading: loadingRage,
        hasMore: hasMoreRage,
        loadMore: loadMoreRage,
    } = usePaginatedGroupedReportsByRage(filter === "rage");



    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                if (filter === "popular" && hasMorePopularEngagement && !loadingPopularEngagement) {
                    loadMorePopularEngagement();
                } else if (filter !== "" && hasMorePopular && !loadingPopular) {
                    loadMorePopular();
                } else if (viewMode === "chrono" && filter === "" && hasMoreChrono && !loadingChrono) {
                    loadMoreChrono();
                } else if (viewMode === "flat" && filter === "" && hasMoreFlat && !loadingFlat) {
                    loadMoreFlat();
                }
            }

        });

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [
        viewMode,
        filter,
        hasMoreChrono,
        loadingChrono,
        loadMoreChrono,
        hasMoreFlat,
        loadingFlat,
        loadMoreFlat,
        hasMorePopular,
        loadingPopular,
        loadMorePopular,
    ]);

    const filteredFlatData = flatData.filter((report) => {
        const brandMatch = selectedBrand ? report.marque === selectedBrand : true;
        const categoryMatch = selectedCategory ? report.subCategories.some((sc) => sc.subCategory === selectedCategory) : true;
        return brandMatch && categoryMatch;
    });

    const handleToggle = (key: string) => {
        setExpandedItems((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const availableBrands = Array.from(new Set(flatData.map((d) => d.marque))).sort();
    const availableCategories = Array.from(new Set(flatData.flatMap((d) => d.subCategories.map((sc) => sc.subCategory)))).sort();

    return (
        <div className="home-grouped-reports-list">
            <div className="controls">

            <div className={`select-filter-wrapper ${filter === "hot" ? "hot-active" : ""}`}>
                    <select
                        className="select-filter"
                        value={filter !== "" ? filter : viewMode}
                        onChange={(e) => {
                            const value = e.target.value;
                            setSelectedBrand("");
                            setSelectedCategory("");

                            if (["hot", "rage", "popular", "urgent"].includes(value)) {
                                setFilter(value as any);
                                setViewMode("chrono");
                                onViewModeChange?.("chrono");
                                setActiveFilter(value);
                            } else {
                                setFilter("");
                                setViewMode(value as "flat" | "chrono");
                                onViewModeChange?.(value as "flat" | "chrono");
                                setActiveFilter("");
                            }
                        }}
                    >
                        <option value="flat">🏷️ Les plus récents</option>
                        <option value="chrono">🕒 Vue par date</option>
                        {isHotFilterAvailable && <option value="hot"> Ça chauffe par ici</option>}
                        <option value="rage">😡 Les plus rageants</option>
                        <option value="popular">👍 Les plus populaires</option>
                        <option value="urgent">👀 À shaker vite</option>
                    </select>
                </div>

                <div className="filter-dropdown-wrapper" ref={dropdownRef}>
                    <button className="filter-toggle" onClick={() => setIsDropdownOpen(prev => !prev)}>
                        <SlidersHorizontal size={18} style={{ marginRight: "6px" }} />
                        Filtrer
                    </button>

                    {isDropdownOpen && (
                        <div className="filter-dropdown">
                            <select
                                value={selectedBrand}
                                onChange={(e) => {
                                    setSelectedBrand(e.target.value);
                                    // 👉 Forcer la vue à "Les plus récents"
                                    setViewMode("flat");
                                    setFilter("");
                                    onViewModeChange?.("flat");
                                    setActiveFilter("");
                                }}
                            >
                                <option value="">Toutes les marques</option>
                                {availableBrands.map((brand) => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>

                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setViewMode("flat");
                                    setFilter("");
                                    onViewModeChange?.("flat");
                                    setActiveFilter("");
                                }}
                            >

                                <option value="">Toutes les catégories</option>
                                {availableCategories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            {(selectedBrand || selectedCategory) && (
                                <button
                                    className="reset"
                                    onClick={() => {
                                        setSelectedBrand("");
                                        setSelectedCategory("");
                                        setViewMode("flat");
                                        setFilter("");
                                        onViewModeChange?.("flat");
                                        setActiveFilter("");
                                    }}
                                >
                                    Réinitialiser
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <div className="active-filters">
                    {selectedBrand && (
                        <span className="active-filter-badge">
                            <Tag size={14} style={{ marginRight: "4px" }} />
                            {selectedBrand}
                            <span className="close-icon" onClick={() => setSelectedBrand("")}>×</span>
                        </span>
                    )}

                    {selectedCategory && (
                        <span className="active-filter-badge">
                            <Folder size={14} style={{ marginRight: "4px" }} />
                            {selectedCategory}
                            <span className="close-icon" onClick={() => setSelectedCategory("")}>×</span>
                        </span>
                    )}
                </div>
            </div>

            {filter !== "" && popularData && Object.keys(popularData).length === 0 && (
                <div className="no-popular-results">
                    <p>Aucun signalement ne correspond à ce filtre pour le moment.</p>
                </div>
            )}

            {filter !== "" && (
                <ChronologicalReportList
                    groupedByDay={
                        filter === "popular"
                            ? popularEngagementData
                            : filter === "rage"
                                ? rageData
                                : popularData
                    }
                    renderCard={(item) => {
                        const key = `${item.reportingId}-${item.subCategory}`;
                        return (
                            <PopularReportCard
                                key={key}
                                item={item}
                                isOpen={!!expandedItems[key]}
                                onToggle={() => handleToggle(key)}
                                isHot={filter === "hot"}
                            />
                        );
                    }}
                />
            )}



            {filter === "" && viewMode === "chrono" && chronoData && (
                <ChronologicalReportList
                    groupedByDay={chronoData}
                    renderCard={(item) => {
                        const key = `${item.reportingId}-${item.subCategory.subCategory}`;
                        return (
                            <ChronoReportCard
                                key={key}
                                item={item}
                                isOpen={!!expandedItems[key]}
                                onToggle={() => handleToggle(key)}
                            />
                        );
                    }}
                />
            )}



            {filter === "" && viewMode === "flat" && (
                filteredFlatData.length === 0 ? (
                    <p>Aucun report disponible.</p>
                ) : (
                    Object.entries(
                        filteredFlatData.reduce<Record<string, typeof filteredFlatData>>((acc, report) => {
                            if (!acc[report.marque]) acc[report.marque] = [];
                            acc[report.marque].push(report);
                            return acc;
                        }, {})
                    ).map(([brand, reports]) => (
                        <HomeBrandBlock key={brand} brand={brand} siteUrl={reports[0]?.siteUrl || ""} reports={reports} />
                    ))
                )
            )}

            <SqueletonAnime
                loaderRef={loaderRef}
                loading={
                    filter === "popular"
                        ? loadingPopularEngagement
                        : filter !== ""
                            ? loadingPopular
                            : viewMode === "chrono"
                                ? loadingChrono
                                : loadingFlat
                }
                hasMore={
                    filter === "popular"
                        ? hasMorePopularEngagement
                        : filter !== ""
                            ? hasMorePopular
                            : viewMode === "chrono"
                                ? hasMoreChrono
                                : hasMoreFlat
                }

                error={null}
            />
        </div>
    );
};

export default HomeGroupedReportsList;
 */