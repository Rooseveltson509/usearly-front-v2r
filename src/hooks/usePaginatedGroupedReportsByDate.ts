import { useState, useEffect, useCallback } from "react";
import { getGroupedReportsByDate } from "@src/services/feedbackService";
import type {
  ExplodedGroupedReport,
  GetGroupedReportsByDateResponse,
  PublicGroupedReportFromAPI,
} from "@src/types/Reports";

export const usePaginatedGroupedReportsByDate = (
  enabled: boolean,
  pageSize = 20,
) => {
  const [data, setData] = useState<Record<string, ExplodedGroupedReport[]>>({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && enabled) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore, enabled]);

  // ✅ reset complet quand on change `enabled`
  useEffect(() => {
    if (!enabled) {
      setData({});
      setPage(1);
      setHasMore(true);
      setLoading(false);
    } else {
      // si on réactive → repartir proprement
      setData({});
      setPage(1);
      setHasMore(true);
      setLoading(true); // affiche le loader direct
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response: GetGroupedReportsByDateResponse =
          await getGroupedReportsByDate(page, pageSize);

        if (response.success) {
          const transformedData: Record<string, ExplodedGroupedReport[]> = {};

          Object.entries(response.data).forEach(([date, reports]) => {
            transformedData[date] = reports.map(
              (report: PublicGroupedReportFromAPI) => ({
                id: report.reportingId,
                reportingId: report.reportingId,
                category: report.category,
                marque: report.marque,
                totalCount: report.count,
                subCategory: {
                  subCategory: report.subCategory,
                  count: report.count,
                  descriptions: report.descriptions,
                },
                subCategories: [
                  {
                    subCategory: report.subCategory,
                    count: report.count,
                    descriptions: report.descriptions,
                  },
                ],
                reactions: [],
              }),
            );
          });

          setData((prev) => ({
            ...prev,
            ...transformedData,
          }));

          setHasMore(page < response.totalPages);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("❌ Erreur chargement reports par date:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, enabled, pageSize]);

  const reset = useCallback(() => {
    setData({});
    setPage(1);
    setHasMore(true);
  }, []);

  return { data, loading, hasMore, loadMore, reset };
};
