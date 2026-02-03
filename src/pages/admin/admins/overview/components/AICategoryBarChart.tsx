import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS: Record<string, string> = {
  "Connexion & Compte": "#6366f1",
  Paiement: "#ef4444",
  "Affichage & design": "#22c55e",
  "Autre souci": "#f59e0b",
  "Service client": "#06b6d4",
};

export function AICategoryBarChart({ rows }: { rows: any[] }) {
  // 🔄 agrégation marque + catégorie
  const data = Object.values(
    rows.reduce((acc: any, r: any) => {
      if (!acc[r.marque]) acc[r.marque] = { marque: r.marque };
      acc[r.marque][r.category] =
        (acc[r.marque][r.category] || 0) + r.totalDescriptions;
      return acc;
    }, {}),
  );

  const categories = [...new Set(rows.map((r) => r.category))];

  return (
    <section className="ai-chart-card">
      <h3>Signalements par marque & catégorie</h3>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <XAxis dataKey="marque" />
          <YAxis />
          <Tooltip />
          {categories.map((cat) => (
            <Bar
              key={cat}
              dataKey={cat}
              stackId="a"
              fill={COLORS[cat] ?? "#94a3b8"}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
