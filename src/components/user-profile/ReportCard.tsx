import React, { useMemo, useState } from "react";
import "./FeedbackCard.scss";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import type { GroupedReport, FeedbackDescription } from "@src/types/Reports";
import { useAuth } from "@src/services/AuthContext";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import DescriptionCommentSection from "../report-desc-comment/DescriptionCommentSection";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReportCardProps {
  report: GroupedReport;
  isOpen: boolean;
  onToggle: () => void;
}

const getFullAvatarUrl = (path: string | null) => {
  if (!path) return "/default-avatar.png";
  return `${import.meta.env.VITE_API_BASE_URL}/${path}`;
};

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  isOpen,
  onToggle,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { userProfile } = useAuth();

  const allDescriptions: FeedbackDescription[] = Array.isArray(
    report.subCategories
  )
    ? report.subCategories.flatMap((sub) => sub.descriptions || [])
    : [];

  const current = allDescriptions[currentIndex] || null;

  const initialDescription = useMemo(() => {
    return report.subCategories?.[0]?.descriptions?.[0] || null;
  }, [report.subCategories]);

  const isAuthorCurrentUser = userProfile?.id === current?.user?.id;

  const handleNext = () => {
    if (currentIndex < allDescriptions.length - 1)
      setCurrentIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const firstSubCategory = report.subCategories?.[0]?.subCategory || "Autre";
  return (
    <div className={`feedback-card ${isOpen ? "open" : ""}`}>
      <div className="card-header" onClick={onToggle}>
        <div className="header-left">
          <span className="category-icon">
            <img
              src={getCategoryIconPathFromSubcategory(firstSubCategory)}
              alt={firstSubCategory}
            />
          </span>
          <div className="info">
            <h3>{firstSubCategory}</h3>
          </div>
          <div className="count-badge">
            {report.subCategories[0]?.descriptions.length || 0}
          </div>
        </div>
      </div>

      {isOpen && current && (
        <div className="card-body">
          <p className="description-p">{initialDescription?.description}</p>
          <div className="description-slide-container">
            <div className="slide-content slide">
              <div className="emoji-avatar">
                <div className="emoji">{current.emoji}</div>
                <img
                  src={getFullAvatarUrl(current.user?.avatar || "")}
                  alt={current.user?.pseudo}
                />
              </div>
              <div className="description-text">
                <div className="user-meta">
                  <span className="pseudo">{current.user?.pseudo}&nbsp;</span>x
                  <span className="brand">&nbsp;{report.marque}</span>
                  &nbsp;
                  <span className="time">
                    ⸱ &nbsp;
                    {current?.createdAt
                      ? formatDistanceToNow(new Date(current.createdAt), {
                          locale: fr,
                          addSuffix: true,
                        })
                      : "Date inconnue"}
                  </span>
                </div>
                <div className="text">{current.description}</div>
              </div>
              <div
                className={`user ${
                  isAuthorCurrentUser ? "highlight-self" : ""
                }`}
              >
                {isAuthorCurrentUser && <span className="badge-me">Moi</span>}
              </div>
              <div className="description-chevrons">
                {allDescriptions.length > 1 && (
                  <div className="navigation">
                    <button onClick={handlePrev} disabled={currentIndex === 0}>
                      <ChevronLeft className="chevron-icon" />
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentIndex === allDescriptions.length - 1}
                    >
                      <ChevronRight className="chevron-icon" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ----- Footer ----- */}
          {userProfile?.id && current?.id && (
            <DescriptionCommentSection
              userId={userProfile.id}
              descriptionId={current.id}
              type="report"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ReportCard;