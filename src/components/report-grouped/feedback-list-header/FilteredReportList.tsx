import React, { useEffect, useState, type JSX } from "react";
import { getFilteredReportDescriptions } from "@src/services/feedbackService";
import type { FeedbackDescription, ExplodedGroupedReport } from "@src/types/Reports";
import "./FilteredReportList.scss";
import type { UserReaction } from "@src/types/reaction";
import { apiService } from "@src/services/apiService";

type FeedbackWithReport = FeedbackDescription & {
    reporting?: {
        id: string;
        marque: string;
        categories: string[]; // ✅ on corrige ici
        reactions?: UserReaction[];
    };
};

interface Props {
    brand: string;
    category: string;
    renderCard: (item: ExplodedGroupedReport) => JSX.Element;
}

const limit = 10;

const FilteredReportList = ({ brand, category, renderCard }: Props) => {
    const [descriptions, setDescriptions] = useState<FeedbackWithReport[]>([]);
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setDescriptions([]);
        setPage(1);
        setHasMore(true);
    }, [brand, category]);

    useEffect(() => {
        const fetch = async () => {
            if (!hasMore || loading) return;
            setLoading(true);
            try {
                const res = await getFilteredReportDescriptions(brand, category, page, limit);
                if (res.data.length < limit) setHasMore(false);
                setDescriptions((prev) => [...prev, ...res.data]);
            } catch (err) {
                console.error("❌ Erreur chargement signalements filtrés", err);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [page, brand, category]);


    useEffect(() => {
        if (!brand) return;

        const fetchCategories = async () => {
            try {
                const res = await apiService.get("/reportings/categories-by-brand", {
                    params: { brand },
                });
                setAvailableCategories(res.data.categories || []);
            } catch (err) {
                console.error("Erreur récupération catégories :", err);
                setAvailableCategories([]);
            }
        };

        fetchCategories();
    }, [brand]);



    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !loading) {
            setPage((prev) => prev + 1);
        }
    };

    return (
        <div className="filtered-report-list" onScroll={handleScroll}>
            {descriptions.map((desc) =>

                renderCard({
                    id: desc.id,
                    reportingId: desc.reporting?.id || desc.id,
                    marque: desc.reporting?.marque || "Autre",
                    category: desc.reporting?.categories?.[0] || "Autre",
                    totalCount: 1,
                    reactions: desc.reporting?.reactions || [],
                    subCategory: {
                        subCategory: desc.reporting?.categories?.[0] || "Autre",
                        count: 1,
                        descriptions: [desc],
                    },
                    subCategories: [
                        {
                            subCategory: desc.reporting?.categories?.[0] || "Autre",
                            count: 1,
                            descriptions: [desc],
                        },
                    ],
                })
            )}
            {loading && <p className="loading">Chargement...</p>}
            {!hasMore && !loading && descriptions.length > 0 && (
                <p className="end-message">Fin des résultats</p>
            )}
            {!loading && descriptions.length === 0 && (
                <p className="empty-message">Aucun signalement trouvé pour ces filtres.</p>
            )}
        </div>
    );
};

export default FilteredReportList;