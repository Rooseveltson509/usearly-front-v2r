export function AIInsightsTable({
  rows,
  focus,
}: {
  rows: any[];
  focus?: {
    brands?: string[];
    categories?: string[];
  };
}) {
  return (
    <section className="ai-table">
      <h3>Données détaillées</h3>

      <table>
        <thead>
          <tr>
            {/* colonne AI (volontairement vide) */}
            <th className="ai-col"></th>
            <th>Marque</th>
            <th>Catégorie</th>
            <th>Sous-catégorie</th>
            <th>Signalements</th>
            <th>Utilisateurs</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r, i) => {
            const isFocused =
              focus?.brands?.includes(r.marque) && r.totalDescriptions >= 2;

            return (
              <tr key={i} className={isFocused ? "ai-row-focus" : ""}>
                <td className="ai-indicator">
                  {isFocused && <span className="ai-badge">AI</span>}
                </td>
                <td>{r.marque}</td>
                <td>{r.category}</td>
                <td>{r.subCategory}</td>
                <td>{r.totalDescriptions}</td>
                <td>{r.totalUsers}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
