import { useState, useEffect, useCallback } from "react";
import { getGroupedReportsByHot } from "@src/services/feedbackService";
import type { PopularGroupedReport } from "@src/types/Reports";

export const usePaginatedGroupedReportsByHot = (filter: string, enabled: boolean) => {
 const [data, setData] = useState<Record<string, PopularGroupedReport[]>>({});
  const [page, setPage]   = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && enabled) setPage((p) => p + 1);
  }, [loading, hasMore, enabled]);

  useEffect(() => {
    if (enabled) {
      setData({});
      setPage(1);
      setHasMore(true);
      setLoading(true);
    }
  }, [enabled, filter]); // 🔁 remet à zéro si le filtre change

  useEffect(() => {
    if (!enabled || !filter) return;

    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getGroupedReportsByHot(page, 20, filter); // ⬅️ on passe le filtre ici

        console.log("res: ", res);
        if (res.success) {
          setData((prev) => ({ ...prev, ...res.data }));
          setHasMore(page < res.totalPages);
        } else setHasMore(false);
      } catch (e) {
        console.error("popular error", e);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, enabled, filter]); // ⬅️ on dépend aussi de `filter`

  return { data, loading, hasMore, loadMore };
};
