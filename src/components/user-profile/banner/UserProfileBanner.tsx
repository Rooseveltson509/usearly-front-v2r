import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "@src/services/AuthContext";
import { useUserStatsSummary } from "@src/hooks/useUserStatsSummary";
import { useIsMobile } from "@src/hooks/use-mobile";
import Avatar from "@src/components/shared/Avatar";
import { getDisplayName } from "@src/utils/avatarUtils";
import { type FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import reportYellowIcon from "/assets/icons/reportYellowIcon.svg";
import likeRedIcon from "/assets/icons/heart-header.svg";
import suggestGreenIcon from "/assets/icons/suggest-header.svg";
import badge from "/assets/icons/Little-badge.svg";
import chatIcon from "/assets/images/chat-top-bar.svg";
// import {
//   LogoBig,
//   LogoMedium,
//   LogoSmall,
// } from "@src/components/shared/DecorativeLogos";
import { useCountUp } from "@src/components/profile/banner/user-emotion/useCountUp";
import "./UserProfileBanner.scss";
import UScoreIcon from "/assets/U-score-icon.svg";

type Props = {
  activeTab: FeedbackType;
  onTabChange: (tab: FeedbackType) => void;
};

const TAB_ORDER: FeedbackType[] = ["report", "coupdecoeur", "suggestion"];

export default function UserProfileBanner({ activeTab, onTabChange }: Props) {
  const { userProfile } = useAuth();
  const { stats, loading } = useUserStatsSummary();
  const isCompactScreen = useIsMobile("(max-width: 700px)");
  const isCompactScreen2 = useIsMobile("(max-width: 450px)");
  const statsInlineRef = useRef<HTMLDivElement | null>(null);
  const statButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollFrameRef = useRef<number | null>(null);
  const pendingProgrammaticTabRef = useRef<FeedbackType | null>(null);
  const avatarSize = isCompactScreen2 ? 90 : 120;
  const reports = useCountUp(stats?.totalReports ?? 0, 1400);
  const hearts = useCountUp(stats?.totalCoupsDeCoeur ?? 0, 1400);
  const suggestions = useCountUp(stats?.totalSuggestions ?? 0, 1400);

  const statItems = [
    {
      tab: "report" as const,
      value: reports,
      icon: reportYellowIcon,
      alt: "Signalements",
      label: "Signalements",
    },
    {
      tab: "coupdecoeur" as const,
      value: hearts,
      icon: likeRedIcon,
      alt: "Coups de cœur",
      label: "Coups de cœur",
    },
    {
      tab: "suggestion" as const,
      value: suggestions,
      icon: suggestGreenIcon,
      alt: "Suggestions",
      label: "Suggestions",
    },
  ];

  const syncActiveTabWithScroll = useCallback(() => {
    if (!isCompactScreen || !statsInlineRef.current) return;

    const container = statsInlineRef.current;
    const viewportCenter = container.scrollLeft + container.clientWidth / 2;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    statButtonRefs.current.forEach((button, index) => {
      if (!button) return;
      const buttonCenter = button.offsetLeft + button.offsetWidth / 2;
      const distance = Math.abs(buttonCenter - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    const nextTab = TAB_ORDER[closestIndex];

    const pendingTab = pendingProgrammaticTabRef.current;
    if (pendingTab) {
      const pendingIndex = TAB_ORDER.indexOf(pendingTab);
      if (pendingIndex >= 0 && closestIndex !== pendingIndex) {
        return;
      }
      pendingProgrammaticTabRef.current = null;
    }

    if (nextTab && nextTab !== activeTab) {
      onTabChange(nextTab);
    }
  }, [activeTab, isCompactScreen, onTabChange]);

  const handleStatsScroll = useCallback(() => {
    if (!isCompactScreen) return;

    if (scrollFrameRef.current !== null) {
      cancelAnimationFrame(scrollFrameRef.current);
    }

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      syncActiveTabWithScroll();
    });
  }, [isCompactScreen, syncActiveTabWithScroll]);

  const handleStatSelect = useCallback(
    (tab: FeedbackType) => {
      if (isCompactScreen) {
        pendingProgrammaticTabRef.current = tab;
      }
      onTabChange(tab);
    },
    [isCompactScreen, onTabChange],
  );

  const handleCarouselArrow = useCallback(
    (direction: "prev" | "next") => {
      if (!isCompactScreen) return;

      const activeIndex = TAB_ORDER.indexOf(activeTab);
      if (activeIndex < 0) return;

      const delta = direction === "next" ? 1 : -1;
      const nextIndex =
        (activeIndex + delta + TAB_ORDER.length) % TAB_ORDER.length;
      const nextTab = TAB_ORDER[nextIndex];

      handleStatSelect(nextTab);
    },
    [activeTab, handleStatSelect, isCompactScreen],
  );

  useEffect(() => {
    if (!isCompactScreen) return;

    const activeIndex = TAB_ORDER.indexOf(activeTab);
    const activeButton = statButtonRefs.current[activeIndex];
    if (!activeButton) return;

    activeButton.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeTab, isCompactScreen]);

  useEffect(() => {
    if (!isCompactScreen) {
      pendingProgrammaticTabRef.current = null;
    }
  }, [isCompactScreen]);

  useEffect(() => {
    return () => {
      if (scrollFrameRef.current !== null) {
        cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);

  if (!userProfile) return null;

  return (
    <div className="user-profile-banner">
      {/* LEFT floating mascot */}
      <img src={chatIcon} alt="chat mascot" className="user-chat-decor" />
      {/* TOP LINE */}
      <div className="banner-container">
        <div className="banner-main">
          {/* LEFT — avatar + name */}
          <div className="user-info">
            <div className="avatar-wrapper-profile">
              <Avatar
                avatar={userProfile.avatar}
                pseudo={getDisplayName(userProfile.pseudo, userProfile.email)}
                sizeHW={avatarSize}
                className="user-avatar"
              />
            </div>

            <div className="identity">
              <div className="name">{userProfile.pseudo}</div>
              <div className="level">Usear Niveau 1</div>
            </div>
          </div>

          {/* CENTER — stats */}
          <div
            className={`stats-block ${isCompactScreen ? "has-carousel-hint" : ""}`}
          >
            <h2 className="user-impact-title">Mon impact user :</h2>
            <div
              className={`stats-inline ${isCompactScreen ? "is-carousel" : ""}`}
              ref={statsInlineRef}
              onScroll={isCompactScreen ? handleStatsScroll : undefined}
            >
              {statItems.map((item, index) => (
                <button
                  key={item.tab}
                  ref={(element) => {
                    statButtonRefs.current[index] = element;
                  }}
                  className={`stat ${activeTab === item.tab ? "active" : ""}`}
                  onClick={() => handleStatSelect(item.tab)}
                >
                  <div className="stat-value">
                    {item.value}
                    <img
                      src={item.icon}
                      alt={item.alt}
                      className={`stat-icon ${activeTab === item.tab ? "pulse" : ""}`}
                    />
                  </div>
                  <span className="label">{item.label}</span>
                </button>
              ))}
            </div>
            {isCompactScreen && (
              <div className="stats-carousel-hints">
                <button
                  type="button"
                  className="hint-arrow-button hint-arrow-left"
                  aria-label="Statistique précédente"
                  onClick={() => handleCarouselArrow("prev")}
                />
                <button
                  type="button"
                  className="hint-arrow-button hint-arrow-right"
                  aria-label="Statistique suivante"
                  onClick={() => handleCarouselArrow("next")}
                />
              </div>
            )}
          </div>

          {/* RIGHT — power */}
          <div className="power">
            <span className="label">Usear Power</span>
            <span className="value">
              <div className="value-with-icon-container">
                {loading ? "..." : (stats?.usearPower ?? 0)}{" "}
                <span className="icon-container">
                  <img src={UScoreIcon} alt="" />
                </span>
              </div>
              <div className="right-badge">
                <img src={badge} alt="badge" className="logo logo-badge" />
              </div>
            </span>
          </div>
        </div>
      </div>
      {/* <div className="right">
        <div className="decorative-logos">
          <LogoBig />
          <LogoMedium />
          <LogoSmall />
        </div>
      </div> */}
    </div>
  );
}
