import { useState, useEffect, useMemo, useRef } from "react";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import type { FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import {
  getCoupsDeCoeurByBrand,
  getSuggestionsByBrand,
} from "@src/services/coupDeCoeurService";
import { fetchFeedbackData } from "@src/services/feedbackFetcher";

// 🔹 Utilitaire pour éviter les erreurs TS
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

const normalizeText = (value: string) =>
  value
    ? value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
    : "";

export function useFeedbackData(
  activeTab: FeedbackType,
  activeFilter: string,
  selectedBrand: string,
  selectedCategory: string,
  suggestionSearch: string,
  page = 1,
  limit = 20,
) {
  const [feedbackData, setFeedbackData] = useState<
    (CoupDeCoeur | Suggestion)[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // ⚡ Cache local { "tab-filter-brand" : data[] }
  const cache = useRef<{ [key: string]: (CoupDeCoeur | Suggestion)[] }>({});

  useEffect(() => {
    let isMounted = true;

    // 🚫 Si onglet = "report" → on sort direct (pas de fetch ici)
    if (activeTab === "report") {
      return;
    }

    const key = `${activeTab}-${activeFilter}-${selectedBrand || "all"}-${page}-${limit}`;

    // ⚡ Vérifier dans le cache
    if (cache.current[key]) {
      setFeedbackData(cache.current[key]);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        let result: any;

        if (selectedBrand) {
          // 🔹 Cas marque spécifique
          if (activeTab === "coupdecoeur") {
            result = await getCoupsDeCoeurByBrand(selectedBrand, page, limit);
            if (isMounted) {
              const typed = (result?.coupdeCoeurs || []).map((item: any) => ({
                ...item,
                type: item.type ?? "coupdecoeur",
              }));
              cache.current[key] = typed;
              setFeedbackData(typed);
            }
          } else if (activeTab === "suggestion") {
            result = await getSuggestionsByBrand(selectedBrand, page, limit);
            if (isMounted) {
              const typed = (result?.suggestions || []).map((item: any) => ({
                ...item,
                type: item.type ?? "suggestion",
              }));
              cache.current[key] = typed;
              setFeedbackData(typed);
            }
          }
        } else {
          // 🔹 Cas générique (pas de marque)
          result = await fetchFeedbackData(
            activeFilter,
            activeTab,
            page,
            limit,
          );
          if (isMounted) {
            let data = result.data || [];
            if (activeTab === "coupdecoeur") {
              data = data.map((item: any) => ({
                ...item,
                type: "coupdecoeur",
              }));
            } else if (activeTab === "suggestion") {
              data = data.map((item: any) => ({ ...item, type: "suggestion" }));
            }
            cache.current[key] = data;
            setFeedbackData(data);
          }
        }
      } catch (e) {
        console.error("❌ Erreur chargement feedback:", e);
        if (isMounted) setFeedbackData([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [activeTab, activeFilter, selectedBrand, page, limit]);

  // 🎯 Suggestions filtrées
  const suggestionsForDisplay = useMemo(() => {
    if (activeTab !== "suggestion") return feedbackData;
    const query = normalizeText(suggestionSearch);
    return feedbackData.filter((item) => {
      if ((item as any).type !== "suggestion") return true;
      const haystacks = [
        (item as any).title,
        (item as any).description,
        (item as any).marque,
        getSubCategoryLabel(item),
      ];
      return haystacks.some((t) => normalizeText(t ?? "").includes(query));
    });
  }, [activeTab, feedbackData, suggestionSearch]);

  // 🎯 CDC filtrés
  const coupDeCoeursForDisplay = useMemo(() => {
    if (activeTab !== "coupdecoeur") return feedbackData;
    if (!selectedCategory) return feedbackData;
    return feedbackData.filter((i) => {
      if ((i as any).type !== "coupdecoeur") return true;
      return getSubCategoryLabel(i) === selectedCategory;
    });
  }, [activeTab, feedbackData, selectedCategory]);

  // ✅ Compteur d’éléments affichés
  const displayedCount = useMemo(() => {
    if (activeTab === "suggestion") return suggestionsForDisplay.length;
    if (activeTab === "coupdecoeur") return coupDeCoeursForDisplay.length;
    return feedbackData.length;
  }, [activeTab, suggestionsForDisplay, coupDeCoeursForDisplay, feedbackData]);

  return {
    feedbackData,
    isLoading,
    displayedCount,
    suggestionsForDisplay,
    coupDeCoeursForDisplay,
  };
}
