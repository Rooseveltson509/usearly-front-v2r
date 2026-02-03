import "./AdminAILoading.scss";

export default function AdminAILoading() {
  return (
    <div className="ai-loading-screen">
      <div className="ai-loading-card">
        <div className="ai-orb" />

        <h2>Analyse en cours</h2>

        <ul className="ai-steps">
          <li className="active">Analyse des données…</li>
          <li>Identification des signaux critiques…</li>
          <li>Priorisation des marques à risque…</li>
          <li>Génération des recommandations…</li>
        </ul>
      </div>
    </div>
  );
}
