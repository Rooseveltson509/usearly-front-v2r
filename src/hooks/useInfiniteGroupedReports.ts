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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const isMounted = useRef(false);
  const loadingRef = useRef(false); // empêche double loadMore

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    console.log("[loadMore] page:", pageRef.current);

    try {
      const data = await getUserProfileGroupedReports(pageRef.current, limit);

      setReports((prev) => {
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
          const stillHasMore = data.currentPage < data.totalPages;
          hasMoreRef.current = stillHasMore;
          setHasMore(stillHasMore);
          pageRef.current += 1;
        }

        return newUniqueReports;
      });
    } catch (err: any) {
      console.error("[useInfiniteGroupedReports] Error:", err);
      setError(err.message || "Erreur lors du chargement.");
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [limit]);

  // Reset automatique lorsque resetKey change
  useEffect(() => {
    console.log(
      "[useInfiniteGroupedReports] Reset triggered, resetKey:",
      resetKey,
    );

    setReports([]);
    setLoading(false);
    setError(null);
    setHasMore(true);

    pageRef.current = 1;
    hasMoreRef.current = true;
    loadingRef.current = false;

    if (isMounted.current) {
      loadMore(); // recharge immédiatement après reset
    } else {
      isMounted.current = true;
    }
  }, [resetKey, loadMore]);

  return { reports, loading, error, hasMore, loadMore };
};
