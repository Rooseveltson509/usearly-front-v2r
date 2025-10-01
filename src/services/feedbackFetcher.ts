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
): Promise<FetchResult> => {
  let res;

  if (tab === "coupdecoeur") {
    switch (filter) {
      case "popular":
        res = await getPopularCoupsDeCoeur(1, 50);
        break;
      case "enflammes":
        res = await getEnflammesCoupsDeCoeur(1, 50);
        break;
      default:
        res = await getPublicCoupsDeCoeur(1, 50);
    }
    return { data: res?.coupdeCoeurs || [] };
  }

  if (tab === "suggestion") {
    res = await getPublicSuggestions(1, 50);
    return { data: res?.suggestions || [] };
  }

  return { data: [] };
};
