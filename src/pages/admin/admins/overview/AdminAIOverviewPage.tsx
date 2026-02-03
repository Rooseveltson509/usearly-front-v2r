import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AdminAIOverviewPage.scss";
import {
  AIKpiStrip,
  AISummaryCard,
  AIFocus,
  AIInsightsTable,
} from "./components";
import { getAdminAiOverview } from "@src/services/adminAIService";
import { AICategoryBarChart } from "./components/AICategoryBarChart";
import AdminAILoading from "./loading/AdminAILoading";

export default function AdminAIOverviewPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [aiOnly, setAiOnly] = useState(false);
  const location = useLocation();

  const query =
    (location.state as { query?: string })?.query ?? "Vue globale des marques";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAdminAiOverview(query);
        setData(res);
      } catch {
        setError("Impossible de charger l’analyse AI.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <AdminAILoading />;
  }

  if (error || !data) {
    return (
      <div className="ai-error">
        <button onClick={() => navigate(-1)}>← Retour</button>
        <p>{error}</p>
      </div>
    );
  }

  const { ai, data: rows } = data;
  const filteredRows = aiOnly
    ? rows.filter(
        (r: any) =>
          ai?.focus?.brands?.includes(r.marque) && r.totalDescriptions >= 2,
      )
    : rows;

  return (
    <div className="admin-ai-page">
      <header className="ai-header">
        <button onClick={() => navigate(-1)}>← Marques partenaires</button>
        <h1>Analyse AI</h1>
        <p>Vue globale des marques</p>
      </header>
      <div className="ai-table-controls">
        <div className="ai-toggle">
          <span>Vue</span>

          <button
            className={!aiOnly ? "active" : ""}
            onClick={() => setAiOnly(false)}
          >
            Toutes les données
          </button>

          <button
            className={aiOnly ? "active" : ""}
            onClick={() => setAiOnly(true)}
          >
            Recommandations AI
          </button>
        </div>
      </div>

      <AIKpiStrip ai={ai} />

      <AICategoryBarChart rows={rows} />

      <AISummaryCard ai={ai} />

      <div className="ai-grid">
        <AIInsightsTable rows={filteredRows} focus={ai?.focus} />

        <AIFocus focus={ai?.focus} />
      </div>

      <AIInsightsTable rows={rows} />
    </div>
  );
}
