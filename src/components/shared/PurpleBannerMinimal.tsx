import "../../pages/home/components/purpleBanner/PurpleBanner.scss";
import {
  LogoBig,
  LogoMedium,
  LogoSmall,
} from "@src/components/shared/DecorativeLogos";
import chatIcon from "/assets/images/chat-top-bar.svg";

export default function PurpleBannerMinimal() {
  return (
    <div className="purple-banner">
      {/* left mascot illustration */}
      <img src={chatIcon} alt="chat mascot" className="chat" />

      {/* right decorative logos */}
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
