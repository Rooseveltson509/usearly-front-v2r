import { useState } from "react";
import DescriptionCommentSection from "../report-desc-comment/DescriptionCommentSection";
import { getBrandLogo } from "@src/utils/brandLogos";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import type { UserGroupedReport } from "@src/types/Reports";

interface Props {
  brand: string;
  siteUrl: string;
  reports: UserGroupedReport[];
  userProfile: { id?: string } | null;
  isOpen: boolean;
  onToggle: () => void;
}

const UserBrandBlock: React.FC<Props> = ({
  brand,
  reports,
  userProfile,
  isOpen,
  onToggle,
  siteUrl,
}) => {
  const [expandedSub, setExpandedSub] = useState<string | null>(null);
  const [currentIndexes, setCurrentIndexes] = useState<Record<string, number>>(
    {}
  );
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<string, boolean>
  >({});
  const [modalImage, setModalImage] = useState<string | null>(null); // ← AJOUT

  const getFullAvatarUrl = (path: string | null | undefined) => {
    if (!path) return "/default-avatar.png";
    return `${import.meta.env.VITE_API_BASE_URL}/${path}`;
  };

  const lastDate = reports
    .flatMap((r) => r.descriptions)
    .map((d) => new Date(d.createdAt).getTime())
    .sort((a, b) => b - a)[0];

  const totalCount = reports.reduce((sum, r) => {
    const userDescriptions = r.descriptions.filter(
      (d) => d.user.id === userProfile?.id
    );
    return sum + userDescriptions.length;
  }, 0);

  return (
    <div className={`brand-block ${isOpen ? "open" : "close"}`}>
      {/* ---------- BRAND HEADER ---------- */}
      <div className="brand-header" onClick={onToggle}>
        {isOpen ? (
          <>
            <div className="brand-header-open">
              <img
                src={getBrandLogo(brand, siteUrl)}
                alt={brand}
                className="brand-logo"
              />
              <div className="brand-info">
                <h3>
                  {totalCount} signalement{totalCount > 1 ? "s" : ""} sur{" "}
                  <strong>{brand}</strong>
                </h3>
              </div>
            </div>
            <div className="brand-chevron">
              <ChevronDown size={18} />
            </div>
          </>
        ) : (
          <>
            <div className="brand-info">
              <h3>
                {totalCount} signalement{totalCount > 1 ? "s" : ""} sur{" "}
                <strong>{brand}</strong>
              </h3>
            </div>
            <span className="brand-date">
              <span>
                {lastDate
                  ? formatDistanceToNow(new Date(lastDate), {
                      locale: fr,
                      addSuffix: true,
                    })
                  : ""}
              </span>
              <img
                src={getBrandLogo(brand, siteUrl)}
                alt={brand}
                className="brand-logo"
              />
            </span>
          </>
        )}
      </div>

      {/* ---------- SUB-CATEGORIES ---------- */}
      {isOpen && (
        <div className="subcategories-list">
          {reports.map((sub) => {
            const currentIndex = currentIndexes[sub.subCategory] || 0;
            const currentDesc = sub.descriptions[currentIndex];
            const initialDescription = sub.descriptions[0];
            const marques =
              sub.marque.charAt(0).toUpperCase() + sub.marque.slice(1);
            return (
              <div
                key={sub.subCategory}
                className={`subcategory-block ${
                  expandedSub === sub.subCategory ? "open" : ""
                }`}
              >
                {/* ----- Sub-category header ----- */}
                <div
                  className="subcategory-header"
                  onClick={() =>
                    setExpandedSub((prev) =>
                      prev === sub.subCategory ? null : sub.subCategory
                    )
                  }
                >
                  <div className="subcategory-header-left">
                    <img
                      src={getCategoryIconPathFromSubcategory(sub.subCategory)}
                      alt={sub.subCategory}
                      className="subcategory-icon"
                    />
                    <h4>{sub.subCategory}</h4>
                  </div>

                  <div className="subcategory-header-right">
                    <span className="count-badge">{sub.count}</span>
                    <span className="last-updated">
                      {formatDistanceToNow(
                        new Date(initialDescription.createdAt),
                        {
                          locale: fr,
                          addSuffix: true,
                        }
                      )}
                    </span>
                  </div>

                  {expandedSub === sub.subCategory && initialDescription && (
                    <div className="subcategory-user-preview">
                      <div className="subcategory-avatar-wrapper">
                        <img
                          src={
                            initialDescription.user.avatar
                              ? getFullAvatarUrl(initialDescription.user.avatar)
                              : "/default-avatar.png"
                          }
                          alt={initialDescription.user.pseudo}
                          className="user-avatar-overlay"
                        />
                        <img
                          src={getBrandLogo(brand, siteUrl)}
                          alt={brand}
                          className="brand-avatar-circle"
                        />
                      </div>
                      <div className="subcategory-avatar-wrapper-info">
                        <span>
                          {initialDescription.user.pseudo.length > 9
                            ? `${initialDescription.user.pseudo.slice(0, 9)}...`
                            : initialDescription.user.pseudo}
                        </span>
                        <span> X </span>
                        <span>
                          {marques.length > 9
                            ? `${marques.slice(0, 9)}...`
                            : marques}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* ----- Sub-category content ----- */}
                <div className="subcategory-content">
                  {/* Description courte de l’utilisateur “pilote” */}
                  {expandedSub === sub.subCategory && initialDescription && (
                    <div className="subcategory-initial-description">
                      {!expandedDescriptions[sub.subCategory] ? (
                        <>
                          {/* ----------- TEXTE TRONQUÉ ----------- */}
                          {initialDescription.description.slice(0, 120)}
                          {initialDescription.description.length > 120 && "…"}

                          {/* ----------- BOUTON VOIR PLUS ----------- */}
                          {(initialDescription.description.length > 120 ||
                            initialDescription.capture) && (
                            <button
                              className="see-more-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedDescriptions((prev) => ({
                                  ...prev,
                                  [sub.subCategory]: true,
                                }));
                              }}
                            >
                              &nbsp;Voir plus
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          {/* ----------- TEXTE COMPLET ----------- */}
                          {initialDescription.description}

                          {/* ----------- IMAGE CLIQUABLE ----------- */}
                          {initialDescription.capture && (
                            <img
                              src={initialDescription.capture}
                              alt="capture"
                              className="capture-vision"
                              onClick={(e) => {
                                e.stopPropagation();
                                setModalImage(initialDescription.capture);
                              }}
                            />
                          )}
                          {/* ----------- BOUTON VOIR MOINS ----------- */}
                          {(initialDescription.description.length > 120 ||
                            initialDescription.capture) && (
                            <button
                              className="see-more-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedDescriptions((prev) => ({
                                  ...prev,
                                  [sub.subCategory]: false,
                                }));
                              }}
                            >
                              &nbsp;Voir moins
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* ----- Feedback card (toujours visible) ----- */}
                  {expandedSub === sub.subCategory && currentDesc && (
                    <div className="feedback-card open">
                      <div className="others">Signalement pertinents</div>
                      <div className="card-body">
                        <div className="description-slide-container">
                          <div className="slide-content slide">
                            <div className="slide-content-left">
                              <div className="emoji-avatar">
                                {currentDesc.emoji && (
                                  <div className="emoji">
                                    {currentDesc.emoji}
                                  </div>
                                )}
                                <img
                                  src={
                                    currentDesc.user.avatar
                                      ? getFullAvatarUrl(
                                          currentDesc.user.avatar
                                        )
                                      : "/default-avatar.png"
                                  }
                                  alt={currentDesc.user.pseudo}
                                />
                              </div>

                              <div className="description-text">
                                <div className="user-meta">
                                  <span className="pseudo">
                                    {currentDesc.user.pseudo}&nbsp;
                                  </span>
                                  x<span className="brand">&nbsp;{brand}</span>
                                  <span className="time">
                                    &nbsp;⸱&nbsp;
                                    {formatDistanceToNow(
                                      new Date(currentDesc.createdAt),
                                      {
                                        locale: fr,
                                        addSuffix: true,
                                      }
                                    )}
                                  </span>
                                  {userProfile?.id === currentDesc.user.id && (
                                    <span className="badge-me">Moi</span>
                                  )}
                                </div>
                                <div className="text">
                                  {currentDesc.description}
                                </div>
                              </div>
                            </div>
                            {sub.descriptions.length > 1 && (
                              <div className="description-chevrons">
                                <div className="navigation">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCurrentIndexes((prev) => ({
                                        ...prev,
                                        [sub.subCategory]: Math.max(
                                          (prev[sub.subCategory] || 0) - 1,
                                          0
                                        ),
                                      }));
                                    }}
                                    disabled={currentIndex === 0}
                                  >
                                    <ChevronLeft size={18} />
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCurrentIndexes((prev) => ({
                                        ...prev,
                                        [sub.subCategory]: Math.min(
                                          (prev[sub.subCategory] || 0) + 1,
                                          sub.descriptions.length - 1
                                        ),
                                      }));
                                    }}
                                    disabled={
                                      currentIndex ===
                                      sub.descriptions.length - 1
                                    }
                                  >
                                    <ChevronRight size={18} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {userProfile?.id && currentDesc?.id && (
                        <DescriptionCommentSection
                          userId={userProfile.id}
                          descriptionId={currentDesc.id}
                          type="report"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---------- IMAGE MODALE PLEIN ÉCRAN ---------- */}
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

export default UserBrandBlock;
