import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { PublicGroupedReport } from "@src/types/Reports";
import { getBrandLogo } from "@src/utils/brandLogos";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import DescriptionCommentSection from "@src/components/report-desc-comment/DescriptionCommentSection";
import CommentSection from "@src/components/comments/CommentSection";
import ReportActionsBarWithReactions from "@src/components/shared/ReportActionsBarWithReactions";
import { pastelColors } from "@src/components/constants/pastelColors";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import "./UserBrandBlock.scss";
import { getCommentsCountForDescription } from "@src/services/commentService";

interface Props {
  brand: string;
  siteUrl: string;
  reports: PublicGroupedReport[];
}

const HomeBrandBlock: React.FC<Props> = ({ brand, siteUrl, reports }) => {
  const [expandedSub, setExpandedSub] = useState<string | null>(null);
  const [expandedOthers, setExpandedOthers] = useState<Record<string, boolean>>({});
  const [showAll, setShowAll] = useState<Record<string, boolean>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [showReactions, setShowReactions] = useState<Record<string, boolean>>({});
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [commentsCounts, setCommentsCounts] = useState<Record<string, number>>({});
  const [localCommentsCounts, setLocalCommentsCounts] = useState<Record<string, number>>({});
  const [refreshCommentsKeys, setRefreshCommentsKeys] = useState<Record<string, number>>({});
  const [openBrands, setOpenBrands] = useState<Record<string, boolean>>({});
  const [signalementFilters, setSignalementFilters] = useState<Record<string, "pertinent" | "recents" | "anciens">>({});


  const getFullAvatarUrl = (path: string | null | undefined) => {
    if (!path) return "/default-avatar.png";
    return `${import.meta.env.VITE_API_BASE_URL}/${path}`;
  };

  const toggleBrand = (brand: string) => {
    setOpenBrands((prev) => ({
      ...prev,
      [brand]: !prev[brand],
    }));
  };

  useEffect(() => {
    const fetchAllCounts = async () => {
      const newCounts: Record<string, number> = {};

      for (const report of reports) {
        for (const sub of report.subCategories) {
          for (const desc of sub.descriptions) {
            try {
              const res = await getCommentsCountForDescription(desc.id);
              newCounts[desc.id] = res.data.commentsCount ?? 0;
            } catch {
              newCounts[desc.id] = 0;
            }
          }
        }
      }

      setCommentsCounts(newCounts);
      setLocalCommentsCounts(newCounts);
    };

    fetchAllCounts();
  }, [reports]);

  return (
    <div className={`brand-block ${openBrands[brand] ? "open" : "close"}`}>
      <div className="brand-header" onClick={() => toggleBrand(brand)}>
        <img src={getBrandLogo(brand, siteUrl)} alt={brand} className="brand-logo" />
        <h3 className="brand-title">{brand}</h3>
        <p className="brand-reports-count">
          {
            reports.reduce((set, report) => {
              report.subCategories.forEach(sub => set.add(sub.subCategory));
              return set;
            }, new Set<string>()).size
          } Problèmes sur <strong>brand</strong>
        </p>

      </div>

      {openBrands[brand] && (
        <div className="subcategories-list">
          {reports.flatMap((report, i) => report.subCategories.map((sub, j) => {
            const initialDescription = sub.descriptions[0];
            const additionalDescriptions = sub.descriptions.slice(1);
            const hasMoreThanTwo = additionalDescriptions.length > 2;
            const sortedDescriptions = [...additionalDescriptions].sort((a, b) => {
              const filter = signalementFilters[sub.subCategory] || "pertinent";
              if (filter === "recents") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              if (filter === "anciens") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              return 0;
            });

            const displayedDescriptions = expandedOthers[sub.subCategory]
              ? showAll[sub.subCategory]
                ? sortedDescriptions
                : sortedDescriptions.slice(0, 2)
              : [];


            return (
              <div
                key={sub.subCategory}
                className={`subcategory-block ${expandedSub === sub.subCategory ? "open" : ""}`}
                style={{ backgroundColor: pastelColors[j % pastelColors.length] }}
              >
                <div
                  className="subcategory-header"
                  onClick={() => setExpandedSub(prev => (prev === sub.subCategory ? null : sub.subCategory))}
                >
                  <div className="subcategory-left">
                    <img
                      src={getCategoryIconPathFromSubcategory(sub.subCategory)}
                      alt={sub.subCategory}
                      className="subcategory-icon"
                    />
                    <h4>{sub.subCategory}</h4>
                  </div>
                  <div className="subcategory-right">
                    <span className="subcategory-count">{sub.count}</span>
                    {expandedSub === sub.subCategory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {expandedSub === sub.subCategory && (
                  <div className="subcategory-content">
                    <div className="main-description">

                      <p className="description-text">{initialDescription.description}</p>
                      {initialDescription.capture && (
                        <img
                          src={initialDescription.capture}
                          alt="capture"
                          className="description-capture"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalImage(initialDescription.capture);
                          }}
                        />
                      )}
                    </div>

                    <ReportActionsBarWithReactions
                      userId=""
                      descriptionId={initialDescription.id}
                      reportsCount={sub.count}
                      commentsCount={localCommentsCounts[initialDescription.id] ?? 0}
                      onReactClick={() =>
                        setShowReactions(prev => ({ ...prev, [sub.subCategory]: !prev[sub.subCategory] }))
                      }
                      onCommentClick={() => {
                        setShowComments(prev => {
                          const newState = !prev[sub.subCategory];
                          if (newState) setExpandedOthers({});
                          return { ...prev, [sub.subCategory]: newState };
                        });
                      }}
                      onToggleSimilarReports={() => {
                        setExpandedOthers(prev => ({ ...prev, [sub.subCategory]: true }));
                        setShowComments({});
                      }}

                    />

                    {showComments[sub.subCategory] && (
                      <>
                        <CommentSection
                          descriptionId={initialDescription.id}
                          type="report"
                          onCommentAdded={() => {
                            setLocalCommentsCounts(prev => ({
                              ...prev,
                              [initialDescription.id]: (prev[initialDescription.id] ?? 0) + 1,
                            }));
                            setRefreshCommentsKeys(prev => ({
                              ...prev,
                              [initialDescription.id]: (prev[initialDescription.id] ?? 0) + 1,
                            }));
                          }}
                          onCommentDeleted={() => {
                            setLocalCommentsCounts(prev => ({
                              ...prev,
                              [initialDescription.id]: Math.max((prev[initialDescription.id] ?? 1) - 1, 0),
                            }));
                            setRefreshCommentsKeys(prev => ({
                              ...prev,
                              [initialDescription.id]: (prev[initialDescription.id] ?? 0) + 1,
                            }));
                          }}
                        />

                        <DescriptionCommentSection
                          userId=""
                          descriptionId={initialDescription.id}
                          type="report"
                          hideFooter={true}
                          refreshKey={refreshCommentsKeys[initialDescription.id] ?? 0}
                        />

                      </>
                    )}

                    {showReactions[sub.subCategory] && (
                      <DescriptionCommentSection
                        userId=""
                        descriptionId={initialDescription.id}
                        type="report"
                        modeCompact
                      />
                    )}

                    {additionalDescriptions.length > 0 && !expandedOthers[sub.subCategory] && (
                      <button
                        className="see-more-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowComments({});
                          setExpandedOthers(prev => ({ ...prev, [sub.subCategory]: true }));
                        }}
                      >
                        <ChevronDown size={14} /> Afficher les signalements similaires ({additionalDescriptions.length})
                      </button>
                    )}

                    {expandedOthers[sub.subCategory] && (
                      <>
                        <div className="other-descriptions">
                          <div className="signalement-filter">
                            <label htmlFor={`filter-${sub.subCategory}`} className="filter-label">Trier par :</label>
                            <select
                              id={`filter-${sub.subCategory}`}
                              value={signalementFilters[sub.subCategory] || "pertinent"}
                              onChange={(e) => {
                                setSignalementFilters((prev) => ({
                                  ...prev,
                                  [sub.subCategory]: e.target.value as "pertinent" | "recents" | "anciens",
                                }));
                              }}
                              className="filter-select"
                            >
                              <option value="pertinent">Les plus pertinents</option>
                              <option value="recents">Les plus récents</option>
                              <option value="anciens">Les plus anciens</option>
                            </select>
                          </div>
                          {displayedDescriptions.map(desc => (
                            <div className="feedback-card" key={desc.id}>
                              <div className="feedback-avatar">
                                <div className="feedback-avatar-wrapper">
                                  <img
                                    src={getFullAvatarUrl(desc.user?.avatar)}
                                    alt={desc.user?.pseudo}
                                    className="avatar"
                                  />
                                  {desc.emoji && <div className="emoji-overlay">{desc.emoji}</div>}
                                </div>
                              </div>
                              <div className="feedback-content">
                                <div className="feedback-meta">
                                  <span className="pseudo">{desc.user?.pseudo}</span>
                                  <span className="brand"> · {brand}</span>
                                  <span className="time"> · {formatDistanceToNow(new Date(desc.createdAt), { locale: fr, addSuffix: true })}</span>
                                </div>
                                <p className="feedback-text">{desc.description}</p>
                                <DescriptionCommentSection
                                  userId=""
                                  descriptionId={desc.id}
                                  type="report"
                                  modeCompact
                                  triggerType="text"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        {hasMoreThanTwo && !showAll[sub.subCategory] && (
                          <button
                            className="see-more-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAll(prev => ({ ...prev, [sub.subCategory]: true }));
                            }}
                          >
                            <ChevronDown size={14} /> Afficher plus de signalements
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          }))}
        </div>
      )}
      {modalImage && (
        <div className="image-modal-overlay" onClick={() => setModalImage(null)}>
          <img
            src={modalImage}
            alt="capture agrandie"
            className="image-modal"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default HomeBrandBlock;
