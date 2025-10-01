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

  // ✅ reset automatique quand on désactive le hook
  useEffect(() => {
    if (!enabled) {
      setData([]);
      setPage(1);
      setHasMore(true);
      setLoading(false);
    } else {
      // si on réactive → repartir proprement
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

          // 🔑 éviter doublons si l’API renvoie les mêmes
          setData((prev) => {
            const map = new Map<string, PopularReport>();
            [...prev, ...newData].forEach((item) => {
              map.set(`${item.reportingId}-${item.subCategory}`, item);
            });
            return Array.from(map.values());
          });

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

  const loadMore = useCallback(() => {
    if (!loading && hasMore && enabled) {
      setPage((p) => p + 1);
    }
  }, [loading, hasMore, enabled]);

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
  }, []);

  return { data, loading, hasMore, loadMore, reset };
};
