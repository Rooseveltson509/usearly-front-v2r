import React from "react";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import FeedbackLeft from "./feedback-left/FeedbackLeft";
import FeedbackRight from "./FeedbackRight";
import DescriptionCommentSection from "../report-desc-comment/DescriptionCommentSection";
import CloseButton from "@src/components/buttons/CloseButtons";

interface Props {
  item: (CoupDeCoeur | Suggestion) & { type: "suggestion" | "coupdecoeur" };
  safeItem: (CoupDeCoeur | Suggestion) & {
    type: "suggestion" | "coupdecoeur";
    siteUrl?: string;
  };
  isOpen: boolean;
  onToggle: (id: string) => void;
  addClassName?: string;
  userId: string | null;
  userProfile: any;
  selectedImage: string | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
  isExpired: boolean;
  votes: number;
  max: number;
  barRef: React.RefObject<HTMLDivElement | null>;
  thumbLeft: number;
  expiresInDays: number | null;
  starProgressBar: string;
  onVoteClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showComments: boolean;
  onToggleComments: () => void;
  commentCount: number;
  isGuest: boolean;
  isFeedbackExpanded: boolean;
  onExpandedChange: React.Dispatch<React.SetStateAction<boolean>>;
  onCommentCountChange: React.Dispatch<React.SetStateAction<number>>;
}

const InteractiveFeedbackCardMobile: React.FC<Props> = ({
  item,
  safeItem,
  isOpen,
  onToggle,
  addClassName,
  userId,
  userProfile,
  selectedImage,
  setSelectedImage,
  isExpired,
  votes,
  max,
  barRef,
  thumbLeft,
  expiresInDays,
  starProgressBar,
  onVoteClick,
  showComments,
  onToggleComments,
  commentCount,
  isGuest,
  isFeedbackExpanded,
  onExpandedChange,
  onCommentCountChange,
}) => {
  return (
    <div
      className={`feedback-card feedback-card-mobile ${isOpen ? "open" : ""}${addClassName ? ` ${addClassName}` : ""}`}
    >
      <div className="feedback-main feedback-main-mobile">
        <FeedbackLeft item={item} isExpanded={isFeedbackExpanded} />

        <FeedbackRight
          item={safeItem}
          onToggle={onToggle}
          userProfile={userProfile}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          isExpired={isExpired}
          votes={votes}
          max={max}
          barRef={barRef}
          thumbLeft={thumbLeft}
          expiresInDays={expiresInDays}
          starProgressBar={starProgressBar}
          onVoteClick={onVoteClick}
          showComments={showComments}
          onToggleComments={onToggleComments}
          commentCount={commentCount}
          isGuest={isGuest}
          onExpandedChange={onExpandedChange}
        />
      </div>

      {!!userId && (
        <div
          className={`feedback-comments feedback-comments-mobile ${showComments ? "open" : "hidden"}`}
        >
          <DescriptionCommentSection
            userId={userId}
            descriptionId={item.id}
            type={item.type}
            hideFooter={true}
            forceOpen={showComments}
            onCommentCountChange={onCommentCountChange}
          />
        </div>
      )}

      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton stateSetter={setSelectedImage} stateValue={null} />
            <img src={selectedImage} alt="Zoom" />
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveFeedbackCardMobile;
