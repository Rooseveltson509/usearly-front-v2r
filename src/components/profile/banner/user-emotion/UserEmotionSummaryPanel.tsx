import "./UserEmotionSummaryPanel.scss";

export type UserEmotionSummary = {
  emotionsCount: number;
  brandsCount: number;
  emotions: {
    emoji: string;
    count: number;
  }[];
};

interface Props {
  data: UserEmotionSummary | null;
  loading?: boolean;
}

export default function UserEmotionSummaryPanel({ data, loading }: Props) {
  if (loading || !data || data.emotions.length === 0) return null;

  const { emotionsCount, brandsCount, emotions } = data;
  const [main, ...others] = emotions;

  return (
    <div className="emotion-summary-card">
      {/* LEFT */}
      <div className="emoji-area">
        <span className="emoji-main">{main.emoji}</span>

        <div className="emoji-others">
          {others.map((e) => (
            <span key={e.emoji} className="emoji-small">
              {e.emoji}
            </span>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="stats-area">
        <div className="stat-card">
          <span className="stat-value">{emotionsCount}</span>
          <span className="stat-label">Emotions</span>
        </div>

        <div className="stat-card">
          <span className="stat-value">{brandsCount}</span>
          <span className="stat-label">Marques</span>
        </div>
      </div>
    </div>
  );
}
