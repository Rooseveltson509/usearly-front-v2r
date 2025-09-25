import FeedbackTabs, { type FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import "./PurpleBanner.scss";

import chatIcon from "/assets/images/chat-top-bar.svg";
import bulleIcon from "/assets/images/bulle-top-bar.png";
import emojiIcon from "/assets/images/emoji-top-bar.png";
import big from "/assets/images/big.svg";
import medium from "/assets/images/medium.svg";
import small from "/assets/images/small.svg";

export type PurpleBannerProps = {
    activeTab: FeedbackType;
    onTabChange: (tab: FeedbackType) => void;
};

export default function PurpleBanner({ activeTab, onTabChange }: PurpleBannerProps) {
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
                    <img src={big} alt="big" className="logo logo-big" />
                    <img src={medium} alt="medium" className="logo logo-medium" />
                    <img src={small} alt="small" className="logo logo-small" />
                </div>
            </div>

            {/* tabs (report, coupdecoeur, suggestion) */}
            <FeedbackTabs activeTab={activeTab} onTabChange={onTabChange} />
        </div>
    );
}
