import { getUserStatsSummary } from "@src/services/feedbackService";
import type { UserStatsSummary } from "@src/types/Reports";
import { useState, useEffect } from "react";

// ✅ Ajout explicite du type de retour
export const useUserStatsSummary = (
  enabled = true,
): {
  stats: UserStatsSummary | null;
  loading: boolean;
  error: string | null;
} => {
  const [stats, setStats] = useState<UserStatsSummary | null>(null);
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
        const data = await getUserStatsSummary();
        if (!isActive) return;
        setStats(data);
        setError(null);
      } catch (err) {
        if (!isActive) return;
        setError("Erreur lors du chargement des statistiques");
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
