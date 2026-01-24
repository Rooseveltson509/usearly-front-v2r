import { useEffect, useState } from "react";
import { apiService } from "@src/services/apiService";

type BrandMessage = {
  id: string;
  message: string;
  createdAt: string;
  reportId: string;
};

export function useBrandResponse(reportIds: string[] = []) {
  const [brandMessage, setBrandMessage] = useState<BrandMessage | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("🟢 useBrandResponse effect", reportIds);
    if (!reportIds || reportIds.length === 0) {
      setBrandMessage(null);
      return;
    }

    let cancelled = false;

    async function fetchBrandMessage() {
      try {
        setLoading(true);

        for (const reportId of reportIds) {
          const res = await apiService.get(`/reports/${reportId}/messages`);

          if (res.data?.messages?.length > 0) {
            if (!cancelled) {
              setBrandMessage({
                ...res.data.messages[0],
                reportId,
              });
            }
            return; // 🛑 stop dès qu’on trouve une réponse marque
          }
        }

        if (!cancelled) {
          setBrandMessage(null);
        }
      } catch (err) {
        console.error("Erreur récupération réponse marque :", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBrandMessage();

    return () => {
      cancelled = true;
    };
  }, [reportIds]); // ✅ LA SEULE BONNE DÉPENDANCE

  return {
    brandMessage,
    loading,
  };
}
