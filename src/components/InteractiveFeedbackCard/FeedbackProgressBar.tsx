import React from "react";

interface Props {
  votes: number;
  max: number;
  expiresInDays: number | null;
  barRef: React.RefObject<HTMLDivElement | null>;
  thumbLeft: number;
  isExpired: boolean;
  starProgressBar: string;
}

const FeedbackProgressBar: React.FC<Props> = ({
  votes,
  max,
  expiresInDays,
  barRef,
  thumbLeft,
  isExpired,
  starProgressBar,
}) => {
  return (
    <div className="feedback-footer">
      <div className={`vote-progress ${isExpired ? "expired" : ""}`}>
        <div className="pg" ref={barRef}>
          <div
            className="pg-fill"
            style={{ width: `${(votes / max) * 100}%` }}
          />
        </div>

        <span className="pg-thumb" style={{ left: `${thumbLeft}px` }}>
          <img src={starProgressBar} alt="progress star" />
        </span>

        <span className="pg-count">
          {votes}/{max}
        </span>

        {expiresInDays !== null && (
          <span className="pg-expire">J-{expiresInDays}</span>
        )}
      </div>
    </div>
  );
};

export default FeedbackProgressBar;
