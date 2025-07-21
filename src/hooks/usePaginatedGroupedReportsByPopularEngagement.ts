import { useState, useEffect, useCallback } from "react";
import { getGroupedReportsByPopularEngagement } from "@src/services/feedbackService";
import type { PopularGroupedReport } from "@src/types/Reports";

export const usePaginatedGroupedReportsByPopularEngagement = (filter: string, enabled: boolean) => {
  const [data, setData] = useState<Record<string, PopularGroupedReport[]>>({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && enabled) {
      setPage((p) => p + 1);
    }
  }, [loading, hasMore, enabled]);

  useEffect(() => {
    if (enabled) {
      setData({});
      setPage(1);
      setHasMore(true);
      setLoading(true);
    }
  }, [enabled, filter]);

  useEffect(() => {
    if (!enabled || !filter) return;

    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getGroupedReportsByPopularEngagement(page, 20);

        if (res.success) {
          setData((prev) => ({ ...prev, ...res.data }));
          setHasMore(page < res.totalPages);
        } else {
          setHasMore(false);
        }
      } catch (e) {
        console.error("popular-engagement error", e);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, enabled, filter]);

  return { data, loading, hasMore, loadMore };
};
