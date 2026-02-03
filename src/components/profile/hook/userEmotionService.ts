import {
  getUserEmotionSummary,
  type UserEmotionSummary,
} from "@src/services/userEmotionService";
import { useEffect, useState } from "react";

export function useUserEmotionSummary(type: "report" | "coupdecoeur" | null) {
  const [data, setData] = useState<UserEmotionSummary | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!type) {
      setData(null);
      return;
    }

    let mounted = true;
    setLoading(true);

    getUserEmotionSummary(type)
      .then((res) => {
        if (mounted) setData(res);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [type]);

  return { data, loading };
}
