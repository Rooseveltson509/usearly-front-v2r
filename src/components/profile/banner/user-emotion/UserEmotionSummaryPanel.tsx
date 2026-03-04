import type { UserEmotionSummary } from "@src/services/userEmotionService";
import "./UserEmotionSummaryPanel.scss";
import { EMOJI_META } from "@src/components/constants/emojiMeta";

interface Props {
  data: UserEmotionSummary | null;
  loading?: boolean;
}

export default function UserEmotionSummaryPanel({ data, loading }: Props) {
  if (loading || !data || data.emotions.length === 0) return null;

  const { reactionsCount, brandsCount, emotions } = data;
  const [main, ...others] = emotions;
  const diagonalAngles = ["-45deg", "135deg", "-135deg", "45deg"];
  const useDiagonalOrbit = others.length <= diagonalAngles.length;

  return (
    <div className="emotion-summary-card">
      {/* LEFT */}
      <div className="emoji-area">
        {/* EMOJI CENTRAL (le plus utilisé) */}
        <div className="emoji-item emoji-center">
          <span className="emoji-static">{main.emoji}</span>

          {EMOJI_META[main.emoji] && (
            <img
              className="emoji-gif"
              src={EMOJI_META[main.emoji].gif}
              alt={EMOJI_META[main.emoji].label}
            />
          )}

          <div className="emoji-tooltip">
            {EMOJI_META[main.emoji]?.label} ({main.count})
          </div>
        </div>

        {/* EMOJIS SECONDAIRES EN CERCLE */}
        <div className="emoji-orbit">
          {others.map((e, index) => {
            const meta = EMOJI_META[e.emoji];
            const orbitStyle = useDiagonalOrbit
              ? ({
                  "--angle": diagonalAngles[index],
                } as React.CSSProperties)
              : ({
                  "--i": index,
                  "--total": others.length,
                } as React.CSSProperties);

            return (
              <div
                key={e.emoji}
                className={`emoji-item emoji-orbit-item${
                  useDiagonalOrbit ? " emoji-orbit-item--diagonal" : ""
                }`}
                style={orbitStyle}
              >
                <span className="emoji-static">{e.emoji}</span>

                {meta && (
                  <img className="emoji-gif" src={meta.gif} alt={meta.label} />
                )}

                <div className="emoji-tooltip">
                  {meta?.label} ({e.count})
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT */}
      <div className="stats-area">
        <div className="stat-card">
          <span className="stat-value">{reactionsCount}</span>
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
