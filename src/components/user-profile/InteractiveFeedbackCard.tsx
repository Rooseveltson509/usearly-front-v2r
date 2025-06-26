import React, { useState } from "react";
import "./InteractiveFeedbackCard.scss";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import { useAuth } from "@src/services/AuthContext";
import DescriptionReactionSelector from "@src/utils/DescriptionReactionSelector";
import DescriptionCommentSection from "../report-desc-comment/DescriptionCommentSection";

interface Props {
  item: (CoupDeCoeur | Suggestion) & {
    type: "suggestion" | "coupdecoeur";
  };
}

const getFullUrl = (path: string | null) => {
  if (!path) return "/default-avatar.png";
  return `${import.meta.env.VITE_API_BASE_URL}/${path}`;
};

const isValidDate = (value: any) => {
  const d = new Date(value);
  return !isNaN(d.getTime());
};

const InteractiveFeedbackCard: React.FC<Props> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const { userProfile } = useAuth();

  if (!userProfile?.id) return null;

  const toggle = () => setIsOpen((prev) => !prev);
  const toggleText = () => setShowFullText((prev) => !prev);

  const title = item.description?.split(":")[0] || item.emoji || "Feedback";
  const rawDescription = item.description || "";
  const description =
    rawDescription.split(":").slice(1).join(":").trim() || rawDescription;

  return (
    <div
      className={`interactive-feedback-card ${isOpen ? "open" : ""}`}
      onClick={(e) => {
        const isReactionOrComment =
          (e.target as HTMLElement).closest(".feedback-footer") ||
          (e.target as HTMLElement).closest(".description-comment-section");

        if (!isReactionOrComment) toggle();
      }}
    >
      <div className="card-header">
        <div className="emoji">{item.emoji || "💬"}</div>
        <div className="title-section">
          <h3 className="title">{title}</h3>
        </div>
        <div className="card-footer">
          {isValidDate(item.createdAt) && (
            <span className="time">
              {formatDistanceToNow(new Date(item.createdAt), {
                locale: fr,
                addSuffix: true,
              })}
            </span>
          )}
        </div>
      </div>

      {isOpen && (
        <div>
          <div className="feedback-desc">
            <p>
              {showFullText || description.length <= 120
                ? description
                : description.slice(0, 120) + "..."}
              {description.length > 120 && (
                <button
                  className="see-more"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleText();
                  }}
                >
                  {showFullText ? "Voir moins" : "Voir plus"}
                </button>
              )}
            </p>
          </div>
          {item.capture && (
            <div className="capture-wrapper">
              <img
                src={item.capture ?? undefined}
                alt="capture"
                className="capture"
              />
            </div>
          )}

          {/* 🎯 Même structure feedback-footer que ReportCard */}
          <div className="feedback-footer">
            {userProfile?.id && item?.id && (
              <div className="feedback-interactions">
                <div className="interactions-row">
                  {/* <DescriptionReactionSelector
                    userId={userProfile.id}
                    descriptionId={item.id}
                    type={item.type}
                  /> */}
                  <DescriptionCommentSection
                    userId={userProfile.id}
                    descriptionId={item.id}
                    type={item.type}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveFeedbackCard;
