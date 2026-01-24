import { useEffect, useState } from "react";
import { apiService } from "@src/services/apiService";

export function useBrandResponsesMap(reportIds: string[]) {
  const [map, setMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!reportIds || reportIds.length === 0) {
      setMap({});
      return;
    }

    let cancelled = false;

    const fetchMap = async () => {
      try {
        setLoading(true);
        const { data } = await apiService.post("/reports/brand-responses-map", {
          reportIds,
        });

        if (!cancelled) {
          setMap(data || {});
        }
      } catch (err) {
        console.error("❌ brand responses map error", err);
        if (!cancelled) setMap({});
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchMap();

    return () => {
      cancelled = true;
    };
  }, [reportIds.join(",")]); // 👈 important

  return { brandResponsesMap: map, loading };
}
