import { getWeeklyGlobalFeedbackStats } from "@src/services/feedbackService";
import type { GlobalFeedbackStats } from "@src/types/Reports";
import { useState, useEffect } from "react";

export const useWeeklyGlobalFeedbackStats = (
  enabled = true,
): {
  stats: GlobalFeedbackStats | null;
  loading: boolean;
  error: string | null;
} => {
  const [stats, setStats] = useState<GlobalFeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let isActive = true;
    setLoading(true);

    const fetchStats = async () => {
      try {
        const data = await getWeeklyGlobalFeedbackStats();
        if (!isActive) return;
        setStats(data);
        setError(null);
      } catch (err) {
        if (!isActive) return;
        setError("Erreur lors du chargement des statistiques hebdomadaires");
        console.error(err);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isActive = false;
    };
  }, [enabled]);

  return { stats, loading, error };
};
