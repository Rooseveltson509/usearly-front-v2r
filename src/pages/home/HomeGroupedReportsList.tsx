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
import { useGroupedReportsScroll } from "@src/hooks/useGroupedReportsScroll";
import type { PopularGroupedReport } from "@src/types/Reports";
import ReportListView from "./ReportListView";

interface Props {
    activeTab: FeedbackType;
    activeFilter: string;
    onViewModeChange: (mode: "flat" | "chrono") => void;
    setActiveFilter: (val: string) => void;
    viewMode: "flat" | "chrono";
}

const HomeGroupedReportsList: React.FC<Props> = ({
    activeTab,
    activeFilter,
    onViewModeChange,
    setActiveFilter,
    viewMode,
}) => {
    const [filter, setFilter] = useState<"hot" | "rage" | "popular" | "urgent" | "chrono" | "">("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isHotFilterAvailable, setIsHotFilterAvailable] = useState(false);

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

    const isViewFlatWithFilter = ["hot", "urgent", "popular"].includes(filter) && viewMode === "flat";

    const {
        data: popularData,
        loading: loadingPopular,
        hasMore: hasMorePopular,
        loadMore: loadMorePopular,
    } = usePaginatedGroupedReportsByHot(filter, isViewFlatWithFilter);

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

    useEffect(() => {
        if (["hot", "rage", "popular", "urgent"].includes(filter)) {
            let sourceData: PopularGroupedReport[] = [];

            if (filter === "rage") {
                sourceData = Object.values(rageData).flat();
            } else if (filter === "popular") {
                sourceData = Object.values(popularEngagementData).flat();
            } else {
                sourceData = Object.values(popularData).flat();
            }

            const expanded: Record<string, boolean> = {};
            for (const item of sourceData) {
                const key = `${item.reportingId}-${item.subCategory}`;
                expanded[key] = true;
            }
            setExpandedItems(expanded);
        } else if (!isChronoView) {
            setExpandedItems({});
        }
    }, [filter, popularData, popularEngagementData, rageData]);

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
                    isHotFilterAvailable={isHotFilterAvailable}
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

                loadingChrono={loadingChrono}
                loadingPopular={loadingPopular}
                loadingPopularEngagement={loadingPopularEngagement}
                loadingRage={loadingRage}

            />

            <SqueletonAnime
                loaderRef={loaderRef}
                loading={
                    filter === "popular"
                        ? loadingPopularEngagement
                        : filter !== ""
                            ? loadingPopular
                            : isChronoView
                                ? loadingChrono
                                : loadingFlat
                }
                hasMore={
                    filter === "popular"
                        ? hasMorePopularEngagement
                        : filter !== ""
                            ? hasMorePopular
                            : isChronoView
                                ? hasMoreChrono
                                : hasMoreFlat
                }
                error={null}
            />
        </div>
    );
};

export default HomeGroupedReportsList;