import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronDown } from "lucide-react";
import type { UserGroupedReportDescription } from "@src/types/Reports";
import DescriptionCommentSection from "../report-desc-comment/DescriptionCommentSection";

interface Props {
  brand: string;
  subCategory: string;
  userProfileId?: string;
  descriptions: UserGroupedReportDescription[];
  showAll: boolean;
  signalementFilter: "pertinent" | "recents" | "anciens";
  onFilterChange: (filter: "pertinent" | "recents" | "anciens") => void;
  onShowMore: () => void;
}

const getFullAvatarUrl = (path: string | null | undefined) => {
  if (!path) return "/default-avatar.png";
  return `${import.meta.env.VITE_API_BASE_URL}/${path}`;
};

const OtherDescriptionsSection = ({
  brand,
  subCategory,
  userProfileId,
  descriptions,
  showAll,
  signalementFilter,
  onFilterChange,
  onShowMore,
}: Props) => {
  const sortedDescriptions = [...descriptions].sort((a, b) => {
    if (signalementFilter === "recents") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (signalementFilter === "anciens") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0; // pertinent: no sorting
  });

  const displayDescriptions = showAll ? sortedDescriptions : sortedDescriptions.slice(0, 2);
  const hasMoreThanTwo = descriptions.length > 2;

  return (
    <div className="other-descriptions">
      <div className="signalement-filter">
        <label htmlFor={`filter-${subCategory}`} className="filter-label">
          Tous les signalements :
        </label>
        <select
          id={`filter-${subCategory}`}
          value={signalementFilter}
          onChange={(e) => onFilterChange(e.target.value as "pertinent" | "recents" | "anciens")}
          className="filter-select"
        >
          <option value="pertinent">Les plus pertinents</option>
          <option value="recents">Les plus récents</option>
          <option value="anciens">Les plus anciens</option>
        </select>
      </div>

      {displayDescriptions.map((desc) => (
        <div className="feedback-card" key={desc.id}>
          <div className="feedback-avatar">
            <div className="feedback-avatar-wrapper">
              <img
                src={getFullAvatarUrl(desc.user.avatar)}
                alt={desc.user.pseudo}
                className="avatar"
              />
              {desc.emoji && <div className="emoji-overlay">{desc.emoji}</div>}
            </div>
          </div>
          <div className="feedback-content">
            <div className="feedback-meta">
              <span className="pseudo">{desc.user.pseudo}</span>
              {userProfileId === desc.user.id && <span className="badge-me">Moi</span>}
              <span className="brand"> · {brand}</span>
              <span className="time">
                {" "}
                · {formatDistanceToNow(new Date(desc.createdAt), { locale: fr, addSuffix: true })}
              </span>
            </div>
            <p className="feedback-text">{desc.description}</p>

            {userProfileId && desc.id && (
              <DescriptionCommentSection
                userId={userProfileId}
                descriptionId={desc.id}
                type="report"
                modeCompact
                triggerType="text"
              />
            )}
          </div>
        </div>
      ))}

      {hasMoreThanTwo && !showAll && (
        <button className="see-more-button" onClick={(e) => {
          e.stopPropagation();
          onShowMore();
        }}>
          <ChevronDown size={14} /> Afficher plus de signalements
        </button>
      )}
    </div>
  );
};

export default OtherDescriptionsSection;
