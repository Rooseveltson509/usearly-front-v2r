import "./UserGroupedReportsList.scss";
import { useAuth } from "@src/services/AuthContext";
import { useState, useEffect, useRef } from "react";
import ChronologicalReportList from "@src/components/report-grouped/ChronologicalReportList";
import ChronoReportCard from "@src/components/report-grouped/report-by-date/ChronoReportCard";
import { useUserProfileFilters } from "@src/hooks/useUserProfileFilters";
import { usePaginatedUserReportsGroupedByDate } from "@src/hooks/usePaginatedUserReportsGroupedByDate";
import { getUserProfileGroupedReports } from "@src/services/feedbackService";
import ProfileFilters from "./ProfileFilters";
import type { UserGroupedReport, ExplodedGroupedReport } from "@src/types/Reports";
import UserBrandBlock from "../user-reports/UserBrandBlock";
import SqueletonAnime from "../loader/SqueletonAnime";

type ViewMode = "brand" | "date";

const UserGroupedReportsList: React.FC = () => {
    const { userProfile } = useAuth();
    const [data, setData] = useState<UserGroupedReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>("brand");
    const [expandedBrand, setExpandedBrand] = useState<string | null>(null);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const {
        selectedBrand,
        setSelectedBrand,
        selectedCategory,
        setSelectedCategory,
        availableBrands,
        availableCategories,
        filteredData
    } = useUserProfileFilters(data);

    const {
        data: chronoData,
        loading: loadingChrono,
        hasMore,
        loadMore
    } = usePaginatedUserReportsGroupedByDate(viewMode === "date");

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

    useEffect(() => {
        if (!loaderRef.current || viewMode !== "date") return;
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loadingChrono) {
                loadMore();
            }
        });
        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [hasMore, loadingChrono, loadMore, viewMode]);

    return (
        <div className="user-grouped-reports-list">
            <div className="controls">
                <select value={viewMode} onChange={(e) => setViewMode(e.target.value as ViewMode)}>
                    <option value="brand">Vue par marque</option>
                    <option value="date">Vue par date</option>
                </select>
            </div>

            {/* === VUE PAR MARQUE === */}
            {viewMode === "brand" && (
                <>
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
                                Réinitialiser les filtres
                            </button>
                        </div>
                    )}

                    {!loading && (
                        filteredData.length === 0 ? (
                            <p className="no-reports">Aucun signalement trouvé pour ces filtres.</p>
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
                                    onToggle={() => setExpandedBrand(expandedBrand === brand ? null : brand)}
                                />
                            ))
                        )
                    )}
                </>
            )}

            {/* === VUE PAR DATE === */}
            {viewMode === "date" && chronoData && (
                <ChronologicalReportList
                    groupedByDay={chronoData as Record<string, ExplodedGroupedReport[]>}
                    renderCard={(item) => (
                        <ChronoReportCard
                            key={item.subCategory.descriptions[0]?.id || `${item.marque}-${item.subCategory.subCategory}`}
                            item={item}
                        />
                    )}
                />
            )}

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
