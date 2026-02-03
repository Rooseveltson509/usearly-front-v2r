export function AISummaryCard({ ai }: { ai: any }) {
  return (
    <section className={`ai-summary ${ai?.alertLevel}`}>
      <h2>Résumé exécutif</h2>
      <p>{ai?.summary}</p>
    </section>
  );
}
