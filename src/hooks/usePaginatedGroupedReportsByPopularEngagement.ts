import { useState, useEffect, useCallback } from "react";
import { getGroupedReportsByPopularEngagement } from "@src/services/feedbackService";

interface PopularReport {
  id: string;
  reportingId: string;
  subCategory: string;
  description: string;
  siteUrl: string | null;
  marque: string;
  category: string;
  capture: string | null;
  createdAt: string;
  user: {
    id: string;
    pseudo: string;
    avatar: string | null;
  } | null;
  reactions: any[];
  comments: any[];
  stats: {
    totalReactions: number;
    totalComments: number;
    totalInteractions: number;
  };
}

export const usePaginatedGroupedReportsByPopularEngagement = (
  enabled: boolean,
  pageSize = 20,
) => {
  const [data, setData] = useState<PopularReport[]>([]);
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
      setData([]);
      setPage(1);
      setHasMore(true);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getGroupedReportsByPopularEngagement(page, pageSize);

        if (res.success) {
          const newData: PopularReport[] = res.data || [];
          setData((prev) => [...prev, ...newData]);
          setHasMore(page < res.totalPages);
        } else {
          setHasMore(false);
        }
      } catch (e) {
        console.error("❌ popular reports error", e);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, enabled, pageSize]);

  return { data, loading, hasMore, loadMore };
};
