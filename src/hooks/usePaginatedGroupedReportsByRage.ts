import { useEffect, useState } from "react";
import { getGroupedReportsByRage } from "@src/services/feedbackService";
import type { PopularGroupedReport } from "@src/types/Reports";

export const usePaginatedGroupedReportsByRage = (
    active: boolean,
    pageSize = 10
) => {
    const [data, setData] = useState<Record<string, PopularGroupedReport[]>>({});
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (!active) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await getGroupedReportsByRage(page, pageSize);
                const newData = res.data || {};

                // Fusion des résultats par date
                setData((prev) => {
                    const merged = { ...prev };
                    for (const day in newData) {
                        const newItems = Array.isArray(newData[day]) ? newData[day] : [];

                        if (!Array.isArray(merged[day])) {
                            merged[day] = newItems;
                        } else {
                            merged[day] = [...merged[day], ...newItems];
                        }
                    }
                    return merged;
                });


                if (Object.keys(newData).length === 0) {
                    setHasMore(false);
                }
            } catch (err) {
                console.error("Erreur chargement des reports rageants:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [active, page]);

    const loadMore = () => {
        if (!loading && hasMore) setPage((prev) => prev + 1);
    };

    const reset = () => {
        setData({});
        setPage(1);
        setHasMore(true);
    };

    return { data, loading, hasMore, loadMore, reset };
};
