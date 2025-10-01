import { useMemo } from "react";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import type { FeedbackType } from "@src/components/user-profile/FeedbackTabs";

// 🔹 Utilitaire commun
const getSubCategoryLabel = (item: CoupDeCoeur | Suggestion): string => {
  const raw =
    (item as any).subCategory ??
    (item as any).subcategory ??
    (item as any).category ??
    (item as any).categorie ??
    (item as any).categoryName ??
    (item as any)["category_name"] ??
    "";
  return typeof raw === "string" ? raw.trim() : "";
};

export function useCategories(
  activeTab: FeedbackType,
  feedbackData: (CoupDeCoeur | Suggestion)[],
  selectedBrand: string,
) {
  const suggestionCategories = useMemo(() => {
    if (activeTab !== "suggestion" || !selectedBrand) return [];
    const set = new Set<string>();
    feedbackData.forEach(
      (i) => i.type === "suggestion" && set.add(getSubCategoryLabel(i)),
    );
    return Array.from(set).filter(Boolean).sort();
  }, [activeTab, feedbackData, selectedBrand]);

  const coupDeCoeurCategories = useMemo(() => {
    if (activeTab !== "coupdecoeur" || !selectedBrand) return [];
    const set = new Set<string>();
    feedbackData.forEach(
      (i) => i.type === "coupdecoeur" && set.add(getSubCategoryLabel(i)),
    );
    return Array.from(set).filter(Boolean).sort();
  }, [activeTab, feedbackData, selectedBrand]);

  return { suggestionCategories, coupDeCoeurCategories };
}
