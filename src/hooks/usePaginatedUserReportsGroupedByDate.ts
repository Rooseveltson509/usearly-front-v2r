import { useState, useEffect, useCallback, useRef } from "react";
import { getUserReportsGroupedByDate } from "@src/services/feedbackService";
import type {
  ExplodedGroupedReport,
  GetGroupedReportsByDateResponse,
} from "@src/types/Reports";
import { normalizeBrandResponse } from "@src/utils/brandResponse";

export const usePaginatedUserReportsGroupedByDate = (enabled: boolean) => {
  const [data, setData] = useState<Record<string, ExplodedGroupedReport[]>>({});
  /* const [data, setData] = useState<Record<string, UserReportGroupedByDate[]>>(
    {}
  ); */

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
      // Passage de false ➔ true : reset page avant chargement
      setPage(1);
      setData({});
      setHasMore(true);
    }
    previousEnabled.current = enabled;
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      setData({});
      setPage(1);
      setHasMore(true);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response: GetGroupedReportsByDateResponse =
          await getUserReportsGroupedByDate(page, 20);

        if (response.success) {
          const transformedData: Record<string, ExplodedGroupedReport[]> = {};
          Object.entries(response.data).forEach(([date, reports]) => {
            transformedData[date] = reports.map(
              (report): ExplodedGroupedReport => ({
                id: report.reportingId,
                reportingId: report.reportingId,
                marque: report.marque,
                siteUrl: report.siteUrl ?? null,
                capture: report.capture ?? null,
                category: report.category,
                totalCount: report.count,

                // ✅ AJOUT IMPORTANT
                hasBrandResponse: normalizeBrandResponse(
                  report.hasBrandResponse,
                  {
                    brand: report.marque,
                    siteUrl: report.siteUrl ?? null,
                  },
                ),

                subCategory: {
                  subCategory: report.subCategory,
                  status: report.status,
                  count: report.count,
                  descriptions: report.descriptions,
                },

                subCategories: [
                  {
                    subCategory: report.subCategory,
                    status: report.status,
                    count: report.count,
                    descriptions: report.descriptions,
                  },
                ],

                reactions: [],
                date,
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
        console.error(
          "❌ Erreur lors du chargement des reports user par date :",
          error,
        );
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, enabled]);

  return { data, loading, hasMore, loadMore };
};
