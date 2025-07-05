import { getUserProfileGroupedReports } from "@src/services/feedbackService";
import type { UserGroupedReport } from "@src/types/Reports";
import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Hook de scroll infini stable pour groupedReports
 * @param limit nombre d'éléments par page
 * @param resetKey clé de reset (ex: `${viewMode}-${selectedBrand}-${selectedCategory}`) pour reset automatique
 */
export const useInfiniteGroupedReports = (limit = 10, resetKey = "") => {
    const [reports, setReports] = useState<UserGroupedReport[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pageRef = useRef(1);
    const hasMoreRef = useRef(true);

    const loadMore = useCallback(async () => {
        if (loading || !hasMoreRef.current) return;

        console.log("loadMore called, page:", pageRef.current);

        setLoading(true);
        setError(null);

        try {
            const data = await getUserProfileGroupedReports(pageRef.current, limit);

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

                if (newUniqueReports.length === prev.length) {
                    hasMoreRef.current = false;
                    setHasMore(false);
                } else {
                    hasMoreRef.current = data.currentPage < data.totalPages;
                    setHasMore(data.currentPage < data.totalPages);
                    pageRef.current += 1;
                    setPage(pageRef.current);
                }

                return newUniqueReports;
            });
        } catch (err: any) {
            setError(err.message || "Erreur lors du chargement.");
        } finally {
            setLoading(false);
        }
    }, [limit, loading]);

    // RESET AUTOMATIQUE si resetKey change (ex: tab ou filtre)
    useEffect(() => {
        console.log("Reset triggered, resetKey:", resetKey);
        setReports([]);
        setPage(1);
        pageRef.current = 1;
        setHasMore(true);
        hasMoreRef.current = true;
        setLoading(false);

        // Recharger immédiatement
        loadMore();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetKey]);

    return { reports, loading, error, hasMore, loadMore };
};
