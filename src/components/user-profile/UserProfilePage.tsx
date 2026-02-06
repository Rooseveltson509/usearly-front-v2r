import React, { useEffect, useRef, useState } from "react";
import { type FeedbackType } from "./FeedbackTabs";
import "./UserProfilePage.scss";
import UserGroupedReportsList from "../profile/UserGroupedReportsList";
import UserFeedbackView from "../profile/UserFeedbackView";
import UserVotesCard from "../profile/UserVotesCard";
import UserEmotionSummaryPanel from "../profile/banner/user-emotion/UserEmotionSummaryPanel";
import { useUserEmotionSummary } from "../profile/hook/userEmotionService";
import UserProfileBanner from "./banner/UserProfileBanner";

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
      <UserProfileBanner activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 👇 NOUVEAU WRAPPER */}
      <div className={`profile-main-wrapper banner-${activeTab}`}>
        <main className="user-main-content">
          <div className="feedback-list-wrapper">
            {activeTab === "report" ? (
              <UserGroupedReportsList />
            ) : (
              <UserFeedbackView activeTab={activeTab} />
            )}
          </div>

          <aside className="right-panel">
            {activeTab === "suggestion" && <UserVotesCard />}
            {(activeTab === "report" || activeTab === "coupdecoeur") && (
              <UserEmotionSummaryPanel
                data={emotionSummary}
                loading={loadingEmotionSummary}
              />
            )}
          </aside>
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;
