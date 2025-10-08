import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { apiService } from "@src/services/apiService";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import FlatSubcategoryBlock from "../confirm-reportlist/FlatSubcategoryBlock";
import "./ReportDetail.scss";
import { getBrandLogo } from "@src/utils/brandLogos";

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // 🟢 Récupération du signalement
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

  // ✨ Effet de focus visuel après chargement
  useEffect(() => {
    if (!loading && report) {
      const timeout = setTimeout(() => {
        const el = document.querySelector(".subcategory-block");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("highlight-flash");
          setTimeout(() => el.classList.remove("highlight-flash"), 2500);
        }
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [loading, report]);

  // 🕐 Loading
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

  // 🚫 Aucun report
  if (!report) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Aucun signalement trouvé.
      </div>
    );
  }

  // ✅ Affichage principal
  return (
    <div className="report-detail-page">
      <FlatSubcategoryBlock
        brand={report.reporting?.marque}
        siteUrl={report.reporting?.siteUrl}
        subcategory={report.subCategory}
        descriptions={[report]} // ✅ tableau unique
        brandLogoUrl={getBrandLogo(
          report.reporting?.marque || "",
          report.reporting?.siteUrl || "",
        )}
        capture={report.reporting?.capture} // ✅ capture bien récupérée
        hideFooter={true}
      />
    </div>
  );
};

export default ReportDetail;
