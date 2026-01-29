import { getUserProfileGroupedReports } from "@src/services/feedbackService";
import type { UserGroupedReport } from "@src/types/Reports";
import { normalizeBrandResponse } from "@src/utils/brandResponse";
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
      const normalizedResults: UserGroupedReport[] = data.results.map(
        (item: UserGroupedReport) => ({
          ...item,
          hasBrandResponse: normalizeBrandResponse(item.hasBrandResponse, {
            brand: item.marque,
            siteUrl: item.siteUrl ?? null,
          }),
        }),
      );

      setReports((prev) => {
        const combined = [...prev, ...normalizedResults];

        const uniqueMap = new Map();
        /*       for (const item of combined) {
          const key = `${item.marque}_${item.subCategory}`;
          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, item);
          }
        } */
        for (const item of combined) {
          const key = `${item.marque}_${item.subCategory}`;

          if (!uniqueMap.has(key)) {
            uniqueMap.set(key, {
              ...item,
              reportIds: [...(item.reportIds ?? [])],
            });
          } else {
            const existing = uniqueMap.get(key);

            uniqueMap.set(key, {
              ...existing,

              // ✅ fusion des reportIds SANS doublons
              reportIds: Array.from(
                new Set([
                  ...(existing.reportIds ?? []),
                  ...(item.reportIds ?? []),
                ]),
              ),

              // (optionnel mais propre)
              descriptions: Array.from(
                new Map(
                  [...existing.descriptions, ...item.descriptions].map((d) => [
                    d.id,
                    d,
                  ]),
                ).values(),
              ),
            });
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
