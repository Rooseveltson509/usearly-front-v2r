export function AIKpiStrip({ ai }: { ai: any }) {
  return (
    <section className="ai-kpis">
      <div className="kpi">
        <strong>{ai?.focus?.brands?.length ?? 0}</strong>
        <span>Marques à risque</span>
      </div>

      <div className="kpi">
        <strong>{ai?.focus?.categories?.length ?? 0}</strong>
        <span>Catégories critiques</span>
      </div>

      <div className={`kpi alert ${ai?.alertLevel}`}>
        <strong>{ai?.alertLevel ?? "unknown"}</strong>
        <span>Niveau global</span>
      </div>
    </section>
  );
}
