import React, { useEffect, useRef, useState, useMemo } from "react";
import "./UserVotesCard.scss";
import { getUserVotes } from "@src/services/suggestionService";
import { useNavigate } from "react-router-dom";
import { useBrandLogos } from "@src/hooks/useBrandLogos";
import { FALLBACK_BRAND_PLACEHOLDER } from "@src/utils/brandLogos";
import suggestIcon from "../../../public/assets/icons/suggestSimpleIcon.svg";

interface Suggestion {
  id: string;
  title: string;
  totalVotes: number;
  createdAt: string;
  emoji?: string;
  marque?: string;
  expiresInDays: number;
  siteUrl?: string;
  targetVotes?: number;
}

const getBrandInitials = (brand?: string) =>
  brand
    ? brand
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
    : "";

const UserVotesCard: React.FC = () => {
  const [votes, setVotes] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [, setCollapsedHeight] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // 🧠 1️⃣ Récupère les votes utilisateur
  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const data = await getUserVotes();
        setVotes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Erreur getUserVotes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVotes();
  }, []);

  // ⚡ 2️⃣ Prépare les entrées pour les logos
  const brandEntries = useMemo(() => {
    return votes
      .filter((v) => !!v.marque)
      .map((v) => ({
        brand: v.marque!,
        siteUrl: v.siteUrl || undefined,
      }));
  }, [votes]);

  // 🔄 3️⃣ Récupère les logos via le hook
  const logos = useBrandLogos(brandEntries);

  // 🧩 4️⃣ Gestion hauteur collapsée
  useEffect(() => {
    if (!votes.length) {
      setCollapsedHeight(null);
      return;
    }

    const listEl = listRef.current;
    if (!listEl) {
      setCollapsedHeight(null);
      return;
    }

    const computeHeight = () => {
      const items = Array.from(
        listEl.querySelectorAll<HTMLDivElement>(".vote-item"),
      );

      if (items.length <= 2) {
        setCollapsedHeight(null);
        return;
      }

      const secondItem = items[1];
      const paddingBottom = parseFloat(
        window.getComputedStyle(listEl).paddingBottom || "0",
      );
      const nextHeight =
        secondItem.offsetTop + secondItem.offsetHeight + paddingBottom;

      setCollapsedHeight((prev) => {
        if (prev === null) return nextHeight;
        return Math.abs(prev - nextHeight) > 1 ? nextHeight : prev;
      });
    };

    computeHeight();
    window.addEventListener("resize", computeHeight);
    return () => window.removeEventListener("resize", computeHeight);
  }, [votes, logos]);

  useEffect(() => {
    if (votes.length <= 2 && isExpanded) {
      setIsExpanded(false);
    }
  }, [votes.length, isExpanded]);

  if (loading) return <p>Chargement...</p>;
  if (!votes.length) return null;

  const hasMoreVotes = votes.length > 3;
  const listEl = listRef.current;
  const listElChildren = listEl?.children;
  const firstVoteItem = listElChildren
    ? (listElChildren[0]?.scrollHeight ?? 0)
    : 0;
  const secondVoteItem = listElChildren
    ? (listElChildren[1]?.scrollHeight ?? 0)
    : 0;
  const thirdVoteItem = listElChildren
    ? (listElChildren[2]?.scrollHeight ?? 0)
    : 0;
  const heightTwoFirstVoteItem =
    firstVoteItem + secondVoteItem + thirdVoteItem + 65;
  const collapsedMaxHeightValue =
    listElChildren && listElChildren.length > 1
      ? heightTwoFirstVoteItem
      : listElChildren && listElChildren.length > 0
        ? (listElChildren[0]?.scrollHeight ?? 0)
        : 0;
  const expandedMaxHeight = heightTwoFirstVoteItem + 120;

  const listStyle: React.CSSProperties | undefined = hasMoreVotes
    ? isExpanded
      ? { maxHeight: `${expandedMaxHeight}px` }
      : {
          maxHeight: `${collapsedMaxHeightValue}px`,
          height: `${collapsedMaxHeightValue}px`,
        }
    : undefined;

  return (
    <div className="user-votes-card">
      <div className="votes-header">
        <span aria-hidden="true" className="sparkles">
          ✨
        </span>
        <h3 className="votes-title">Mes votes en cours</h3>
      </div>

      <div
        id="user-votes-list"
        ref={listRef}
        className={`votes-list scrollable ${
          hasMoreVotes ? (isExpanded ? "expanded" : "collapsed") : "expanded"
        }`}
        style={listStyle}
      >
        {votes.map((s) => {
          const expiresLabel =
            s.expiresInDays <= 0 ? "J-0" : `J-${s.expiresInDays}`;
          const logo =
            (s.marque && logos[s.marque]) || FALLBACK_BRAND_PLACEHOLDER;
          const voteTarget = s.targetVotes ?? 300;

          return (
            <div key={s.id} className="vote-item">
              <div className="vote-left">
                <span className="vote-icon" aria-hidden="true">
                  <img
                    width="20"
                    height="20"
                    src={suggestIcon}
                    alt=""
                    aria-hidden="true"
                  />
                </span>
                <div className="vote-content">
                  <p
                    className="vote-title clickable"
                    onClick={() => navigate(`/suggestions/${s.id}`)}
                  >
                    {s.title}
                  </p>

                  <div className="vote-meta">
                    <span className="progress">
                      <span className="progress-icon" aria-hidden="true">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7 7C8.38071 7 9.5 5.88071 9.5 4.5C9.5 3.11929 8.38071 2 7 2C5.61929 2 4.5 3.11929 4.5 4.5C4.5 5.88071 5.61929 7 7 7Z"
                            fill="currentColor"
                          />
                          <path
                            d="M2.75 11.625C2.75 9.66094 4.28594 8.125 6.25 8.125H7.75C9.71406 8.125 11.25 9.66094 11.25 11.625C11.25 11.8321 11.0821 12 10.875 12H3.125C2.91789 12 2.75 11.8321 2.75 11.625Z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>
                      <span className="progress-value">
                        {s.totalVotes ?? 0}/{voteTarget}
                      </span>
                    </span>
                    <span
                      className={`date ${s.expiresInDays <= 0 ? "expired" : ""}`}
                    >
                      {expiresLabel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="vote-brand" aria-hidden={!s.marque}>
                {logo && logo !== FALLBACK_BRAND_PLACEHOLDER ? (
                  <img src={logo} alt={`Logo ${s.marque}`} />
                ) : (
                  <span className="brand-placeholder">
                    {getBrandInitials(s.marque)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hasMoreVotes && (
        <div className="votes-toggle-wrapper">
          <button
            type="button"
            className="votes-toggle"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            aria-controls="user-votes-list"
          >
            {isExpanded ? "Voir moins" : "Voir plus"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserVotesCard;
