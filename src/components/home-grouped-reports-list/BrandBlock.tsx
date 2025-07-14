import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import DescriptionCommentSection from "@src/components/report-desc-comment/DescriptionCommentSection";
import { getBrandLogo } from "@src/utils/brandLogos";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import type { PublicGroupedReport } from "@src/types/Reports";
import { useAuth } from "@src/services/AuthContext";
import "./BrandBlock.scss"; // ✅ Assure-toi d'y avoir les styles refactorés

interface Props {
  brand: string;
  siteUrl: string;
  reports: PublicGroupedReport[];
}

const BrandBlock: React.FC<Props> = ({ brand, siteUrl, reports }) => {
  const { userProfile } = useAuth();
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [currentIndexes, setCurrentIndexes] = useState<Record<string, number>>({});

  const toggleSubCategory = (subCategory: string) => {
    setExpandedSubCategory((prev) => (prev === subCategory ? null : subCategory));
  };

  const handlePrev = (subCategory: string) => {
    setCurrentIndexes((prev) => ({
      ...prev,
      [subCategory]: Math.max((prev[subCategory] || 0) - 1, 0),
    }));
  };

  const handleNext = (subCategory: string, length: number) => {
    setCurrentIndexes((prev) => ({
      ...prev,
      [subCategory]: Math.min((prev[subCategory] || 0) + 1, length - 1),
    }));
  };

  const lastDate = Math.max(
    ...reports.flatMap((r) =>
      r.subCategories.flatMap((sc) =>
        sc.descriptions.map((d) => new Date(d.createdAt).getTime())
      )
    )
  );

  const totalCount = reports.reduce((sum, r) => sum + r.totalCount, 0);

  const getFullAvatarUrl = (path: string | null | undefined) => {
    if (!path) return "/default-avatar.png";
    return `${import.meta.env.VITE_API_BASE_URL}/${path}`;
  };

  return (
    <div className={`brand-block ${expanded ? "open" : ""}`}>
      <div className="brand-header" onClick={() => setExpanded(!expanded)}>
        <div className="brand-info">
          <h3>
            {totalCount} signalement{totalCount > 1 ? "s" : ""} sur{" "}
            <strong>{brand}</strong>
          </h3>
        </div>
        <span className="brand-date">
          {lastDate
            ? formatDistanceToNow(new Date(lastDate), { locale: fr, addSuffix: true })
            : ""}
        </span>
        <img src={getBrandLogo(brand, siteUrl)} alt={brand} className="brand-logo" />
      </div>

      {expanded && (
        <div className="subcategories-list">
          {reports
            .flatMap((report) => report.subCategories)
            .map((sub) => {
              const currentIndex = currentIndexes[sub.subCategory] || 0;
              const currentDesc = sub.descriptions[currentIndex];

              return (
                <div
                  key={sub.subCategory}
                  className={`subcategory-block ${expandedSubCategory === sub.subCategory ? "open" : ""}`}
                >
                  <div
                    className="subcategory-header"
                    onClick={() => toggleSubCategory(sub.subCategory)}
                  >
                    <img
                      src={getCategoryIconPathFromSubcategory(sub.subCategory)}
                      alt={sub.subCategory}
                      className="subcategory-icon"
                    />
                    <h4>{sub.subCategory}</h4>
                    <span className="count-badge">{sub.count}</span>
                  </div>

                  {expandedSubCategory === sub.subCategory && currentDesc && (
                    <div className="feedback-card open">
                      <div className="feedback-avatar">
                        <div className="feedback-avatar-wrapper">
                          <img
                            src={getFullAvatarUrl(currentDesc.user?.avatar)}
                            alt={currentDesc.user?.pseudo || "Utilisateur"}
                            className="avatar"
                          />
                          {currentDesc.emoji && (
                            <div className="emoji-overlay">{currentDesc.emoji}</div>
                          )}
                        </div>
                      </div>
                      <div className="feedback-content">
                        <div className="feedback-meta">
                          <span className="pseudo">{currentDesc.user?.pseudo}</span>
                          {userProfile?.id === currentDesc.user?.id && <span className="badge-me">Moi</span>}
                          <span className="brand"> · {brand}</span>
                          <span className="time">
                            ·{" "}
                            {formatDistanceToNow(new Date(currentDesc.createdAt), {
                              locale: fr,
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="feedback-text">{currentDesc.description}</p>

                        {sub.descriptions.length > 1 && (
                          <div className="description-chevrons">
                            <div className="navigation">
                              <button
                                onClick={() => handlePrev(sub.subCategory)}
                                disabled={currentIndex === 0}
                              >
                                <ChevronLeft size={18} />
                              </button>
                              <button
                                onClick={() =>
                                  handleNext(sub.subCategory, sub.descriptions.length)
                                }
                                disabled={currentIndex === sub.descriptions.length - 1}
                              >
                                <ChevronRight size={18} />
                              </button>
                            </div>
                          </div>
                        )}

                        {userProfile?.id && currentDesc?.id && (
                          <DescriptionCommentSection
                            userId={userProfile.id}
                            descriptionId={currentDesc.id}
                            type="report"
                            autoOpenIfComments
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default BrandBlock;

/* import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import DescriptionCommentSection from "@src/components/report-desc-comment/DescriptionCommentSection";
import { getBrandLogo } from "@src/utils/brandLogos";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import type { PublicGroupedReport } from "@src/types/Reports";
import { useAuth } from "@src/services/AuthContext";

interface Props {
  brand: string;
  siteUrl: string;
  reports: PublicGroupedReport[];
}

const BrandBlock: React.FC<Props> = ({ brand, siteUrl, reports }) => {
  const { userProfile } = useAuth();
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [currentIndexes, setCurrentIndexes] = useState<Record<string, number>>({});

  const toggleSubCategory = (subCategory: string) => {
    setExpandedSubCategory((prev) => (prev === subCategory ? null : subCategory));
  };

  const handlePrev = (subCategory: string) => {
    setCurrentIndexes((prev) => ({
      ...prev,
      [subCategory]: Math.max((prev[subCategory] || 0) - 1, 0),
    }));
  };

  const handleNext = (subCategory: string, length: number) => {
    setCurrentIndexes((prev) => ({
      ...prev,
      [subCategory]: Math.min((prev[subCategory] || 0) + 1, length - 1),
    }));
  };

  const lastDate = Math.max(
    ...reports.flatMap((r) =>
      r.subCategories.flatMap((sc) =>
        sc.descriptions.map((d) => new Date(d.createdAt).getTime())
      )
    )
  );

  const totalCount = reports.reduce((sum, r) => sum + r.totalCount, 0);

  return (
    <div className={`brand-block ${expanded ? "open" : ""}`}>
      <div className="brand-header" onClick={() => setExpanded(!expanded)}>
        <div className="brand-info">
          <h3>
            {totalCount} signalement{totalCount > 1 ? "s" : ""} sur{" "}
            <strong>{brand}</strong>
          </h3>
        </div>
        <span className="brand-date">
          {lastDate
            ? formatDistanceToNow(new Date(lastDate), { locale: fr, addSuffix: true })
            : ""}
        </span>
        <img src={getBrandLogo(brand, siteUrl)} alt={brand} className="brand-logo" />
      </div>

      {expanded && (
        <div className="subcategories-list">
          {reports
            .flatMap((report) => report.subCategories)
            .map((sub) => {
              const currentIndex = currentIndexes[sub.subCategory] || 0;
              const currentDesc = sub.descriptions[currentIndex];

              return (
                <div
                  key={sub.subCategory}
                  className={`subcategory-block ${expandedSubCategory === sub.subCategory ? "open" : ""}`}
                >
                  <div
                    className="subcategory-header"
                    onClick={() => toggleSubCategory(sub.subCategory)}
                  >
                    <img
                      src={getCategoryIconPathFromSubcategory(sub.subCategory)}
                      alt={sub.subCategory}
                      className="subcategory-icon"
                    />
                    <h4>{sub.subCategory}</h4>
                    <span className="count-badge">{sub.count}</span>
                  </div>

                  {expandedSubCategory === sub.subCategory && currentDesc && (
                    <div className="feedback-card open">
                      <div className="card-body">
                        <div className="description-slide-container">
                          <div className="slide-content slide">
                            <div className="emoji-avatar">
                              {currentDesc.emoji && (
                                <div className="emoji">{currentDesc.emoji}</div>
                              )}
                              <img
                                src={
                                  currentDesc.user?.avatar
                                    ? `${import.meta.env.VITE_API_BASE_URL}/${currentDesc.user.avatar}`
                                    : "/default-avatar.png"
                                }
                                alt={currentDesc.user?.pseudo || "Utilisateur"}
                              />
                            </div>
                            <div className="description-text">
                              <div className="user-meta">
                                <span className="pseudo">{currentDesc.user?.pseudo}&nbsp;</span>
                                <span className="brand">&nbsp;{brand}</span>
                                <span className="time">
                                  ⸱{" "}
                                  {formatDistanceToNow(new Date(currentDesc.createdAt), {
                                    locale: fr,
                                    addSuffix: true,
                                  })}
                                </span>
                                {currentDesc.user?.id === userProfile?.id && (
                                  <span className="badge-me">Moi</span>
                                )}
                              </div>
                              <div className="text">{currentDesc.description}</div>
                            </div>
                            {sub.descriptions.length > 1 && (
                              <div className="description-chevrons">
                                <div className="navigation">
                                  <button
                                    onClick={() => handlePrev(sub.subCategory)}
                                    disabled={currentIndex === 0}
                                  >
                                    <ChevronLeft size={18} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleNext(sub.subCategory, sub.descriptions.length)
                                    }
                                    disabled={currentIndex === sub.descriptions.length - 1}
                                  >
                                    <ChevronRight size={18} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {userProfile?.id && currentDesc?.id && (
                          <DescriptionCommentSection
                            userId={userProfile.id}
                            descriptionId={currentDesc.id}
                            type="report"
                            autoOpenIfComments
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default BrandBlock;
 */