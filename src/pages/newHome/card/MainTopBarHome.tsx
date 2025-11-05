import React from "react";
import "./MainTopBarHome.scss";
import {
  LogoBig,
  LogoMedium,
  LogoSmall,
} from "@src/components/shared/DecorativeLogos";
import chatIcon from "/assets/images/chat-top-bar.svg";
import bulleIcon from "/assets/images/bulle-top-bar.png";
import emojiIcon from "/assets/images/emoji-top-bar.png";
const MainTopBarHome: React.FC = () => {
  return (
    <div className="main-top-bar-home">
      {/* zone gauche – mascotte */}
      <img src={chatIcon} alt="chatIcon" className="chat" />

      {/* message central */}
      <div className="text">
        <span>Likez, shakez, faites&nbsp;</span>
        <div className="text__decoration">
          <img src={bulleIcon} alt="bulleIcon" className="bulle" />
          <img src={emojiIcon} alt="emojiIcon" className="emoji" />
        </div>
        <span>les marques !</span>
      </div>

      {/* zone droite – pastilles statistiques */}

      <div className="right">
        <div className="decorative-logos">
          <LogoBig />
          <LogoMedium />
          <LogoSmall />
        </div>
      </div>
    </div>
  );
};

export default MainTopBarHome;
