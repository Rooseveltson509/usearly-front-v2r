import { useState } from "react";
import { Filter } from "lucide-react";
import "./CriticalTickets.scss";

const tickets = [
  {
    icon: "⏳",
    title: "Undo/Redo limité",
    description:
      "Impossible d'annuler plus de 3 actions, c'est stressant quand on teste plusieurs variantes",
    category: "UX / Fonctionnalités",
    count: 336,
    reactionFirst: "😡",
    reactionSecond: "😠",
  },
  {
    icon: "🎧",
    title: "Support lent",
    description:
      "Réponse reçue après 5 jours, trop long quand on est bloqué sur un bug",
    category: "Service client",
    count: 234,
    reactionFirst: "😠",
    reactionSecond: "😡",
  },
  {
    icon: "🖥️",
    title: "Templates trop basiques",
    description:
      "Les modèles proposés font datés, pas assez modernes par rapport à ce qu'on trouve ailleurs sur le marché, on s'attendait à mieux. Il faudrait des designs plus actuels et variés.",
    category: "Design",
    count: 156,
    reactionFirst: "😠",
    reactionSecond: "😡",
  },
  {
    icon: "🖥️",
    title: "Templates trop basiques",
    description:
      "Les modèles proposés font datés, pas assez modernes par rapport à ce qu'on trouve ailleurs sur le marché, on s'attendait à mieux. Il faudrait des designs plus actuels et variés.",
    category: "Design",
    count: 156,
    reactionFirst: "⏳",
    reactionSecond: "🎧",
  },
];

const priorities = [
  {
    name: "Performance",
    percentage: 50,
    count: 752,
    icon: "⏳",
    color: "#2563eb",
  },
  { name: "Panier", percentage: 30, count: 456, icon: "🛒", color: "#6d28d9" },
  {
    name: "Service client",
    percentage: 15,
    count: 321,
    icon: "🎧",
    color: "#0ea5e9",
  },
];

const DESCRIPTION_PREVIEW_LENGTH = 125;

// Coupe proprement sur le dernier espace et ajoute l’ellipse « … »
function getPreview(text: string, limit = DESCRIPTION_PREVIEW_LENGTH) {
  if (!text) return ["", false];
  if (text.length <= limit) return [text, false];
  const slice = text.slice(0, limit).trimEnd();
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > 10 ? slice.slice(0, lastSpace) : slice;
  return [cut + "…", true];
}

export default function CriticalTickets() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div className="critical-focus">
      <div className="critical-focus__content">
        <div className="critical-focus__left">
          <div className="critical-focus__header">
            <div className="critical-focus__label">Tickets critiques</div>
            <button className="critical-focus__filter">
              <Filter className="h-4 w-4" strokeWidth={1.8} />
              Filtrer
            </button>
          </div>

          <div className="critical-focus__list">
            {tickets.map((ticket) => {
              const isOpen = !!expanded[ticket.title];
              const [preview, isTruncated] = getPreview(ticket.description);

              return (
                <article key={ticket.title} className="critical-ticket">
                  <div className="critical-ticket__main">
                    <div className="critical-ticket__info">
                      <div className="critical-ticket__icon" aria-hidden="true">
                        {ticket.icon}
                      </div>

                      <div className="critical-ticket__body">
                        <div className="critical-ticket__title">
                          {ticket.title} <span>🔥</span>
                        </div>

                        <p className="critical-ticket__description">
                          {isOpen ? ticket.description : preview}
                          {isTruncated && (
                            <>
                              {" "}
                              <button
                                type="button"
                                className="critical-ticket__link"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpanded((prev) => ({
                                    ...prev,
                                    [ticket.title]: !isOpen,
                                  }));
                                }}
                              >
                                {isOpen ? "Voir moins" : "Voir plus"}
                              </button>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <span className="critical-ticket__tag">
                      {ticket.category}
                    </span>
                  </div>

                  <div className="critical-ticket__meta">
                    <div className="critical-ticket__score">
                      <div className="critical-ticket__double-reaction">
                        <span className="critical-ticket__reaction">
                          {ticket.reactionFirst}
                        </span>
                        <span className="critical-ticket__reaction">
                          {ticket.reactionSecond}
                        </span>
                      </div>
                      <span className="critical-ticket__count">
                        {ticket.count}
                      </span>
                    </div>
                    <button className="critical-ticket__cta">
                      Voir le ticket
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* colonne de droite inchangée */}
        <div className="critical-focus__right">
          <div className="priority-header">
            <h3 className="priority-title">
              À traiter en priorité
              <span role="img" aria-label="Feu">
                🔥
              </span>
            </h3>
            <p className="priority-subtitle">
              Tendance des catégories les plus signalées
            </p>
          </div>

          <div className="priority-list">
            {priorities.map((p) => (
              <div key={p.name} className="priority-item">
                <div className="priority-label">
                  <span className="priority-icon">{p.icon}</span>
                </div>
                <div>
                  <span className="priority-name">{p.name}</span>
                  <div className="priority-bar">
                    <span
                      className="priority-bar__fill"
                      style={{
                        width: `${p.percentage}%`,
                        backgroundColor: p.color,
                      }}
                    />
                  </div>
                </div>
                <div className="priority-meta">
                  <span className="priority-percentage">{p.percentage}%</span>
                  <span className="priority-count">
                    😡 <span className="priority-count-score">{p.count}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
