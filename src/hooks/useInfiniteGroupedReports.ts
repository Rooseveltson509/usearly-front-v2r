import { getUserProfileGroupedReports } from "@src/services/feedbackService";
import type { UserGroupedReport } from "@src/types/Reports";
import { useState, useEffect, useCallback } from "react";

export const useInfiniteGroupedReports = (limit = 10) => {
    const [reports, setReports] = useState<UserGroupedReport[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;

        console.log("loadMore called");

        setLoading(true);
        setError(null);

        try {
            const data = await getUserProfileGroupedReports(page, limit);

            setReports(prev => {
                const combined = [...prev, ...data.results];

                const uniqueMap = new Map();
                for (const item of combined) {
                    const key = `${item.marque}_${item.subCategory}`;
                    if (!uniqueMap.has(key)) {
                        uniqueMap.set(key, item);
                    }
                }

                const newUniqueReports = Array.from(uniqueMap.values());

                // ✅ Si aucune donnée nouvelle n'est ajoutée => stopper le scroll
                if (newUniqueReports.length === prev.length) {
                    setHasMore(false);
                } else {
                    setHasMore(data.currentPage < data.totalPages);
                    setPage(prevPage => prevPage + 1);
                }

                return newUniqueReports;
            });
        } catch (err: any) {
            setError(err.message || "Erreur lors du chargement.");
        } finally {
            setLoading(false);
        }
    }, [page, hasMore, loading, limit]);
    // Utilisation de useCallback pour éviter les re-renders inutiles

    // Charge la première page automatiquement
    useEffect(() => {
        loadMore();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { reports, loading, error, hasMore, loadMore };
};
