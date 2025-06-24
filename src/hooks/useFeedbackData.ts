import { useEffect, useState, useRef } from "react";
import {
  getGroupedReportsByUser,
  getGroupedReportsPublic,
  getPublicCoupsDeCoeur,
  getPublicSuggestions,
  getUserCoupsDeCoeur,
  getUserSuggestions,
  getFilteredReportDescriptions,
} from "@src/services/feedbackService";
import { apiService } from "@src/services/apiService";
import { mapDescriptionToGroupedReport } from "@src/utils/mapDescriptionToReport";
import type { FeedbackDescription } from "@src/types/Reports";
import type { FeedbackType } from "@src/components/user-profile/FeedbackTabs";

const limit = 10;

interface FeedbackState {
  data: any[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}

interface Props {
  activeTab: FeedbackType;
  isPublic: boolean;
  viewMode: string;
  isAuthenticated: boolean;
  loaderRef: React.RefObject<HTMLDivElement | null>;
  selectedBrand: string;
  selectedCategory: string;
  brandInput: string;
}

export const useFeedbackData = ({
  activeTab,
  isPublic,
  viewMode,
  isAuthenticated,
  loaderRef,
  selectedBrand,
  selectedCategory,
  brandInput,
}: Props) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const [feedbackStates, setFeedbackStates] = useState<Record<FeedbackType, FeedbackState>>({
    report: { data: [], page: 1, hasMore: true, loading: false, error: null },
    coupdecoeur: { data: [], page: 1, hasMore: true, loading: false, error: null },
    suggestion: { data: [], page: 1, hasMore: true, loading: false, error: null },
  });

  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const currentState = feedbackStates[activeTab];

  const updateState = (updates: Partial<FeedbackState>) => {
    setFeedbackStates((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], ...updates },
    }));
  };

  // Charger les catégories selon la marque sélectionnée
  useEffect(() => {
    if (!selectedBrand) return;

    const fetchCategories = async () => {
      try {
        const res = await apiService.get("/reportings/categories-by-brand", {
          params: { brand: selectedBrand },
        });
        setAvailableCategories(res.data.categories || []);
      } catch {
        setAvailableCategories([]);
      }
    };

    fetchCategories();
  }, [selectedBrand]);

  // Suggestions de marques selon l’input
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!brandInput.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await apiService.get("/reportings/brand-suggestions", {
          params: { query: brandInput },
        });
        setSuggestions(res.data || []);
      } catch {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [brandInput]);

useEffect(() => {
  setFeedbackStates((prev) => ({
    ...prev,
    [activeTab]: {
      page: 1,
      data: [],
      hasMore: true,
      loading: false,
      error: null,
    }
  }));
}, [activeTab]);

  // Charger les feedbacks
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || currentState.loading || !currentState.hasMore) return;
      updateState({ loading: true, error: null });

      try {
        let newData: any[] = [];

        if (activeTab === "report") {
          if (viewMode === "chrono") {
            const brand = selectedBrand || "all";
            const category = selectedCategory || "all";
            const res = await getFilteredReportDescriptions(brand, category, currentState.page, limit);
            const valid = res.data.filter((desc: FeedbackDescription) => !!desc.createdAt);
            newData = valid.map((desc: FeedbackDescription) => mapDescriptionToGroupedReport(desc));
          } else {
            const res = isPublic
              ? await getGroupedReportsPublic(currentState.page, limit)
              : await getGroupedReportsByUser(currentState.page, limit);
            newData = res.results;
          }
        } else if (activeTab === "coupdecoeur") {
          const res = isPublic
            ? await getPublicCoupsDeCoeur(currentState.page, limit)
            : await getUserCoupsDeCoeur(currentState.page, limit);
          newData = res.coupdeCoeurs;
        } else if (activeTab === "suggestion") {
          const res = isPublic
            ? await getPublicSuggestions(currentState.page, limit)
            : await getUserSuggestions(currentState.page, limit);
          newData = res.suggestions;
        }

        updateState({
          data: [...currentState.data, ...newData],
          hasMore: newData.length === limit,
          loading: false,
        });
      } catch (err: any) {
        updateState({ error: err.message || "Erreur de chargement", loading: false });
      }
    };

    fetchData();
  }, [currentState.page, activeTab, viewMode, selectedBrand, selectedCategory]);

  // Scroll infini
  useEffect(() => {
    if (!loaderRef.current || !currentState.hasMore || currentState.loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !currentState.loading && currentState.hasMore) {
        updateState({ page: currentState.page + 1 });
      }
    });
    observer.current.observe(loaderRef.current);
    return () => observer.current?.disconnect();
  }, [currentState.data.length, currentState.loading, currentState.hasMore]);

  const handleSelectSuggestion = (brand: string) => {
    setSuggestions([]); // Reset des suggestions après sélection
  };

  return {
    currentState,
    availableCategories,
    suggestions,
    handleSelectSuggestion,
  };
};
