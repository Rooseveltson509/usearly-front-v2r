export function AIHighlights({ highlights }: { highlights: string[] }) {
  if (!highlights.length) return null;

  return (
    <section className="ai-highlights">
      <h3>Points clés</h3>
      <ul>
        {highlights.map((h, i) => (
          <li key={i}>{h}</li>
        ))}
      </ul>
    </section>
  );
}
