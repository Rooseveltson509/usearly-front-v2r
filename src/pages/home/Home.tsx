import React, { useState, useEffect } from "react";
import "./Home.scss";
import ContributionsOverview from "@src/components/user-profile/ContributionsOverview";
import FeedbackTabs, { type FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import UserStatsCard from "@src/components/user-profile/UserStatsCard";
import HomeGroupedReportsList from "./HomeGroupedReportsList";
import FeedbackView from "@src/components/feedbacks/FeedbackView";
import { getPublicCoupsDeCoeur, getPublicSuggestions } from "@src/services/feedbackService";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeedbackType>("report");
  const [feedbackData, setFeedbackData] = useState<(CoupDeCoeur | Suggestion)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching for tab:", activeTab);
      if (activeTab === "coupdecoeur" || activeTab === "suggestion") {
        setIsLoading(true);
        try {
          let res;
          if (activeTab === "coupdecoeur") {
            res = await getPublicCoupsDeCoeur(1, 50);
          } else if (activeTab === "suggestion") {
            res = await getPublicSuggestions(1, 50);
          }
          console.log("API response for", activeTab, ":", res);

          const dataToSet = activeTab === "coupdecoeur" ? res.coupdeCoeurs : res.suggestions;
          console.log("Data to set for", activeTab, ":", dataToSet);

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
          <ContributionsOverview activeTab={activeTab} />
          <FeedbackTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Contenu principal */}
      <main className="user-main-content">
        <aside className="left-panel">
          <UserStatsCard />
        </aside>

        <div className="feedback-list-wrapper">
          {activeTab !== "report" && isLoading && (
            <SqueletonAnime loaderRef={{ current: null }} loading={true} hasMore={false} error={null} />
          )}

          {activeTab === "report" ? (
            <HomeGroupedReportsList activeTab={activeTab} />
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
      </main>
    </div>
  );
};

export default Home;