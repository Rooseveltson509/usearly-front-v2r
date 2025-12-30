import { Filter, MoreVertical, Search } from "lucide-react";
import chatExclamation from "/assets/icons/dashboard/chatExclamation.svg";
import "./PulseChart.scss";

const pulseData = [
  { step: "Recherche", score: 130, emoji: "😐", phase: "before" },
  { step: "Sélection", score: 10, emoji: "😊", phase: "before" },
  { step: "Identification", score: 90, emoji: "😣", phase: "before" },
  { step: "Processus d'achat", score: 112, emoji: "😡", phase: "during" },
  { step: "Commande et livraison", score: 78, emoji: "😖", phase: "after" },
  { step: "Retours et échanges", score: 90, emoji: "😡", phase: "after" },
  { step: "Support client", score: 187, emoji: "😡", phase: "after" },
];

const phaseGroups = [
  { label: "Avant achat", start: 0, end: 2 },
  { label: "Pendant achat", start: 3, end: 4 },
  { label: "Après achat", start: 5, end: 6 },
];

const PulseChart = () => {
  const maxScore = 200;
  const chartHeight = 240;
  const topPadding = 32;
  const bottomPadding = 76;
  const usableHeight = chartHeight - topPadding - bottomPadding;
  const columnWidth = 100 / pulseData.length;

  const mixColor = (
    from: [number, number, number],
    to: [number, number, number],
    t: number,
  ) => {
    const ratio = Math.min(1, Math.max(0, t));
    const r = Math.round(from[0] + (to[0] - from[0]) * ratio);
    const g = Math.round(from[1] + (to[1] - from[1]) * ratio);
    const b = Math.round(from[2] + (to[2] - from[2]) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const getColorForY = (yValue: number) => {
    const normalized = Math.min(
      1,
      Math.max(0, (yValue - topPadding) / usableHeight),
    );
    const midpoint = 0.55;

    if (normalized <= midpoint) {
      const t = normalized / midpoint;
      return mixColor([95, 211, 106], [255, 179, 71], t);
    }

    const t = (normalized - midpoint) / (1 - midpoint);
    return mixColor([255, 179, 71], [255, 77, 79], t);
  };

  const points = pulseData.map((item, index) => {
    const x = columnWidth * (index + 0.5);
    const y = topPadding + (1 - item.score / maxScore) * usableHeight;
    return { ...item, x, y };
  });

  const boundaries = phaseGroups.slice(0, -1).map((group) => {
    const boundaryIndex = group.end + 1;
    return boundaryIndex * columnWidth;
  });

  return (
    <div className="pulse-shell">
      <div className="pulse-header">
        <h2 className="pulse-title">
          <span className="pulse-title-strong">Pulse</span> product
        </h2>
        <div className="pulse-actions">
          <button className="pulse-action">
            <Filter className="h-4 w-4" strokeWidth={1.7} />
            Filtrer
          </button>
          <button className="pulse-action search">
            <Search className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className="pulse-card">
        <div className="phase-labels">
          {phaseGroups.map((group) => {
            const stepCount = group.end - group.start + 1;
            const left = (group.start / pulseData.length) * 100;
            const width = (stepCount / pulseData.length) * 100;
            return (
              <span
                key={group.label}
                className="phase-label"
                style={{ left: `${left}%`, width: `${width}%` }}
              >
                {group.label}
              </span>
            );
          })}
        </div>

        <div className="pulse-stage">
          <div className="pulse-stage-rail">
            {pulseData.map((item, index) => (
              <div
                key={item.step}
                className={`pulse-step ${item.phase} ${
                  index === pulseData.length - 1 ? "last" : ""
                } ${item.step === "Processus d'achat" ? "highlight" : ""}`}
              >
                {item.step}
                {item.step === "Processus d'achat" && " 🔥"}
                {item.step === "Retours et échanges" && " ⚠️"}
                {item.step === "Support client" && " ⚠️"}
              </div>
            ))}
          </div>
          <button className="pulse-more">
            <MoreVertical size={18} strokeWidth={1.8} />
          </button>
        </div>

        <div className="pulse-graph" style={{ height: chartHeight + 70 }}>
          <div className="pulse-axis">
            <div className="axis-bar" />
            <div className="axis-label">Expérience</div>
          </div>

          <div className="pulse-canvas" style={{ height: chartHeight }}>
            <div className="pulse-columns">
              {pulseData.map((_, index) => (
                <div key={index} className="pulse-col" />
              ))}
            </div>

            <div className="pulse-lines">
              {[0, 1, 2, 3].map((line) => (
                <div
                  key={line}
                  className="pulse-line"
                  style={{
                    top: `${topPadding + (line * usableHeight) / 3}px`,
                  }}
                />
              ))}
            </div>

            {boundaries.map((value, index) => (
              <div
                key={value}
                className={`phase-divider divider-${index}`}
                style={{ left: `${value}%` }}
              />
            ))}

            <svg
              className="pulse-svg"
              viewBox={`0 0 100 ${chartHeight}`}
              preserveAspectRatio="none"
            >
              {points.map((point, index) => {
                if (index === points.length - 1) return null;
                const next = points[index + 1];
                const averageY = (point.y + next.y) / 2;
                const strokeColor = getColorForY(averageY);
                return (
                  <line
                    key={`${point.step}-${next.step}`}
                    x1={point.x.toFixed(2)}
                    y1={point.y.toFixed(2)}
                    x2={next.x.toFixed(2)}
                    y2={next.y.toFixed(2)}
                    stroke={strokeColor}
                    strokeWidth="4"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
            </svg>

            <div className="pulse-emojis">
              {points.map((point) => (
                <div
                  key={point.step}
                  className="emoji-point"
                  style={{ left: `${point.x}%`, top: point.y }}
                >
                  <span>{point.emoji}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="pulse-score-bar"
            style={{
              gridTemplateColumns: `60px repeat(${pulseData.length}, 1fr)`,
            }}
          >
            <div className="score-icon">
              <img src={chatExclamation} alt="Alerte" />
            </div>
            {pulseData.map((item, index) => (
              <div
                key={item.step}
                className={`score-value ${index === 3 ? "strong" : ""}`}
              >
                {index === 3 ? <strong>{item.score}</strong> : item.score}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pulse-quote">
        <img
          src="/assets/images/profil/Alex.png"
          alt="Profil"
          className="quote-avatar"
        />
        <div className="quote-text">
          <p className="quote-strong">« Regarde cette ligne.</p>
          <p>
            Elle ne juge pas, elle montre simplement où les utilisateurs
            décrochent. Le reste, c&apos;est ton regard qui doit
            l&apos;interpréter. »
          </p>
        </div>
      </div>
    </div>
  );
};

export default PulseChart;
