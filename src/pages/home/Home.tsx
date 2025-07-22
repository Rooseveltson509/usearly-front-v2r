import React, { useState, useEffect } from "react";
import "./Home.scss";
import ContributionsOverview from "@src/components/user-profile/ContributionsOverview";
import FeedbackTabs, { type FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import UserStatsCard from "@src/components/user-profile/UserStatsCard";
import HomeGroupedReportsList from "./HomeGroupedReportsList";
import FeedbackView from "@src/components/feedbacks/FeedbackView";
import { getGroupedReportsByHot, getPublicCoupsDeCoeur, getPublicSuggestions } from "@src/services/feedbackService";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import HomeFilters from "./HomeFilters";
import bulleIcon from "../../assets/images/bulle-top-bar.png";
import emojiIcon from "../../assets/images/emoji-top-bar.png";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeedbackType>("report");
  const [feedbackData, setFeedbackData] = useState<(CoupDeCoeur | Suggestion)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [activeFilter, setActiveFilter] = useState("chrono");
  const [viewMode, setViewMode] = useState<"flat" | "chrono">("chrono");
  const [availableFilters, setAvailableFilters] = useState<string[]>(["chrono", "rage", "popular", "urgent"]);

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
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (activeTab === "coupdecoeur" || activeTab === "suggestion") {
        setIsLoading(true);
        try {
          const res = activeTab === "coupdecoeur"
            ? await getPublicCoupsDeCoeur(1, 50)
            : await getPublicSuggestions(1, 50);

          const dataToSet = activeTab === "coupdecoeur" ? res.coupdeCoeurs : res.suggestions;
          setFeedbackData(dataToSet || []);
        } catch (e) {
          console.error("Erreur fetch feedback:", e);
          setFeedbackData([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (activeTab !== "report") {
      fetchData();
    }
  }, [activeTab]);

  return (
    <div className="home-page">
      {/* Bandeau violet haut */}
      <div className="purple-banner">
        <div className="banner-content">
          {/* message central */}
          <div className="text">
            <span>Likez, shakez, faites&nbsp;</span>
            <div className="text__decoration">
              <img src={bulleIcon} alt="bulleIcon" className="bulle" />
              <img src={emojiIcon} alt="emojiIcon" className="emoji" />
            </div>
            <span>les marques !</span>
          </div>
          <FeedbackTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Contenu principal */}
      <main className="user-main-content">
        <aside className="left-panel">
          <UserStatsCard />
        </aside>

        <div className="feedback-list-wrapper">
          <div className="content-background" />
          {activeTab !== "report" && isLoading && (
            <SqueletonAnime
              loaderRef={{ current: null }}
              loading={true}
              hasMore={false}
              error={null}
            />
          )}

          {activeTab === "report" ? (
            <HomeGroupedReportsList
              activeTab={activeTab}
              activeFilter={activeFilter}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              setActiveFilter={setActiveFilter}
            />
          ) : (
            !isLoading && (
              <FeedbackView
                activeTab={activeTab}
                viewMode="flat"
                currentState={{
                  data: feedbackData,
                  loading: isLoading,
                  hasMore: false,
                  error: null,
                }}
                openId={null}
                setOpenId={() => {}}
                groupOpen={{}}
                setGroupOpen={() => {}}
                selectedBrand=""
                selectedCategory=""
                renderCard={() => <></>}
              />
            )
          )}
        </div>
        {activeTab === "report" && (
          <aside className="right-panel">
            <HomeFilters
              selectedFilter={activeFilter}
              onChange={(key) => {
                if (key === "chrono") {
                  setActiveFilter(""); // <-- c'est ça la clé !
                  setViewMode("chrono");
                } else {
                  setActiveFilter(key);
                  setViewMode("flat");
                }

              }}
              availableFilters={availableFilters}
            />
          </aside>
        )}
      </main>
    </div>
  );
};

export default Home;
