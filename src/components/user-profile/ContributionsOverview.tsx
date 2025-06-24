import "./ContributionsOverview.scss";
import { useUserStatsSummary } from "@src/hooks/useUserStatsSummary";
import type { FeedbackType } from "./FeedbackTabs";
import { useRef, useEffect, useState } from "react";
import ChatTop from "../../assets/images/chat-top-bar.svg";

interface Props {
  activeTab: FeedbackType;
}

const ContributionsOverview = ({ activeTab }: Props) => {
  const { stats, loading } = useUserStatsSummary();
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!bubbleRef.current) return;
    const el = bubbleRef.current;
    el.classList.remove("pop");
    void el.offsetWidth; // Force reflow pour relancer l’animation
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
          stats.totalReports + stats.totalCoupsDeCoeur + stats.totalSuggestions
        );
    }
  };

  // Animation pour faire évoluer la valeur jusqu'à getCountByTab()
  useEffect(() => {
    if (loading) return; // On n’anime pas si c’est en cours de chargement
    const targetCount = getCountByTab();
    const startTime = Date.now();
    const duration = 2500; // durée de l’animation en ms

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOut * targetCount);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(targetCount); // on s’assure de terminer sur la valeur cible
      }
    };

    animate();
  }, [loading, activeTab, stats]);

  return (
    <div className="contributions-overview">
      <div className="contributions-count" ref={bubbleRef}>
        <div>
          <img src={ChatTop} alt="ChatTop" />
          <span className="count">{loading ? "..." : count}</span>
        </div>
        <div className="contributions-label">
          <span>4 dernières semaines</span>
          <span className="title">Contributions</span>
        </div>
      </div>
    </div>
  );
};

export default ContributionsOverview;
