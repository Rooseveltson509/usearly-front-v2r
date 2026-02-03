import React, { useEffect, useRef, useState } from "react";
import UserStatsCard from "./UserStatsCard";
import { type FeedbackType } from "./FeedbackTabs";
import "./UserProfilePage.scss";
import UserGroupedReportsList from "../profile/UserGroupedReportsList";
import UserFeedbackView from "../profile/UserFeedbackView";
// import UserImpact from "./UserImpact";
import UserVotesCard from "../profile/UserVotesCard";
import PurpleBanner from "@src/pages/home/components/purpleBanner/PurpleBanner";
import UserEmotionSummaryPanel from "../profile/banner/user-emotion/UserEmotionSummaryPanel";
import { useUserEmotionSummary } from "../profile/hook/userEmotionService";

const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeedbackType>("report");
  const { data: emotionSummary, loading: loadingEmotionSummary } =
    useUserEmotionSummary(
      activeTab === "report" || activeTab === "coupdecoeur" ? activeTab : null,
    );

  const mountCount = useRef(0);

  useEffect(() => {
    mountCount.current += 1;
    console.log("UserProfilePage mounted:", mountCount.current);
  }, []);

  return (
    <div className="user-profile-page">
      {/* Bandeau du haut */}
      <PurpleBanner
        navOn={true}
        pastille={true}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userProfile={true}
      />

      {/* Contenu principal */}
      <main className="user-main-content">
        <aside className="left-panel">
          <UserStatsCard />
        </aside>
        <div className="feedback-list-wrapper">
          {activeTab === "report" ? (
            <UserGroupedReportsList />
          ) : (
            <UserFeedbackView activeTab={activeTab} />
          )}
        </div>

        <aside className="right-panel">
          {activeTab === "suggestion" && <UserVotesCard />}
          {/* {activeTab === "coupDeCoeur" && <UserImpact />} */}
          {(activeTab === "report" || activeTab === "coupdecoeur") && (
            <UserEmotionSummaryPanel
              data={emotionSummary}
              loading={loadingEmotionSummary}
            />
          )}
        </aside>
      </main>
    </div>
  );
};

export default UserProfilePage;
