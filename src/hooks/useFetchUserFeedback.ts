import { useEffect, useState } from "react";
import type { FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import {
  getUserCoupsDeCoeur,
  getUserSuggestions,
} from "@src/services/feedbackService";

export const useFetchUserFeedback = (activeTab: FeedbackType) => {
  const [data, setData] = useState<(CoupDeCoeur | Suggestion)[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (activeTab === "coupdecoeur" || activeTab === "suggestion") {
        setLoading(true);
        try {
          if (activeTab === "coupdecoeur") {
            const res = await getUserCoupsDeCoeur(1, 50);
            setData(res.coupdeCoeurs || []);
          } else {
            const res = await getUserSuggestions(1, 50);
            setData(res.suggestions || []);
          }
        } catch (e) {
          console.error("Erreur fetch user feedback:", e);
          setData([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [activeTab]);

  return { data, loading };
};
