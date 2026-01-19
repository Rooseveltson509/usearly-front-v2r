import { useParams, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { apiService } from "@src/services/apiService";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import FlatSubcategoryBlock from "../confirm-reportlist/FlatSubcategoryBlock";
import "./ReportDetail.scss";
import UsearlyDraw from "@src/components/background/Usearly";
import type { ReportDetailDescription } from "@src/types/Reports";

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const highlightedCommentId = queryParams.get("commentId");

  //const [report, setReport] = useState<any | null>(null);
  const [report, setReport] = useState<ReportDetailDescription | null>(null);
  const [loading, setLoading] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // 🟢 1. Récupération du signalement
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await apiService.get(`/reports/description/${id}`);
        setReport(data.description);
      } catch (err) {
        console.error("❌ Erreur récupération ReportingDescription:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReport();
  }, [id]);

  // 🟣 2. Scroll vers la carte principale une fois chargée
  useEffect(() => {
    if (!loading && report) {
      const timeout = setTimeout(() => {
        const el = document.querySelector(".subcategory-block");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          // el.classList.add("highlight-flash");
          // setTimeout(() => el.classList.remove("highlight-flash"), 2500);
        }
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [loading, report]);

  // 🟡 3. Scroll vers un commentaire mentionné (si `commentId` présent)
  useEffect(() => {
    if (!highlightedCommentId || loading) return;

    // ⏳ On attend que les commentaires soient vraiment affichés
    const waitAndScroll = () => {
      const target = document.querySelector(
        `[data-comment-id="${highlightedCommentId}"]`,
      );

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.classList.add("highlight-mention");
        setTimeout(() => target.classList.remove("highlight-mention"), 3000);
      } else {
        // Si le commentaire n’est pas encore rendu, on réessaie un peu plus tard
        setTimeout(waitAndScroll, 400);
      }
    };

    // Premier essai après 1 seconde
    const initialTimeout = setTimeout(waitAndScroll, 1000);
    return () => clearTimeout(initialTimeout);
  }, [highlightedCommentId, loading]);

  // 🕐 4. État de chargement
  if (loading) {
    return (
      <div className="report-detail-page">
        <SqueletonAnime
          loaderRef={loaderRef}
          loading={true}
          hasMore={false}
          error={null}
        />
      </div>
    );
  }

  // 🚫 5. Aucun report
  if (!report) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Aucun signalement trouvé.
      </div>
    );
  }

  // ✅ 6. Affichage principal
  return (
    <div className="report-detail-page">
      <h1>Signalement de {report.author.pseudo}</h1>
      <FlatSubcategoryBlock
        brand={report.marque}
        siteUrl={report.siteUrl ?? undefined}
        subcategory={report.subCategory}
        descriptions={[report]}
        capture={report.capture}
        hideFooter={true}
        forceOpenComments={!!highlightedCommentId}
      />

      <UsearlyDraw />
    </div>
  );
};

export default ReportDetail;
