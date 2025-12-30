import { useEffect, useState } from "react";
import type {
  FeedbackType,
  GetGroupedReportsByDateResponse,
  PublicGroupedReportFromAPI,
  CoupDeCoeur,
  Suggestion,
} from "@src/types/Reports";
import {
  getUserCoupsDeCoeur,
  getUserReportsGroupedByDate,
  getUserSuggestions,
} from "@src/services/feedbackService";

const DEFAULT_WEEKS = 4;
const PAGE_LIMIT = 50;

const parseDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const datePart = value.split("T")[0];
  const parts = datePart.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts.map(Number);
    if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
      return new Date(year, month - 1, day);
    }
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const sumReportsInRange = (
  data: Record<string, PublicGroupedReportFromAPI[]>,
  cutoffTime: number,
) => {
  let total = 0;

  for (const [dateKey, items] of Object.entries(data)) {
    for (const item of items) {
      const dateValue = item.date || dateKey;
      const parsedDate = parseDate(dateValue);
      if (!parsedDate) continue;
      if (parsedDate.getTime() >= cutoffTime) {
        total += item.count ?? 0;
      }
    }
  }

  return total;
};

const sumItemsInRange = (
  items: (CoupDeCoeur | Suggestion)[],
  cutoffTime: number,
) => {
  let total = 0;

  for (const item of items) {
    const parsedDate = parseDate(item.createdAt);
    if (!parsedDate) continue;
    if (parsedDate.getTime() >= cutoffTime) {
      total += 1;
    }
  }

  return total;
};

export const useUserFeedbackCountLastWeeks = (
  activeTab: FeedbackType,
  weeks = DEFAULT_WEEKS,
  enabled = true,
) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setCount(0);
      setLoading(false);
      setError(null);
      return;
    }

    let isActive = true;
    const weeksToUse = Math.max(0, weeks);
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - weeksToUse * 7);
    const cutoffTime = cutoff.getTime();

    const fetchCount = async () => {
      try {
        setLoading(true);
        setError(null);

        let total = 0;

        if (activeTab === "report") {
          let page = 1;
          let totalPages = 1;

          do {
            const response: GetGroupedReportsByDateResponse =
              await getUserReportsGroupedByDate(page, PAGE_LIMIT);

            if (!response.success) break;

            total += sumReportsInRange(response.data, cutoffTime);
            totalPages = response.totalPages || 1;
            page += 1;
          } while (page <= totalPages);
        }

        if (activeTab === "coupdecoeur") {
          let page = 1;
          let totalPages = 1;

          do {
            const response = await getUserCoupsDeCoeur(page, PAGE_LIMIT);
            total += sumItemsInRange(response.coupdeCoeurs || [], cutoffTime);
            totalPages = response.totalPages || 1;
            page += 1;
          } while (page <= totalPages);
        }

        if (activeTab === "suggestion") {
          let page = 1;
          let totalPages = 1;

          do {
            const response = await getUserSuggestions(page, PAGE_LIMIT);
            total += sumItemsInRange(response.suggestions || [], cutoffTime);
            totalPages = response.totalPages || 1;
            page += 1;
          } while (page <= totalPages);
        }

        if (isActive) {
          setCount(total);
        }
      } catch (err) {
        if (isActive) {
          setError("Erreur lors du chargement du compteur");
          console.error(err);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchCount();

    return () => {
      isActive = false;
    };
  }, [activeTab, weeks, enabled]);

  return { count, loading, error };
};
