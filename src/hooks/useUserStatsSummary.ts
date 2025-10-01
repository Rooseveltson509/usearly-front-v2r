import { getUserStatsSummary } from "@src/services/feedbackService";
import type { UserStatsSummary } from "@src/types/Reports";
import { useState, useEffect } from "react";

// ✅ Ajout explicite du type de retour
export const useUserStatsSummary = (): {
  stats: UserStatsSummary | null;
  loading: boolean;
  error: string | null;
} => {
  const [stats, setStats] = useState<UserStatsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUserStatsSummary();
        setStats(data);
      } catch (err) {
        setError("Erreur lors du chargement des statistiques");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
