import "./PurpleBanner.scss";
import {
  LogoBig,
  LogoMedium,
  LogoSmall,
} from "@src/components/shared/DecorativeLogos";
import chatIcon from "/assets/images/chat-top-bar.svg";
import reportYellowIcon from "/assets/icons/reportYellowIcon.svg";
import likeRedIcon from "/assets/icons/heart-header.svg";
import suggestGreenIcon from "/assets/icons/suggest-header.svg";
import { useWeeklyGlobalFeedbackStats } from "@src/components/profile/banner/user-emotion/UseWeeklyGlobalFeedbackStats";
import { useCountUp } from "@src/components/profile/banner/user-emotion/useCountUp";

export type FeedbackType = "report" | "coupdecoeur" | "suggestion";

export type PurpleBannerProps = {
  activeTab?: FeedbackType;
  onTabChange?: (tab: FeedbackType) => void;
};

export default function PurpleBanner({
  activeTab = "report",
  onTabChange = () => {},
}: PurpleBannerProps) {
  const { stats, loading } = useWeeklyGlobalFeedbackStats();
  //const { stats, loading } = useGlobalFeedbackStats();
  const reports = useCountUp(stats?.totalReports ?? 0, 1200);
  const hearts = useCountUp(stats?.totalCoupsDeCoeur ?? 0, 1200);
  const suggestions = useCountUp(stats?.totalSuggestions ?? 0, 1200);

  return (
    <div className="purple-banner">
      {/* left mascot */}
      <img src={chatIcon} alt="chat mascot" className="chat" />

      {/* CENTER TITLE */}
      <div className="banner-center">
        <h2 className="impact-title">
          L’impact de la communauté cette semaine :
        </h2>

        <div className="stats-inline-global">
          <button
            className={`stat ${activeTab === "report" ? "active" : ""}`}
            onClick={() => onTabChange("report")}
          >
            <div className="stat-value">
              {loading ? "…" : reports}
              <img src={reportYellowIcon} alt="Signalements" />
            </div>
            <span className="label">Signalements</span>
          </button>

          <button
            className={`stat ${activeTab === "coupdecoeur" ? "active" : ""}`}
            onClick={() => onTabChange("coupdecoeur")}
          >
            <div className="stat-value">
              {loading ? "…" : hearts}
              <img src={likeRedIcon} alt="Coups de cœur" />
            </div>
            <span className="label">Coups de cœur</span>
          </button>

          <button
            className={`stat ${activeTab === "suggestion" ? "active" : ""}`}
            onClick={() => onTabChange("suggestion")}
          >
            <div className="stat-value">
              {loading ? "…" : suggestions}
              <img src={suggestGreenIcon} alt="Suggestions" />
            </div>
            <span className="label">Suggestions</span>
          </button>
        </div>
      </div>

      {/* right logos */}
      <div className="right">
        <div className="decorative-logos">
          <LogoBig />
          <LogoMedium />
          <LogoSmall />
        </div>
      </div>
    </div>
  );
}
