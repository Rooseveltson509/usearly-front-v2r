import { useState, useEffect, useCallback, useRef } from "react";
import { getUserProfileGroupedReports } from "@src/services/feedbackService";
import type { UserGroupedReport } from "@src/types/Reports";

export const usePaginatedUserReportsGroupedByBrand = (enabled: boolean) => {
    const [data, setData] = useState<UserGroupedReport[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const previousEnabled = useRef(enabled);

    const loadMore = useCallback(() => {
        if (!loading && hasMore && enabled) {
            setPage((prev) => prev + 1);
        }
    }, [loading, hasMore, enabled]);

    useEffect(() => {
        if (!previousEnabled.current && enabled) {
            setPage(1);
            setData([]);
            setHasMore(true);
        }
        previousEnabled.current = enabled;
    }, [enabled]);

    useEffect(() => {
        if (!enabled) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getUserProfileGroupedReports(page, 20);
                setData((prev) => page === 1 ? res.results : [...prev, ...res.results]);
                setHasMore(page < res.totalPages);
            } catch (error) {
                console.error("❌ Erreur lors du chargement des reports user par brand:", error);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, enabled]);

    return { data, loading, hasMore, loadMore };
};