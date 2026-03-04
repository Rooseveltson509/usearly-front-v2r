import React, { useEffect, useRef, useState } from "react";
import { type FeedbackType } from "./FeedbackTabs";
import "./UserProfilePage.scss";
import UserGroupedReportsList from "../profile/UserGroupedReportsList";
import UserFeedbackView from "../profile/UserFeedbackView";
// import UserVotesCard from "../profile/UserVotesCard";
import UserEmotionSummaryPanel from "../profile/banner/user-emotion/UserEmotionSummaryPanel";
import { useUserEmotionSummary } from "../profile/hook/userEmotionService";
import UserProfileBanner from "./banner/UserProfileBanner";
import UserLoveBrandsPanel from "../profile/banner/user-emotion/UserLoveBrandsPanel";
import Abracadabra from "/assets/images/profil/Abracadabra.svg";

const PROFILE_TITLES: Record<
  FeedbackType,
  { title: string; subtitle?: string }
> = {
  report: { title: "Mes signalements", subtitle: "& émotions" },
  coupdecoeur: { title: "Mes coups de cœur", subtitle: "& émotions" },
  suggestion: { title: "Mes suggestions", subtitle: "& mes votes" },
};

const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeedbackType>("report");
  const { title, subtitle } = PROFILE_TITLES[activeTab];
  const { data: emotionSummary, loading: loadingEmotionSummary } =
    useUserEmotionSummary(
      activeTab === "report" || activeTab === "coupdecoeur" ? activeTab : null,
    );

  const mountCount = useRef(0);

  useEffect(() => {
    mountCount.current += 1;
    console.log("UserProfilePage mounted:", mountCount.current);
  }, []);
  console.log("emotionSummary:", emotionSummary);
  console.log("loading:", loadingEmotionSummary);

  return (
    <div className="user-profile-page">
      <UserProfileBanner activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 👇 NOUVEAU WRAPPER */}
      <div className={`profile-main-wrapper banner-${activeTab}`}>
        <main className="user-main-content">
          <div className="feedback-list-wrapper">
            <div className="profile-section-header">
              <h2>{title}</h2>
              {subtitle && <span>{subtitle}</span>}
            </div>

            {activeTab === "report" ? (
              <UserGroupedReportsList />
            ) : (
              <UserFeedbackView activeTab={activeTab} />
            )}
          </div>

          <aside className="right-panel">
            {activeTab === "suggestion" && (
              // <UserVotesCard />
              <div className="suggestion-img-side-container">
                <img
                  className="suggestion-img-side-img"
                  src={Abracadabra}
                  alt="image abracadabra"
                />
              </div>
            )}

            {(activeTab === "report" || activeTab === "coupdecoeur") && (
              <>
                {/* 🔵 Bloc émotions (inchangé) */}
                <UserEmotionSummaryPanel
                  data={emotionSummary}
                  loading={loadingEmotionSummary}
                />

                {/* 🔽 SECTION SÉPARÉE */}
                <div className="love-brands-section">
                  <UserLoveBrandsPanel brands={emotionSummary?.brands ?? []} />
                </div>
              </>
            )}
          </aside>
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;
