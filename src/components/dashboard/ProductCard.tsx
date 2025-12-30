import { useState } from "react";
import UserStatsCard from "./UserStatsCard";
import chronometerIcon from "/assets/icons/dashboard/chrono.svg";
import chatValideIcon from "/assets/icons/dashboard/chatValide.svg";
import "./ProductCard.scss";

const ProductCard = () => {
  const [resolvedTickets, setResolvedTickets] = useState(50);
  const totalTickets = 78;
  const completion =
    totalTickets > 0
      ? Math.min(100, Math.max(0, (resolvedTickets / totalTickets) * 100))
      : 0;

  const handleRangeChange = (value: number) => {
    if (Number.isNaN(value)) return;
    const clampedValue = Math.min(totalTickets, Math.max(0, value));
    setResolvedTickets(clampedValue);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[296px]">
      <UserStatsCard dashboard={true} />
      <div className="bg-white h-fit rounded-2xl border border-gray-200 p-6 space-y-6 shadow-[0_12px_32px_rgba(15,23,42,0.08)] product-card">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground leading-tight">
            Tickets résolus
          </h3>
          <div className="flex items-end gap-3">
            <div className="relative flex-1 pt-5">
              <div className="bubble-label" style={{ left: `${completion}%` }}>
                <div className="bubble">{resolvedTickets}</div>
              </div>
              <div className="ticket-range-track">
                <div className="ticket-range-rail">
                  <div
                    className="ticket-range-fill"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <input
                  type="range"
                  id="resolved-tickets"
                  min={0}
                  max={totalTickets}
                  value={resolvedTickets}
                  onChange={(e) => handleRangeChange(Number(e.target.value))}
                  className="ticket-range no-thumb"
                />
              </div>
            </div>
            <span className="text-lg font-semibold text-foreground -mb-1">
              {totalTickets}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 flex items-center justify-center">
              <img src={chronometerIcon} alt="" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground leading-none">
                12h
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Temps moyen de réponse
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 flex items-center justify-center">
              <img src={chatValideIcon} alt="" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-foreground leading-none">
                60<span className="text-lg align-top">%</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Taux de réponse
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center">
          <button className="p-3 px-5 rounded-full border border-foreground text-foreground text-sm font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all">
            Voir plus
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
