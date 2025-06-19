import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { FeedbackDescription } from "@src/types/Reports";
import { useAuth } from "@src/services/AuthContext";
import DescriptionReactionSelector from "@src/utils/DescriptionReactionSelector";
import DescriptionCommentSection from "@src/components/report-desc-comment/DescriptionCommentSection";
import "./FilteredDescriptionCard.scss"

const getFullAvatarUrl = (path: string | null) => {
  if (!path) return "/default-avatar.png";
  return `${import.meta.env.VITE_API_BASE_URL}/${path}`;
};

interface Props {
  description: FeedbackDescription;
}

const FilteredDescriptionCard = ({ description }: Props) => {
  const { userProfile } = useAuth();
  const isAuthorCurrentUser = userProfile?.id === description.user?.id;

  return (
    <div className="feedback-card open">
      <div className="card-header">
        <div className="header-left">
          <div className="info">
            <h3>{description.emoji || "💬"}</h3>
            <span className="brand-name">{description.brand}</span>
          </div>
        </div>
        <img
          src={getFullAvatarUrl(description.user?.avatar || "")}
          alt="avatar"
          className="brand-avatar"
        />
      </div>

      <div className="card-body">
        <p>{description.description}</p>
        <div className={`user ${isAuthorCurrentUser ? "highlight-self" : ""}`}>
          <img
            src={getFullAvatarUrl(description.user?.avatar || "")}
            alt={description.user?.pseudo}
          />
          <div className="user-meta">
            <span className="pseudo">{description.user?.pseudo}</span>
            <span className="brand">x {description.brand}</span>
          </div>
          {isAuthorCurrentUser && <span className="badge-me">Moi</span>}
          <span className="time">
            {formatDistanceToNow(new Date(description.createdAt), {
              locale: fr,
              addSuffix: true,
            })}
          </span>
        </div>

        {userProfile?.id && description.id && (
          <>
            <div className="feedback-actions">
              <DescriptionReactionSelector
                userId={userProfile.id}
                descriptionId={description.id}
                type={"report"}
              />
            </div>

            <DescriptionCommentSection
              userId={userProfile.id}
              descriptionId={description.id}
              type={"report"}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default FilteredDescriptionCard;