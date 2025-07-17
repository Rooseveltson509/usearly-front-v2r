import { useState, useRef, useEffect } from "react";
import type { FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import { useFetchGroupedReports } from "@src/hooks/useFetchGroupedReports";
import { usePaginatedGroupedReportsByDate } from "@src/hooks/usePaginatedGroupedReportsByDate";
import ChronologicalReportList from "@src/components/report-grouped/ChronologicalReportList";
import ChronoReportCard from "@src/components/report-grouped/report-by-date/ChronoReportCard";
import type { ExplodedGroupedReport } from "@src/types/Reports";
import "./HomeGroupedReportsList.scss";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import PublicBrandBlock from "@src/components/home-grouped-reports-list/HomeBrandBlock";
import HomeBrandBlock from "@src/components/home-grouped-reports-list/HomeBrandBlock";

interface Props {
    activeTab: FeedbackType;
}

const HomeGroupedReportsList: React.FC<Props> = ({ activeTab }) => {
    const [viewMode, setViewMode] = useState<"flat" | "chrono">("flat");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const { data: flatData, loading: loadingFlat, hasMore: hasMoreFlat, loadMore: loadMoreFlat } = useFetchGroupedReports(activeTab);
    const { data: chronoData, loading: loadingChrono, hasMore: hasMoreChrono, loadMore: loadMoreChrono } = usePaginatedGroupedReportsByDate(viewMode === "chrono");

    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                if (viewMode === "chrono" && hasMoreChrono && !loadingChrono) {
                    loadMoreChrono();
                }
                if (viewMode === "flat" && hasMoreFlat && !loadingFlat) {
                    loadMoreFlat();
                }
            }
        });

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [viewMode, hasMoreChrono, loadingChrono, loadMoreChrono, hasMoreFlat, loadingFlat, loadMoreFlat]);

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
                <select value={viewMode} onChange={(e) => setViewMode(e.target.value as "flat" | "chrono")}>
                    <option value="flat">Vue par marque</option>
                    <option value="chrono">Vue par date</option>
                </select>
                <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                    <option value="">Toutes les marques</option>
                    {availableBrands.map((brand) => (
                        <option key={brand} value={brand}>{brand}</option>
                    ))}
                </select>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">Toutes les catégories</option>
                    {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                {(selectedBrand || selectedCategory) && (
                    <button onClick={() => { setSelectedBrand(""); setSelectedCategory(""); }}>Réinitialiser</button>
                )}
            </div>

            {viewMode === "flat" && (
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

            {viewMode === "chrono" && chronoData && (
                <ChronologicalReportList
                    groupedByDay={chronoData as Record<string, ExplodedGroupedReport[]>}
                    renderCard={(item) => {
                        const key = item.subCategory.descriptions[0]?.id || `${item.marque}-${item.subCategory.subCategory}`;
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

            <SqueletonAnime
                loaderRef={loaderRef}
                loading={viewMode === "chrono" ? loadingChrono : loadingFlat}
                hasMore={viewMode === "chrono" ? hasMoreChrono : hasMoreFlat}
                error={null}
            />

        </div>
    );
};

export default HomeGroupedReportsList;