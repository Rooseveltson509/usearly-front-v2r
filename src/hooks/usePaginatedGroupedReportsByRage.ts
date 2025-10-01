import { useEffect, useState } from "react";
import { getRageReports } from "@src/services/feedbackService";
import type { ConfirmedSubcategoryReport } from "@src/types/Reports";

export const usePaginatedGroupedReportsByRage = (
  active: boolean,
  pageSize = 10,
) => {
  const [data, setData] = useState<ConfirmedSubcategoryReport[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!active) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getRageReports(page, pageSize);
        const newData: ConfirmedSubcategoryReport[] = res.data || [];

        setData((prev) => {
          const map = new Map<string, ConfirmedSubcategoryReport>();

          // On garde l’ancien contenu
          prev.forEach((item) => {
            const key = `${item.reportingId}-${item.subCategory}`;
            map.set(key, item);
          });

          // On ajoute les nouveaux sans dupliquer
          newData.forEach((item) => {
            const key = `${item.reportingId}-${item.subCategory}`;
            map.set(key, item);
          });

          return Array.from(map.values());
        });

        if (newData.length < pageSize) {
          setHasMore(false);
        }
      } catch (err) {
        console.error("❌ Erreur chargement des reports rageants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [active, page, pageSize]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const reset = () => {
    setData([]);
    setPage(1);
    setHasMore(true);
  };

  return { data, loading, hasMore, loadMore, reset };
};
