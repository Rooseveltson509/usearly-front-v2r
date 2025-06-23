import { useEffect, useRef, useState } from "react";
import { useAuth } from "@src/services/AuthContext";
import type { FeedbackType } from "./FeedbackTabs";
import {
  getGroupedReportsByUser,
  getGroupedReportsPublic,
  getPublicCoupsDeCoeur,
  getPublicSuggestions,
  getUserCoupsDeCoeur,
  getUserSuggestions,
  getFilteredReportDescriptions,
} from "@src/services/feedbackService";
import ReportCard from "./ReportCard";
import "./FeedbackList.scss";
import FeedbackListHeader from "../report-grouped/feedback-list-header/FeedbackListHeader";
import LoaderBlock from "../report-grouped/LoaderBlock";
import type { ExplodedGroupedReport, FeedbackDescription } from "@src/types/Reports";
import { apiService } from "@src/services/apiService";
import { mapDescriptionToGroupedReport } from "@src/utils/mapDescriptionToReport";
import FeedbackView from "../feedbacks/FeedbackView";
import FilterForm from "../feedbacks/FilterForm";
import { explodeGroupedReports, groupByDate } from "@src/utils/feedbackListUtils";

const limit = 10;

interface Props {
  activeTab: FeedbackType;
  isPublic?: boolean;
}

interface FeedbackState {
  data: any[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}

const FeedbackList = ({ activeTab, isPublic = false }: Props) => {
  const { isAuthenticated } = useAuth();
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [groupOpen, setGroupOpen] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"grouped" | "flat" | "chrono" | "filtered">("grouped");
  const [displayMode, setDisplayMode] = useState<"flat" | "chrono" | "filtered">("flat");
  const [feedbackStates, setFeedbackStates] = useState<Record<FeedbackType, FeedbackState>>({
    report: { data: [], page: 1, hasMore: true, loading: false, error: null },
    coupdecoeur: { data: [], page: 1, hasMore: true, loading: false, error: null },
    suggestion: { data: [], page: 1, hasMore: true, loading: false, error: null },
  });
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [brandInput, setBrandInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const hasInitializedViewMode = useRef(false);
  const currentState = feedbackStates[activeTab];

  const updateState = (updates: Partial<FeedbackState>) => {
    setFeedbackStates((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], ...updates },
    }));
  };

  useEffect(() => {
    if (!hasInitializedViewMode.current) {
      if (activeTab === "report") {
        setViewMode("grouped");
        setDisplayMode("flat");
      } else {
        setViewMode("flat");
      }
      hasInitializedViewMode.current = true;
    }
  }, [activeTab]);

  useEffect(() => {
    if (!isAuthenticated || activeTab !== "report" || viewMode !== "grouped") return;

    const fetchMultiplePages = async () => {
      let allData: ExplodedGroupedReport[] = [];
      for (let p = 1; p <= 3; p++) {
        try {
          const res = isPublic
            ? await getGroupedReportsPublic(p, limit)
            : await getGroupedReportsByUser(p, limit);
          allData = [...allData, ...res.results];
          if (res.results.length < limit) break;
        } catch (e) {
          console.warn("Erreur préchargement page", p);
          break;
        }
      }

      setFeedbackStates((prev) => ({
        ...prev,
        report: {
          ...prev.report,
          data: allData,
          page: allData.length === 0 ? 1 : Math.ceil(allData.length / limit),
          hasMore: allData.length >= limit * 3,
          loading: false,
          error: null,
        },
      }));
    };

    fetchMultiplePages();
  }, [isAuthenticated, activeTab, viewMode, isPublic]);

  useEffect(() => {
    const fetchBrands = async () => {
      const res = await apiService.get("/reportings/brands");
      setAvailableBrands(res.data.brands || []);
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const filtered = availableBrands.filter((b) =>
      b.toLowerCase().includes(brandInput.toLowerCase())
    );
    setSuggestions(filtered);
  }, [brandInput, availableBrands]);

  useEffect(() => {
    if (!selectedBrand) return;
    const fetchCategories = async () => {
      try {
        const res = await apiService.get("/reportings/categories-by-brand", {
          params: { brand: selectedBrand },
        });
        setAvailableCategories(res.data.categories || []);
      } catch (err) {
        console.error("Erreur récupération catégories :", err);
        setAvailableCategories([]);
      }
    };
    fetchCategories();
  }, [selectedBrand]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || currentState.loading || !currentState.hasMore) return;
      updateState({ loading: true, error: null });
      try {
        let newData: any[] = [];
        if (activeTab === "report") {
          // seulement si mode filtré (cas particulier)
          if (displayMode === "filtered") {
            const res = await getFilteredReportDescriptions("all", "all", currentState.page, limit);
            const validDescriptions = res.data.filter(
              (desc: FeedbackDescription) => !!desc.createdAt && desc.createdAt !== ""
            );
            newData = validDescriptions.map(mapDescriptionToGroupedReport);
          } else {
            const res = isPublic
              ? await getGroupedReportsPublic(currentState.page, limit)
              : await getGroupedReportsByUser(currentState.page, limit);
            newData = res.results;
          }
        } else if (activeTab === "coupdecoeur") {
          const res = isPublic ? await getPublicCoupsDeCoeur(currentState.page, limit) : await getUserCoupsDeCoeur(currentState.page, limit);
          newData = res.coupdeCoeurs;
        } else if (activeTab === "suggestion") {
          const res = isPublic ? await getPublicSuggestions(currentState.page, limit) : await getUserSuggestions(currentState.page, limit);
          newData = res.suggestions;
        }
        updateState({ data: [...currentState.data, ...newData], hasMore: newData.length === limit, loading: false });
      } catch (err: any) {
        updateState({ error: err.message || "Erreur de chargement", loading: false });
      }
    };
    fetchData();
  }, [currentState.page, activeTab, displayMode]);

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

  const getDisplayData = (): any[] => {
    if (activeTab === "report") {
      // Pour "filtered", on garde les descriptions individuelles (déjà mapées dans fetchData)
      if (displayMode === "filtered") {
        return currentState.data;
      }

      // Pour "flat" et "chrono", on ne touche pas aux données groupées
      return currentState.data;
    }

    // Pour coup de cœur / suggestion
    return currentState.data;
  };


  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const handleSelectSuggestion = (brand: string) => {
    setSelectedBrand(brand);
    setBrandInput(brand);
    setSuggestions([]);
  };


  return (
    <div className="feedback-list">
      <FeedbackListHeader
        viewMode={displayMode}
        onChange={setDisplayMode}
        activeTab={activeTab}
      />


      {activeTab === "report" && displayMode === "filtered" && (
        <FilterForm
          brandInput={brandInput}
          setBrandInput={setBrandInput}
          suggestions={suggestions}
          handleSelectSuggestion={handleSelectSuggestion}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          availableCategories={availableCategories}
        />
      )}

      <FeedbackView
        activeTab={activeTab}
        viewMode={displayMode}
        currentState={{ ...currentState, data: getDisplayData() }}
        openId={openId}
        setOpenId={setOpenId}
        groupOpen={groupOpen}
        setGroupOpen={setGroupOpen}
        selectedBrand={selectedBrand}
        selectedCategory={selectedCategory}
        renderCard={(item: ExplodedGroupedReport) => {
          const cardId = `${item.reportingId}_${item.subCategory?.descriptions?.[0]?.id || "0"}`;
          return (
            <ReportCard
              key={cardId}
              report={{ ...item, subCategories: [item.subCategory] }}
              isOpen={openId === cardId}
              onToggle={() => handleToggle(cardId)}
            />
          );
        }}
      />

      <LoaderBlock
        loaderRef={loaderRef}
        loading={currentState.loading}
        hasMore={currentState.hasMore}
        error={currentState.error}
      />
    </div>
  );
};

export default FeedbackList;