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
import badge from "/assets/icons/Little-badge.svg";

export type PurpleBannerProps = {
  activeTab?: FeedbackType;
  onTabChange?: (tab: FeedbackType) => void;
  navOn?: boolean;
  pastille?: boolean;
};

export default function PurpleBanner({
  activeTab = "report",
  onTabChange = () => {},
  navOn = true,
  pastille = false,
}: PurpleBannerProps) {
  return (
    <div className="purple-banner">
      {/* left mascot illustration */}
      <img src={chatIcon} alt="chat mascot" className="chat" />

      {/* central message */}
      <div className="text">
        <span>Likez, shakez, faites&nbsp;</span>
        <div className="text__decoration">
          <img src={bulleIcon} alt="bulle" className="bulle" />
          <img src={emojiIcon} alt="emoji" className="emoji" />
        </div>
        <span>les marques !</span>
      </div>

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
