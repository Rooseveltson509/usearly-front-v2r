import React, { useEffect, useRef, useState } from "react";
import UserStatsCard from "./UserStatsCard";
import { type FeedbackType } from "./FeedbackTabs";
import "./UserProfilePage.scss";
import UserGroupedReportsList from "../profile/UserGroupedReportsList";
import UserFeedbackView from "../profile/UserFeedbackView";
// import UserImpact from "./UserImpact";
import UserVotesCard from "../profile/UserVotesCard";
import PurpleBanner from "@src/pages/home/components/purpleBanner/PurpleBanner";

const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeedbackType>("report");
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
        </aside>
      </main>
    </div>
  );
};

export default UserProfilePage;
