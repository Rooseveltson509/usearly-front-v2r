import { useUserFeedbackCountLastWeeks } from "@src/hooks/useUserFeedbackCountLastWeeks";
import FeedbackTabs, {
  type FeedbackType,
} from "@src/components/user-profile/FeedbackTabs";
import "./PurpleBanner.scss";
import {
  LogoBig,
  LogoMedium,
  LogoSmall,
} from "@src/components/shared/DecorativeLogos";
import chatIcon from "/assets/images/chat-top-bar.svg";
import bulleIcon from "/assets/images/bulle-top-bar.png";
import emojiIcon from "/assets/images/emoji-top-bar.png";
import chatIconUsearly from "/assets/icons/chatIconUsearly.svg";
import badge from "/assets/icons/Little-badge.svg";

export type PurpleBannerProps = {
  activeTab?: FeedbackType;
  userProfile?: boolean;
  onTabChange?: (tab: FeedbackType) => void;
  navOn?: boolean;
  pastille?: boolean;
};

export default function PurpleBanner({
  activeTab = "report",
  onTabChange = () => {},
  navOn = true,
  pastille = false,
  userProfile = false,
}: PurpleBannerProps) {
  const { count, loading } = useUserFeedbackCountLastWeeks(
    activeTab,
    4,
    userProfile,
  );

  const getLabel = (tab: FeedbackType, total: number) => {
    const isPlural = total > 1;
    switch (tab) {
      case "coupdecoeur":
        return isPlural ? "Coups de cœur" : "Coup de cœur";
      case "suggestion":
        return isPlural ? "Suggestions" : "Suggestion";
      default:
        return isPlural ? "Signalements" : "Signalement";
    }
  };

  return (
    <div className="purple-banner">
      {/* left mascot illustration */}
      <img src={chatIcon} alt="chat mascot" className="chat" />

      {/* central message */}
      {userProfile ? (
        <div className="text">
          <div className="text-chat-icon">
            <img src={chatIconUsearly} alt="icon Chat" />
            <span className="text-chat-icon-number">
              {loading ? "..." : count}
            </span>
          </div>
          <div className="text-information">
            <span className="text-information-time">4 dernières semaines</span>
            <span className="text-information-signalement">
              {getLabel(activeTab, loading ? 0 : count)}
            </span>
          </div>
        </div>
      ) : (
        <div className="text">
          <span>Likez, shakez, faites&nbsp;</span>
          <div className="text__decoration">
            <img src={bulleIcon} alt="bulle" className="bulle" />
            <img src={emojiIcon} alt="emoji" className="emoji" />
          </div>
          <span>les marques{"\u00A0"}!</span>
        </div>
      )}

      {/* right decorative logos */}
      <div className="right">
        <div className="decorative-logos">
          <LogoBig />
          <LogoMedium />
          <LogoSmall />
          {pastille && (
            <img src={badge} alt="badge" className="logo logo-badge" />
          )}
        </div>
      </div>

      {/* tabs (report, coupdecoeur, suggestion) */}
      {navOn && (
        <FeedbackTabs activeTab={activeTab} onTabChange={onTabChange} />
      )}
    </div>
  );
}
