import "../../pages/home/components/purpleBanner/PurpleBanner.scss";
import chatIcon from "/assets/images/chat-top-bar.svg";
import big from "/assets/images/big.svg";
import medium from "/assets/images/medium.svg";
import small from "/assets/images/small.svg";

export default function PurpleBannerMinimal() {
  return (
    <div className="purple-banner">
      {/* left mascot illustration */}
      <img src={chatIcon} alt="chat mascot" className="chat" />

      {/* right decorative logos */}
      <div className="right">
        <div className="decorative-logos">
          <img src={big} alt="big" className="logo logo-big" />
          <img src={medium} alt="medium" className="logo logo-medium" />
          <img src={small} alt="small" className="logo logo-small" />
        </div>
      </div>
    </div>
  );
}
