import "./ContributionsOverview.scss";
import { useUserStatsSummary } from "@src/hooks/useUserStatsSummary";
import type { FeedbackType } from "./FeedbackTabs";
import { useRef, useEffect } from "react";

interface Props {
  activeTab: FeedbackType;
}

const ContributionsOverview = ({ activeTab }: Props) => {
  const { stats, loading } = useUserStatsSummary();
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bubbleRef.current) return;
    const el = bubbleRef.current;
    el.classList.remove("pop");

    // Force reflow to restart animation
    void el.offsetWidth;

    el.classList.add("pop");
  }, [activeTab, stats]);


  const getCountByTab = () => {
    if (!stats) return 0;

    switch (activeTab) {
      case "report":
        return stats.totalReports;
      case "coupdecoeur":
        return stats.totalCoupsDeCoeur;
      case "suggestion":
        return stats.totalSuggestions;
      default:
        return (
          stats.totalReports +
          stats.totalCoupsDeCoeur +
          stats.totalSuggestions
        );
    }
  };

  return (
    <div className="contributions-overview">
      <div className="contribution-bubble" ref={bubbleRef}>
        {loading ? "..." : getCountByTab()}
      </div>
      <div className="contribution-title">Contributions</div>
      <div className="contribution-summary">
        Signalements, suggestions et coups de cœur combinés
      </div>
    </div>
  );
};

export default ContributionsOverview;
