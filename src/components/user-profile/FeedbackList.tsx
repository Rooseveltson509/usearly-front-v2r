import { useEffect, useState, useRef, useCallback } from "react";
import "./FeedbackList.scss";
import { useAuth } from "@src/services/AuthContext";
import type { CoupDeCoeur, GroupedReport, Suggestion } from "@src/types/Reports";
import type { FeedbackType } from "./FeedbackTabs";
import {
  getGroupedReportsByUser,
  getUserCoupsDeCoeur,
  getUserSuggestions,
} from "@src/services/feedbackService";
import ReportCard from "./ReportCard";
import InteractiveFeedbackCard from "./InteractiveFeedbackCard";

const limit = 10;

interface Props {
  activeTab: FeedbackType;
}

const FeedbackList = ({ activeTab }: Props) => {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [shouldReset, setShouldReset] = useState(true);

  // 🔁 Reset total quand l'onglet change
  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setShouldReset(true);
  }, [activeTab]);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      let newData: any[] = [];

      if (activeTab === "report") {
        const res = await getGroupedReportsByUser(page, limit);
        newData = res.results;
      } else if (activeTab === "coupdecoeur") {
        const res = await getUserCoupsDeCoeur(page, limit);
        newData = res.coupdeCoeurs;
      } else if (activeTab === "suggestion") {
        const res = await getUserSuggestions(page, limit);
        newData = res.suggestions;
      }

      setHasMore(newData.length >= limit);
      setData((prev) => {
        if (page === 1 || shouldReset) return newData;
        return [...prev, ...newData];
      });
    } catch (err: any) {
      setError(err.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, isAuthenticated, hasMore, loading, shouldReset]);

  useEffect(() => {
    if (shouldReset) {
      fetchData();
      setShouldReset(false);
    }
  }, [shouldReset, fetchData]);

  useEffect(() => {
    if (page === 1 && !shouldReset) {
      fetchData().then(() => setIsReady(true));
    }
  }, [page, shouldReset]);

  useEffect(() => {
    if (!loaderRef.current || !hasMore || !isReady || loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && isReady) {
        setPage((prev) => prev + 1);
      }
    });

    observer.current.observe(loaderRef.current!);
  }, [hasMore, isReady, loading]);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  // 🔁 Séparation des signalements par sous-catégorie
  const explodedGroupedReports =
    activeTab === "report"
      ? data.flatMap((report: GroupedReport) =>
        Array.isArray(report.subCategories)
          ? report.subCategories.map((subCategory) => ({
            ...report,
            subCategory,
          }))
          : [] // protection si subCategories est undefined
      )
      : [];


  // 🧠 Regroupement par catégorie + marque
  const groupedByCategoryAndBrand = Array.isArray(explodedGroupedReports)
    ? explodedGroupedReports.reduce((acc, item) => {
      const key = `${item.category || "Autre"}|${item.marque}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, GroupedReport[]>)
    : {};

  const renderCard = (item: any, index: number) => {
    if (activeTab === "report") {
      const cardId = `${item.reportingId}_${item.subCategory?.subCategory || "unknown"}`;
      return (
        <ReportCard
          key={cardId}
          report={{
            ...item,
            subCategories: [item.subCategory],
          }}
          isOpen={openId === cardId}
          onToggle={() => handleToggle(cardId)}
        />
      );
    } else {
      return (
        <InteractiveFeedbackCard
          key={item.id || `feedback-${index}`}
          item={item as CoupDeCoeur | Suggestion}
          initialReactions={(item as any).reactions || []}
        />
      );
    }
  };

  return (
    <div className="feedback-list">
      {data.length === 0 && !loading && !error && (
        <div>Aucun contenu trouvé.</div>
      )}

      {activeTab === "report" ? (
        Object.entries(groupedByCategoryAndBrand).map(([key, reports]) => {
          const [category, marque] = key.split("|");
          return (
            <div key={key} className="category-block">
              <div className="category-header">
                <h2>La catégorie: {category}</h2>
                <span>{Array.isArray(reports) ? reports.length : 0} problème(s) sur {marque}</span>
              </div>

              <div className="report-list">
                {Array.isArray(reports) &&
                  reports.map((item, index) => renderCard(item, index))}
              </div>
            </div>
          );
        })
      ) : (
        data.map((item, index) => renderCard(item, index))
      )}

      <div ref={loaderRef} className="loader">
        {loading && <div>Chargement...</div>}
        {!hasMore && !loading && <div>Fin des résultats</div>}
        {error && <div className="erreur">{error}</div>}
      </div>
    </div>
  );
};

export default FeedbackList;