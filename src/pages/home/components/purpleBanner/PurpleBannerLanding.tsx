import { useEffect, useState } from "react";
import FeedbackTabs, {
  type FeedbackType,
} from "@src/components/user-profile/FeedbackTabs";
import "./PurpleBannerLanding.scss";
import {
  LogoBig,
  LogoMedium,
  LogoSmall,
} from "@src/components/shared/DecorativeLogos";
import bulleIcon from "/assets/images/bulle-top-bar-landing.png";
import emojiIcon from "/assets/images/emoji-top-bar.png";
import badge from "/assets/icons/Little-badge.svg";
import Buttons from "@src/components/buttons/Buttons";
import { useNavigate } from "react-router-dom";

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
  const [marginScreen, setMarginScreen] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const updateMargin = () => {
      // match the horizontal auto margin of the 1200px max container
      const maxWidth = 1200;
      const spacing = Math.max((window.innerWidth - maxWidth) / 2, 0);
      setMarginScreen(spacing - 80);
    };

    updateMargin();
    window.addEventListener("resize", updateMargin);
    return () => window.removeEventListener("resize", updateMargin);
  }, []);

  return (
    <div className="purple-banner-landing">
      <div className="purple-banner-landing__content">
        {/* central message */}
        <div className="text__container">
          <div className="text">
            <span>Améliorer&nbsp;</span>
            <div className="text__decoration">
              <img src={bulleIcon} alt="bulle" className="bulle" />
              <img src={emojiIcon} alt="emoji" className="emoji" />
            </div>
            <span>sur vos sites et apps&nbsp;!</span>
          </div>
          <div className="subtext">
            <p>
              <span className="subtext-bold">Faites entendre votre voix </span>
              et collaborez en direct avec les marques.
            </p>
          </div>
          <div className="button">
            <Buttons title="Se connecter" onClick={() => navigate("/lookup")} />
          </div>
        </div>

        {/* right decorative logos */}
        <div className="right">
          <div
            className="decorative-logos"
            style={{ right: `${marginScreen}px` }}
          >
            <LogoBig className="logo-big--landing" size={1.5} />
            <LogoMedium className="logo-medium--landing" size={1.1} />
            <LogoSmall className="logo-small--landing" size={1.3} />
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
    </div>
  );
}
