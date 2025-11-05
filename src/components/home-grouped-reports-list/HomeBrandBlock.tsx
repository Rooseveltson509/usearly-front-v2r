import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { PublicGroupedReport } from "@src/types/Reports";
import { getBrandLogo } from "@src/utils/brandLogos";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import DescriptionCommentSection from "@src/components/report-desc-comment/DescriptionCommentSection";
import CommentSection from "@src/components/comments/CommentSection";
import ReportActionsBarWithReactions from "@src/components/shared/ReportActionsBarWithReactions";
import { pastelColors } from "@src/components/constants/pastelColors";
import {
  formatDistance,
  formatDistanceToNow,
  parseISO,
  isAfter,
} from "date-fns";
import { fr } from "date-fns/locale";
import "../user-reports/UserBrandBlock.scss";
import { getCommentsCountForDescription } from "@src/services/commentService";
import { getFullAvatarUrl } from "@src/utils/avatarUtils";
import Avatar from "../shared/Avatar";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";

interface Props {
  brand: string;
  siteUrl: string;
  reports: PublicGroupedReport[];
}

const HomeBrandBlock: React.FC<Props> = ({ brand, siteUrl, reports }) => {
  const [expandedSub, setExpandedSub] = useState<string | null>(null);
  const [expandedOthers, setExpandedOthers] = useState<Record<string, boolean>>(
    {},
  );
  const [showAll, setShowAll] = useState<Record<string, boolean>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [showReactions, setShowReactions] = useState<Record<string, boolean>>(
    {},
  );
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [, setCommentsCounts] = useState<Record<string, number>>({});
  const [localCommentsCounts, setLocalCommentsCounts] = useState<
    Record<string, number>
  >({});
  const [refreshCommentsKeys, setRefreshCommentsKeys] = useState<
    Record<string, number>
  >({});
  const [openBrands, setOpenBrands] = useState<Record<string, boolean>>({});
  const [signalementFilters, setSignalementFilters] = useState<
    Record<string, "pertinent" | "recents" | "anciens">
  >({});
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

  const uniqueSubCategoriesMap = reports
    .flatMap((report) => report.subCategories)
    .reduce(
      (acc, sub) => {
        if (!acc[sub.subCategory]) {
          acc[sub.subCategory] = {
            ...sub,
            descriptions: [...sub.descriptions],
            count: sub.descriptions.length, // on force le vrai count
          };
        } else {
          // Ajout des nouvelles descriptions SANS doublons
          const existingDescriptions = acc[sub.subCategory].descriptions;
          const newDescriptions = sub.descriptions.filter(
            (desc) => !existingDescriptions.some((d) => d.id === desc.id),
          );

          acc[sub.subCategory].descriptions = [
            ...existingDescriptions,
            ...newDescriptions,
          ];
          acc[sub.subCategory].count = acc[sub.subCategory].descriptions.length; // recalcul réel
        }

        return acc;
      },
      {} as Record<string, PublicGroupedReport["subCategories"][number]>,
    );

  const uniqueSubCategories = Object.values(uniqueSubCategoriesMap);

  const getMostRecentDate = () => {
    let latest: Date | null = null;

    for (const sub of reports) {
      for (const desc of sub.subCategories?.[0]?.descriptions ?? []) {
        const date = parseISO(desc.createdAt);
        if (!latest || isAfter(date, latest)) {
          latest = date;
        }
      }
    }

    return latest;
  };

  const mostRecentDate = getMostRecentDate();

  return (
    <div className={`brand-block ${openBrands[brand] ? "open" : "close"}`}>
      <div className="brand-header" onClick={() => toggleBrand(brand)}>
        <Avatar
          avatar={getBrandLogo(brand, siteUrl)}
          pseudo={brand}
          type="brand"
          wrapperClassName="brand-logo"
        />
        <p className="brand-reports-count">
          <strong>{uniqueSubCategories.length}</strong> signalement
          {uniqueSubCategories.length > 1 ? "s" : ""} sur{" "}
          <strong>{brand}</strong>
        </p>
        <p className="date-card">
          {mostRecentDate
            ? `Il y a ${formatDistance(mostRecentDate, new Date(), {
                locale: fr,
                includeSeconds: true,
              }).replace("environ ", "")}`
            : "Date inconnue"}
        </p>
      </div>

      {openBrands[brand] && (
        <div className="subcategories-list">
          {uniqueSubCategories.map((sub, j) => {
            const initialDescription = sub.descriptions[0];
            const additionalDescriptions = sub.descriptions.slice(1);
            const hasMoreThanTwo = additionalDescriptions.length > 2;
            const filter = signalementFilters[sub.subCategory] || "pertinent";

            const sortedDescriptions = [...additionalDescriptions].sort(
              (a, b) => {
                if (filter === "recents")
                  return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                  );
                if (filter === "anciens")
                  return (
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                  );
                return 0;
              },
            );

            const displayedDescriptions = expandedOthers[sub.subCategory]
              ? showAll[sub.subCategory]
                ? sortedDescriptions
                : sortedDescriptions.slice(0, 2)
              : [];

            return (
              <div
                key={sub.subCategory}
                className={`subcategory-block ${expandedSub === sub.subCategory ? "open" : ""}`}
                style={{
                  backgroundColor: pastelColors[j % pastelColors.length],
                }}
              >
                <div
                  className="subcategory-header"
                  onClick={() =>
                    setExpandedSub((prev) =>
                      prev === sub.subCategory ? null : sub.subCategory,
                    )
                  }
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
                    {expandedSub !== sub.subCategory && (
                      <div className="badge-count">
                        {sub.descriptions.length}
                      </div>
                    )}
                    {expandedSub !== sub.subCategory && (
                      <span className="date-subcategory">
                        {formatDistanceToNow(
                          new Date(initialDescription.createdAt),
                          {
                            locale: fr,
                            addSuffix: true,
                          },
                        ).replace("environ ", "")}
                      </span>
                    )}
                    {sub.subCategory === expandedSub && (
                      <div className="subcategory-user-brand-info">
                        <div className="avatars-row">
                          <img
                            src={getFullAvatarUrl(
                              initialDescription.user?.avatar || null,
                            )}
                            alt="avatar"
                            className="avatar user-avatar"
                          />
                          <img
                            src={getBrandLogo(brand, siteUrl)}
                            alt={brand}
                            className="avatar brand-logo"
                          />
                        </div>
                        <div className="user-brand-names">
                          {initialDescription.user?.pseudo}{" "}
                          <span className="x">×</span> {""}
                          <strong>{capitalizeFirstLetter(brand)}</strong>
                        </div>
                      </div>
                    )}

                    {expandedSub === sub.subCategory ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </div>
                </div>

                {expandedSub === sub.subCategory && (
                  <div className="subcategory-content">
                    <div className="main-description">
                      <p className="description-text">
                        {initialDescription.description}
                      </p>
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
                      userId={""}
                      descriptionId={initialDescription.id}
                      reportsCount={sub.count}
                      commentsCount={
                        localCommentsCounts[initialDescription.id] ?? 0
                      }
                      onReactClick={() =>
                        setShowReactions((prev) => ({
                          ...prev,
                          [sub.subCategory]: !prev[sub.subCategory],
                        }))
                      }
                      onCommentClick={() => {
                        setShowComments((prev) => {
                          const newState = !prev[sub.subCategory];
                          if (newState) setExpandedOthers({});
                          return { ...prev, [sub.subCategory]: newState };
                        });
                      }}
                      onToggleSimilarReports={() => {
                        setExpandedOthers((prev) => ({
                          ...prev,
                          [sub.subCategory]: !prev[sub.subCategory],
                        }));
                        setShowComments({});
                      }}
                    />

                    {showComments[sub.subCategory] && (
                      <>
                        <CommentSection
                          descriptionId={initialDescription.id}
                          type="report"
                          onCommentAdded={() => {
                            setLocalCommentsCounts((prev) => ({
                              ...prev,
                              [initialDescription.id]:
                                (prev[initialDescription.id] ?? 0) + 1,
                            }));
                            setRefreshCommentsKeys((prev) => ({
                              ...prev,
                              [initialDescription.id]:
                                (prev[initialDescription.id] ?? 0) + 1,
                            }));
                          }}
                          onCommentDeleted={() => {
                            setLocalCommentsCounts((prev) => ({
                              ...prev,
                              [initialDescription.id]: Math.max(
                                (prev[initialDescription.id] ?? 1) - 1,
                                0,
                              ),
                            }));
                            setRefreshCommentsKeys((prev) => ({
                              ...prev,
                              [initialDescription.id]:
                                (prev[initialDescription.id] ?? 0) + 1,
                            }));
                          }}
                        />

                        <DescriptionCommentSection
                          userId=""
                          descriptionId={initialDescription.id}
                          type="report"
                          hideFooter
                          refreshKey={
                            refreshCommentsKeys[initialDescription.id] ?? 0
                          }
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

                    {expandedOthers[sub.subCategory] && (
                      <>
                        <div className="other-descriptions">
                          <div className="signalement-filter">
                            <label
                              htmlFor={`filter-${sub.subCategory}`}
                              className="filter-label"
                            >
                              Trier par :
                            </label>
                            <select
                              id={`filter-${sub.subCategory}`}
                              value={filter}
                              onChange={(e) =>
                                setSignalementFilters((prev) => ({
                                  ...prev,
                                  [sub.subCategory]: e.target.value as
                                    | "pertinent"
                                    | "recents"
                                    | "anciens",
                                }))
                              }
                              className="filter-select"
                            >
                              <option value="pertinent">
                                Les plus pertinents
                              </option>
                              <option value="recents">Les plus récents</option>
                              <option value="anciens">Les plus anciens</option>
                            </select>
                          </div>

                          {displayedDescriptions.map((desc) => (
                            <div className="feedback-card" key={desc.id}>
                              <div className="feedback-avatar">
                                <div className="feedback-avatar-wrapper">
                                  <Avatar
                                    avatar={desc.user?.avatar || null}
                                    pseudo={desc.user?.pseudo || "?"}
                                    type="user"
                                    className="avatar"
                                    wrapperClassName="avatar-wrapper-override"
                                  />
                                  {desc.emoji && (
                                    <div className="emoji-overlay">
                                      {desc.emoji}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="feedback-content">
                                <div className="feedback-meta">
                                  <span className="pseudo">
                                    {desc.user?.pseudo}
                                  </span>
                                  <span className="brand"> · {brand}</span>
                                  <span className="time">
                                    ·{" "}
                                    {formatDistanceToNow(
                                      new Date(desc.createdAt),
                                      {
                                        locale: fr,
                                        addSuffix: true,
                                      },
                                    )}
                                  </span>
                                </div>
                                <p className="feedback-text">
                                  {desc.description}
                                </p>
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
                              setShowAll((prev) => ({
                                ...prev,
                                [sub.subCategory]: true,
                              }));
                            }}
                          >
                            <ChevronDown size={14} /> Afficher plus de
                            signalements
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modalImage && (
        <div
          className="image-modal-overlay"
          onClick={() => setModalImage(null)}
        >
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
