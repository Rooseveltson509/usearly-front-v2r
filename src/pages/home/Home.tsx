import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./Home.scss";
import FeedbackTabs, { type FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import UserStatsCard from "@src/components/user-profile/UserStatsCard";
import HomeGroupedReportsList from "./HomeGroupedReportsList";
import FeedbackView from "@src/components/feedbacks/FeedbackView";
import {
  getGroupedReportsByHot,
  getPublicCoupsDeCoeur,
  getPublicSuggestions,
} from "@src/services/feedbackService";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import { getCoupsDeCoeurByBrand, getSuggestionsByBrand } from "@src/services/coupDeCoeurService";
import { fetchFeedbackData } from "@src/services/feedbackFetcher";
import PurpleBanner from "./components/purpleBanner/PurpleBanner";
import { brandColors } from "@src/utils/brandColors";
import { hexToRgba } from "@src/utils/colorUtils";
import { fetchValidBrandLogo } from "@src/utils/brandLogos";

// 🖼️ Assets
import cdcImgSide from "/assets/img-banner/banner-cdc-pop.png"
import bulleIcon from "/assets/images/bulle-top-bar.png";
import emojiIcon from "/assets/images/emoji-top-bar.png";
import chatIcon from "/assets/images/chat-top-bar.svg";
import big from "/assets/images/big.svg";
import medium from "/assets/images/medium.svg";
import small from "/assets/images/small.svg";

// 🧩 Composants spécifiques
import HomeFiltersCdc from "./HomeFiltersCdc";
import HomeFiltersSuggestion from "./HomeFiltersSuggestion";
import FilterIllustration from "./home-illustration/FilterIllustration";

const normalizeText = (value: string) =>
  value
    ? value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[’']/g, "'")
        .replace(/[^a-z0-9'\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : "";

function Home() {
  const [activeTab, setActiveTab] = useState<FeedbackType>("report");
  const [feedbackData, setFeedbackData] = useState<(CoupDeCoeur | Suggestion)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeFilter, setActiveFilter] = useState("confirmed");
  const [viewMode, setViewMode] = useState<"flat" | "chrono" | "confirmed">("confirmed");
  const [selectedSiteUrl, setSelectedSiteUrl] = useState<string | undefined>();
  const [suggestionSearch, setSuggestionSearch] = useState("");
  const [selectedBrandLogo, setSelectedBrandLogo] = useState<string | null>(null);

  const [availableFilters, setAvailableFilters] = useState<string[]>([
    "hot", // 👉 affiché en premier
    "chrono",
    "rage",
    "popular",
    "urgent",
  ]);

  const normalizedSelectedBrand = useMemo(() => selectedBrand.trim().toLowerCase(), [selectedBrand]);
  const selectedBrandBaseColor = useMemo(() => {
    if (!normalizedSelectedBrand) return null;
    return brandColors[normalizedSelectedBrand] || brandColors.default;
  }, [normalizedSelectedBrand]);

  const brandBannerStyle = useMemo(() => {
    if (!selectedBrandBaseColor) return undefined;

    return {
      "--brand-banner-bg": hexToRgba(selectedBrandBaseColor, 0.18),
      "--brand-banner-border": hexToRgba(selectedBrandBaseColor, 0.3),
      "--brand-banner-accent": selectedBrandBaseColor,
      "--filtered-banner-bg": hexToRgba(selectedBrandBaseColor, 0.12),
    } as React.CSSProperties;
  }, [selectedBrandBaseColor]);

  const handleSuggestionBrandChange = useCallback(
    (brand: string) => {
      setSelectedBrand(brand);
      setSuggestionSearch("");

      if (brand) {
        setActiveFilter("brandSolo");
      } else {
        setActiveFilter("allSuggest");
      }
    },
    [setActiveFilter, setSelectedBrand]
  );

  useEffect(() => {
    if (!selectedBrand) {
      setSuggestionSearch("");
    }
  }, [selectedBrand]);

  const suggestionBannerStyle = useMemo(() => {
    const fallback = "#F1E9FF";
    if (activeTab !== "suggestion") {
      return {
        "--suggestion-bg": hexToRgba(fallback, 1),
        "--suggestion-border": hexToRgba(fallback, 0),
        "--suggestion-accent": fallback,
      } as React.CSSProperties;
    }

    const firstItem = feedbackData[0];
    const brandKey = (selectedBrand || firstItem?.marque || "").toLowerCase();
    const baseColor = brandColors[brandKey] || fallback;

    if(baseColor === fallback) {
      return {
        "--suggestion-bg": hexToRgba(baseColor, 1),
        "--suggestion-border": hexToRgba(baseColor, 0),
        "--suggestion-accent": baseColor,
      } as React.CSSProperties;
    }

    return {
      "--suggestion-bg": hexToRgba(baseColor, 0.15),
      "--suggestion-border": hexToRgba(baseColor, 0),
      "--suggestion-accent": baseColor,
    } as React.CSSProperties;
  }, [activeTab, feedbackData, selectedBrand]);

  const selectedBrandSiteUrl = useMemo(() => {
    if (!selectedBrand) return undefined;
    if (selectedSiteUrl) return selectedSiteUrl;
    const normalized = selectedBrand.trim().toLowerCase();
    for (const item of feedbackData) {
      const marque = (item as any)?.marque;
      if (typeof marque === "string" && marque.trim().toLowerCase() === normalized) {
        const site = (item as any)?.siteUrl;
        if (typeof site === "string" && site.trim().length > 0) {
          return site;
        }
      }
    }
    return undefined;
  }, [feedbackData, selectedBrand, selectedSiteUrl]);

  useEffect(() => {
    const brandName = selectedBrand.trim();
    if (!brandName) {
      setSelectedBrandLogo(null);
      return;
    }

    let cancelled = false;

    fetchValidBrandLogo(brandName, selectedBrandSiteUrl)
      .then((url) => {
        if (!cancelled) {
          setSelectedBrandLogo(url);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSelectedBrandLogo(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedBrand, selectedBrandSiteUrl]);

  const suggestionsForDisplay = useMemo(() => {
    if (activeTab !== "suggestion") {
      return feedbackData;
    }

    const query = normalizeText(suggestionSearch);
    if (!query) {
      return feedbackData;
    }

    return feedbackData.filter((item) => {
      const suggestion = item as Suggestion;
      const haystacks = [suggestion.title ?? "", suggestion.description ?? ""];
      return haystacks.some((text) => normalizeText(text).includes(query));
    });
  }, [activeTab, feedbackData, suggestionSearch]);

  // ✅ Vérifie si le filtre "hot" est dispo (une seule fois)
  useEffect(() => {
    const checkHotFilter = async () => {
      try {
        const res = await getGroupedReportsByHot(1, 1, "hot");
        const hasHot = res && res.data && Object.keys(res.data).length > 0;
        if (hasHot && !availableFilters.includes("hot")) {
          setAvailableFilters((prev) => [...prev, "hot"]);
          setActiveFilter("hot");
        }
      } catch (e) {
        console.warn("Erreur vérif filtre hot:", e);
      }
    };
    checkHotFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🟢 Reset du filtre par défaut quand l’onglet change (si pas de marque sélectionnée)
  useEffect(() => {
    if (selectedBrand) return;

    let defaultFilter = "confirmed";
    if (activeTab === "coupdecoeur") defaultFilter = "all";
    if (activeTab === "suggestion") defaultFilter = "allSuggest";

    setActiveFilter(defaultFilter);
  }, [activeTab, selectedBrand]);

  // 🟢 Fetch centralisé
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        let result: any;

        if (selectedBrand) {
          // 🔹 Priorité au filtre par marque
          if (activeTab === "coupdecoeur") {
            result = await getCoupsDeCoeurByBrand(selectedBrand, 1, 50);
            if (isMounted) {
              const typed = (result?.coupdeCoeurs || []).map((item: any) => ({
                ...item,
                type: item.type ?? "coupdecoeur",
              }));
              setFeedbackData(typed);
            }
          } else if (activeTab === "suggestion") {
            result = await getSuggestionsByBrand(selectedBrand, 1, 50);
            if (isMounted) {
              const typed = (result?.suggestions || []).map((item: any) => ({
                ...item,
                type: item.type ?? "suggestion",
              }));
              setFeedbackData(typed);
            }
          }
        } else {
          // 🔹 Cas générique (pas de marque sélectionnée)
          if (activeTab !== "report") {
            const res = await fetchFeedbackData(activeFilter, activeTab);
            if (isMounted) setFeedbackData(res.data || []);
          }
        }
      } catch (e) {
        console.error("Erreur fetch:", e);
        if (isMounted) setFeedbackData([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [activeTab, activeFilter, selectedBrand]);

  const displayedCount = useMemo(
    () => (activeTab === "suggestion" ? suggestionsForDisplay.length : feedbackData.length),
    [activeTab, suggestionsForDisplay.length, feedbackData.length]
  );

  function firstLetterCapitalized(string: string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="home-page">
      {/* Bandeau violet haut */}
      <PurpleBanner activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="user-main-content">
        <aside className="left-panel">
          <UserStatsCard />
        </aside>

        {/* === Onglet Signalements === */}
        {activeTab === "report" && (
          <div
            className={`report-banner-container ${selectedBrand || selectedCategory
              ? "banner-filtered"
              : `banner-${activeFilter}`}`}
            style={selectedBrandBaseColor ? brandBannerStyle : undefined}
          >
            <div className="feedback-list-wrapper">
              {/* @ts-ignore */}
              <HomeGroupedReportsList
                activeTab={activeTab}
                activeFilter={activeFilter}
                viewMode={activeFilter === "confirmed" ? "confirmed" : "none" as any}
                onViewModeChange={setViewMode}
                setActiveFilter={setActiveFilter}
                // Additional props that the component's Props type typically expects:
                filter={activeFilter}
                setFilter={setActiveFilter}
                setViewMode={setViewMode}
                isHotFilterAvailable={availableFilters.includes("hot")}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
                setSelectedSiteUrl={setSelectedSiteUrl}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>

            <aside className="right-panel">
              <FilterIllustration
                filter={activeFilter}
                selectedBrand={selectedBrand}
                siteUrl={selectedSiteUrl}
                selectedCategory={selectedCategory}
              />
            </aside>
          </div>
        )}

        {/* === Onglet Coups de cœur === */}
        {activeTab === "coupdecoeur" && (
          <div
            className={`cdc-banner-container ${selectedBrand ? "banner-filtered" : `banner-${activeFilter}`}`}
            style={selectedBrandBaseColor ? brandBannerStyle : undefined}
          >
            <div className="feedback-list-wrapper">
              <HomeFiltersCdc
                filter={activeFilter}
                setFilter={setActiveFilter}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
              />
              {isLoading ? (
                <SqueletonAnime
                  loaderRef={{ current: null }}
                  loading={true}
                  hasMore={false}
                  error={null}
                />
              ) : (
                <div className="feedback-view-container">
                  <div className="feedback-view-wrapper">
                    <FeedbackView
                      activeTab={activeTab}
                      viewMode="flat"
                      currentState={{ data: feedbackData, loading: isLoading, hasMore: false, error: null }}
                      openId={null}
                      setOpenId={() => {}}
                      groupOpen={{}}
                      setGroupOpen={() => {}}
                      selectedBrand={selectedBrand}
                      selectedCategory=""
                      renderCard={() => <></>}
                    />
                  </div>
                  <aside className="right-panel">
                    <FilterIllustration filter={activeFilter} selectedBrand={selectedBrand} />
                  </aside>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === Onglet Suggestions === */}
        {activeTab === "suggestion" && (
          <div
            className={`suggestion-banner-container ${selectedBrand ? "banner-filtered" : `banner-${activeFilter}`}`}
            style={selectedBrandBaseColor ? { ...suggestionBannerStyle, ...brandBannerStyle } : suggestionBannerStyle}
          >
            <div className="feedback-list-wrapper">
              <div>
                <HomeFiltersSuggestion
                  filter={activeFilter}
                  setFilter={setActiveFilter}
                  selectedBrand={selectedBrand}
                  setSelectedBrand={handleSuggestionBrandChange}
                  searchQuery={suggestionSearch}
                  onSearchChange={setSuggestionSearch}
                />
              </div>

              {isLoading ? (
                <SqueletonAnime loaderRef={{ current: null }} loading={true} hasMore={false} error={null} />
              ) : (
                <div>
                  <div className="selected-brand-heading">
                    {selectedBrand && selectedBrandLogo && (
                      <img
                        src={selectedBrandLogo}
                        alt={`${selectedBrand} logo`}
                        className="selected-brand-heading__logo"
                      />
                    )}
                    {selectedBrand && (
                      <h1>
                        <div className="selected-brand-count">
                          {displayedCount}
                        </div>
                        signalement{displayedCount > 1 ? "s" : ""} {selectedCategory && `lié${displayedCount > 1 ? "s" : ""} au ${selectedCategory}`} sur {selectedBrand && firstLetterCapitalized(selectedBrand)+``}
                      </h1>
                    )}
                  </div>
                  <FeedbackView
                    activeTab={activeTab}
                    viewMode="flat"
                    currentState={{ data: suggestionsForDisplay, loading: isLoading, hasMore: false, error: null }}
                    openId={null}
                    setOpenId={() => {}}
                    groupOpen={{}}
                    setGroupOpen={() => {}}
                    selectedBrand={selectedBrand}
                    selectedCategory=""
                    renderCard={() => <></>}
                  />
                </div>
              )}
            </div>

            <aside className="right-panel">
              <FilterIllustration filter={activeFilter} selectedBrand={selectedBrand} />
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
