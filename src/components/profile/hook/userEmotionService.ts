import {
  getUserEmotionSummary,
  type UserEmotionSummary,
} from "@src/services/userEmotionService";
import { useEffect, useState } from "react";
import { useAuth } from "@src/services/AuthContext";

export function useUserEmotionSummary(type: "report" | "coupdecoeur" | null) {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<UserEmotionSummary | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!type || !isAuthenticated) {
      return;
    }

    let mounted = true;
    setLoading(true);

    getUserEmotionSummary(type)
      .then((res) => {
        if (mounted) setData(res);
      })
      .catch(() => {
        if (mounted) setData(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [type, isAuthenticated]);

  return { data, loading };
}
