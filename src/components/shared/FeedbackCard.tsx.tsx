import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import ReportActionsBarWithReactions from "../shared/ReportActionsBarWithReactions";
import CommentSection from "../comments/CommentSection";
import type { UserGroupedReport["descriptions"][0] } from "@src/types/Reports";

interface Props {
  description: UserGroupedReport["descriptions"][0];
  brand: string;
  siteUrl: string;
  getFullAvatarUrl: (url: string | null | undefined) => string;
  modalImage: string | null;
  setModalImage: (val: string | null) => void;
  showComments: Record<string, boolean>;
  setShowComments: (val: Record<string, boolean>) => void;
  showReactions: Record<string, boolean>;
  setShowReactions: (val: Record<string, boolean>) => void;
  commentsCounts: Record<string, number>;
  localCommentsCounts: Record<string, number>;
  setLocalCommentsCounts: (val: Record<string, number>) => void;
  refreshCommentsKeys: Record<string, number>;
  setRefreshCommentsKeys: (val: Record<string, number>) => void;
  signalementFilters: Record<string, "pertinent" | "recents" | "anciens">;
  setSignalementFilters: (val: Record<string, "pertinent" | "recents" | "anciens">) => void;
  expandedOthers: Record<string, boolean>;
  setExpandedOthers: (val: Record<string, boolean>) => void;
}

const FeedbackCard = ({
  description,
  brand,
  siteUrl,
  getFullAvatarUrl,
  modalImage,
  setModalImage,
  showComments,
  setShowComments,
  showReactions,
  setShowReactions,
  commentsCounts,
  localCommentsCounts,
  setLocalCommentsCounts,
  refreshCommentsKeys,
  setRefreshCommentsKeys,
  signalementFilters,
  setSignalementFilters,
  expandedOthers,
  setExpandedOthers,
}: Props) => {
  return (
    <div className="feedback-card">
      <ReportActionsBarWithReactions
        description={description}
        brand={brand}
        siteUrl={siteUrl}
        getFullAvatarUrl={getFullAvatarUrl}
        modalImage={modalImage}
        setModalImage={setModalImage}
        showReactions={showReactions}
        setShowReactions={setShowReactions}
        showComments={showComments}
        setShowComments={setShowComments}
        commentsCounts={commentsCounts}
        localCommentsCounts={localCommentsCounts}
        setLocalCommentsCounts={setLocalCommentsCounts}
        refreshCommentsKeys={refreshCommentsKeys}
        setRefreshCommentsKeys={setRefreshCommentsKeys}
        signalementFilters={signalementFilters}
        setSignalementFilters={setSignalementFilters}
        expandedOthers={expandedOthers}
        setExpandedOthers={setExpandedOthers}
      />

      {showComments[description.id] && (
        <CommentSection
          descriptionId={description.id}
          key={`${description.id}-${refreshCommentsKeys[description.id] || 0}`}
        />
      )}

      <p className="created-at">
        {formatDistanceToNow(new Date(description.createdAt), {
          locale: fr,
          addSuffix: true,
        }).replace("environ ", "")}
      </p>
    </div>
  );
};

export default FeedbackCard;
