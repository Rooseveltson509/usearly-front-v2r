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
import FlatSubcategoryBlock from "./confirm-reportlist/FlatSubcategoryBlock";
import ReportListView from "./ReportListView";
import ConfirmedReportsList from "./confirm-reportlist/ConfirmReportsList";
import { useGroupedReportsScroll } from "@src/hooks/useGroupedReportsScroll";

import type { PopularGroupedReport } from "@src/types/Reports";
import type { FilterType } from "@src/types/Filters";
import "./HomeGroupedReportsList.scss";

interface Props {
    activeTab: FeedbackType;
    activeFilter: string;
    onViewModeChange: (mode: "flat" | "chrono" | "confirmed") => void;
    setActiveFilter: (val: string) => void;
    viewMode: "flat" | "chrono" | "confirmed";
}

const HomeGroupedReportsList = ({
    activeTab,
    activeFilter,
    onViewModeChange,
    setActiveFilter,
    viewMode,
}: Props) => {
    const [filter, setFilter] = useState<FilterType>(activeFilter as FilterType);
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const isChronoView = viewMode === "chrono" && (filter === "" || filter === "chrono");


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
    } = usePaginatedGroupedReportsByDate(isChronoView);

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

    const { data: confirmedData, loading: loadingConfirmed } = useConfirmedFlatData();

    useEffect(() => {
        setFilter(activeFilter as FilterType);
    }, [activeFilter]);

    useEffect(() => {
        let sourceData: PopularGroupedReport[] = [];
        if (filter === "rage") {
            sourceData = Object.values(rageData).flat();
        } else if (filter === "popular") {
            sourceData = Object.values(popularEngagementData).flat();
        }
        const expanded: Record<string, boolean> = {};
        for (const item of sourceData) {
            const key = `${item.reportingId}-${item.subCategory}`;
            expanded[key] = true;
        }
        setExpandedItems(expanded);
    }, [filter, popularEngagementData, rageData]);

    useEffect(() => {
        if (isChronoView) {
            const allItems = Object.values(chronoData).flat();
            const expanded: Record<string, boolean> = {};
            for (const item of allItems) {
                const key = `${item.reportingId}-${item.subCategory.subCategory}`;
                expanded[key] = true;
            }
            setExpandedItems(expanded);
        }
    }, [isChronoView, chronoData]);

    useGroupedReportsScroll({
        loaderRef,
        filter,
        viewMode,
        loadingFlat,
        loadingChrono,
        loadingPopular: false,
        loadingPopularEngagement,
        hasMoreFlat,
        hasMoreChrono,
        hasMorePopular: false,
        hasMorePopularEngagement,
        loadMoreFlat,
        loadMoreChrono,
        loadMorePopular: () => { },
        loadMorePopularEngagement,
    });

    const filteredFlatData = flatData.filter((report) => {
        const brandMatch = selectedBrand ? report.marque === selectedBrand : true;
        const categoryMatch = selectedCategory
            ? report.subCategories.some((sc) => sc.subCategory === selectedCategory)
            : true;
        return brandMatch && categoryMatch;
    });

    const handleToggle = (key: string) => {
        setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const availableBrands = Array.from(new Set(flatData.map((d) => d.marque))).sort();
    const availableCategories = Array.from(
        new Set(flatData.flatMap((d) => d.subCategories.map((sc) => sc.subCategory)))
    ).sort();


    return (
        /*         <div className="home-grouped-reports-list">
                    <div className="controls">
                        <FilterBar
                            filter={filter}
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
                            availableCategories={availableCategories}
                            labelOverride={isChronoView ? "Les plus récents" : undefined}
                        />
                        <ActiveFilterBadges
                            selectedBrand={selectedBrand}
                            selectedCategory={selectedCategory}
                            onClearBrand={() => setSelectedBrand("")}
                            onClearCategory={() => setSelectedCategory("")}
                        />
                    </div>
        
                    {viewMode === "confirmed" ? (
                        <ConfirmedReportsList
                            expandedItems={expandedItems}
                            handleToggle={handleToggle}
                        />
                    ) : filter === "hot" && viewMode === "flat" ? (
                        filteredFlatData.map((item) => (
                            <FlatSubcategoryBlock
                                key={item.marque + item.subCategories[0]?.subCategory}
                                brand={item.marque}
                                brandLogoUrl={item.siteUrl || "/default-logo.png"}
                                subcategory={item.subCategories[0]?.subCategory || ""}
                                descriptions={item.subCategories[0]?.descriptions || []}
                            />
                        ))
                    ) : (
                        <ReportListView
                            filter={filter}
                            viewMode={viewMode}
                            flatData={filteredFlatData}
                            chronoData={chronoData}
                            popularData={{}}
                            popularEngagementData={popularEngagementData}
                            rageData={rageData}
                            expandedItems={expandedItems}
                            handleToggle={handleToggle}
                            loadingChrono={loadingChrono}
                            loadingPopular={false}
                            loadingPopularEngagement={loadingPopularEngagement}
                            loadingRage={loadingRage}
                        />
                    )}
        
        
                    <SqueletonAnime
                        loaderRef={loaderRef}
                        loading={
                            filter === "popular"
                                ? loadingPopularEngagement
                                : filter === "rage"
                                    ? loadingRage
                                    : isChronoView
                                        ? loadingChrono
                                        : loadingFlat
                        }
                        hasMore={
                            filter === "popular"
                                ? hasMorePopularEngagement
                                : filter === "rage"
                                    ? hasMoreRage
                                    : isChronoView
                                        ? hasMoreChrono
                                        : hasMoreFlat
                        }
                        error={null}
                    />
                </div> */
        <div className="home-grouped-reports-list">
            <div className="controls">
                <FilterBar
                    filter={filter}
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
                    availableCategories={availableCategories}
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

            {filter === "confirmed" ? (
                <ConfirmedReportsList
                    expandedItems={expandedItems}
                    handleToggle={handleToggle}
                />
            ) : (
                <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
                    Aucun signalement à afficher pour ce filtre.
                </div>
            )}

            {viewMode !== "confirmed" && (
                <SqueletonAnime
                    loaderRef={loaderRef}
                    loading={false}
                    hasMore={false}
                    error={null}
                />
            )}
        </div>
    );
};

export default HomeGroupedReportsList;
