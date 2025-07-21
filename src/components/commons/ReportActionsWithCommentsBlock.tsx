import ReportActionsBarWithReactions from "../shared/ReportActionsBarWithReactions";
import CommentSection from "../comments/CommentSection";
import DescriptionCommentSection from "../report-desc-comment/DescriptionCommentSection";
//import "./ReportActionsWithCommentsBlock.scss";

interface Props {
  subCategory: string;
  userId: string;
  descriptionId: string;
  reportsCount: number;
  commentsCount: number;
  showComments: boolean;
  showReactions: boolean;
  onToggleComments: () => void;
  onToggleReactions: () => void;
  onToggleSimilarReports: () => void;
  refreshKey: number;
  onCommentAdded: () => void;
  onCommentDeleted: () => void;
}

const ReportActionsWithCommentsBlock: React.FC<Props> = ({
  subCategory,
  userId,
  descriptionId,
  reportsCount,
  commentsCount,
  showComments,
  showReactions,
  onToggleComments,
  onToggleReactions,
  onToggleSimilarReports,
  refreshKey,
  onCommentAdded,
  onCommentDeleted,
}) => {
  return (
    <>
      <ReportActionsBarWithReactions
        userId={userId}
        descriptionId={descriptionId}
        reportsCount={reportsCount}
        commentsCount={commentsCount}
        onReactClick={onToggleReactions}
        onCommentClick={onToggleComments}
        onToggleSimilarReports={onToggleSimilarReports}
      />

      {showComments && (
        <>
          <CommentSection
            descriptionId={descriptionId}
            type="report"
            onCommentAdded={onCommentAdded}
            onCommentDeleted={onCommentDeleted}
          />
          <DescriptionCommentSection
            userId={userId}
            descriptionId={descriptionId}
            type="report"
            hideFooter={true}
            refreshKey={refreshKey}
          />
        </>
      )}

      {showReactions && (
        <DescriptionCommentSection
          userId={userId}
          descriptionId={descriptionId}
          type="report"
          modeCompact
        />
      )}
    </>
  );
};

export default ReportActionsWithCommentsBlock;
