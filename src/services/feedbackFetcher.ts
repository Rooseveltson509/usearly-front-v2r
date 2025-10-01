import {
  getPopularCoupsDeCoeur,
  getEnflammesCoupsDeCoeur,
} from "./coupDeCoeurService";
import {
  getPublicCoupsDeCoeur,
  getPublicSuggestions,
} from "@src/services/feedbackService";
import type { FeedbackType, CoupDeCoeur, Suggestion } from "@src/types/Reports";

type FetchResult = {
  data: (CoupDeCoeur | Suggestion)[];
};

export const fetchFeedbackData = async (
  filter: string,
  tab: FeedbackType,
  page = 1,
  limit = 10,
): Promise<FetchResult> => {
  let res;

  if (tab === "coupdecoeur") {
    switch (filter) {
      case "popular":
        res = await getPopularCoupsDeCoeur(page, limit);
        break;
      case "enflammes":
        res = await getEnflammesCoupsDeCoeur(page, limit);
        break;
      default:
        res = await getPublicCoupsDeCoeur(page, limit);
    }
    return { data: res?.coupdeCoeurs || [] };
  }

  if (tab === "suggestion") {
    res = await getPublicSuggestions(page, limit);
    return { data: res?.suggestions || [] };
  }

  return { data: [] };
};
