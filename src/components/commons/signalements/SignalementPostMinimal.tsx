import "./signalementPostMinimal.scss";
import testIcon from "../../../../public/assets/icons/heart-head.svg";
import checkIcon from "../../../../public/assets/icons/check-icon.svg";
import { MessageCircle } from "lucide-react";
import DoubleProfilePicture from "../doubleProfilePicture/DoubleProfilePicture";

const SignalementPostMinimal = () => {
  return (
    <div className="signalement-post-minimal">
      <div className="signalement-post-minimal-main">
        <div className="signalement-post-minimal-main-icon">
          <img src={testIcon} alt="" />
        </div>
        <div className="signalement-post-minimal-main-content">
          <div className="signalement-post-minimal-main-content-top">
            <p className="signalement-post-minimal-main-content-top-text">
              Signalement Post Minimal Component
            </p>
            <span className="signalement-post-minimal-main-content-top-count">
              139
            </span>
          </div>
          <div className="signalement-post-minimal-main-content-bottom">
            <div className="signalement-post-minimal-main-content-bottom-reactions">
              <div className="signalement-post-minimal-main-content-bottom-reactions-icons">
                <img src={checkIcon} alt="test" />
                <img src={checkIcon} alt="" />
              </div>
              <span className="signalement-post-minimal-main-content-bottom-reactions-count">
                50
              </span>
            </div>
            <div className="signalement-post-minimal-main-content-bottom-commentaire">
              <MessageCircle size={22} />
              <span className="signalement-post-minimal-main-content-bottom-commentaire-count">
                50
              </span>
            </div>
          </div>
        </div>
      </div>
      <DoubleProfilePicture />
    </div>
  );
};

export default SignalementPostMinimal;
