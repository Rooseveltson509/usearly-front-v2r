import React from "react";

interface Props {
  isExpired?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function VoteButton({ isExpired = false, onClick }: Props) {
  return (
    <button
      className={`vote-button ${isExpired ? "disabled" : ""}`}
      onClick={(e) => {
        if (!isExpired) onClick?.(e);
      }}
      disabled={isExpired}
    >
      {isExpired ? "Expiré" : "Voter"}
    </button>
  );
}
