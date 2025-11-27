import React from "react";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";
import { useAuth } from "@src/services/AuthContext";
import { truncate } from "@src/utils/stringUtils";
import "./UserBrandLine.scss";

interface UserBrandLineProps {
  userId?: string;
  pseudo?: string;
  email?: string | null;
  brand: string;
  type?: "report" | "suggestion" | "coupdecoeur";
}

const UserBrandLine: React.FC<UserBrandLineProps> = ({
  userId,
  pseudo,
  email,
  brand,
  type = "report",
}) => {
  const { userProfile } = useAuth();

  // ✅ Détermine si c’est l’utilisateur connecté
  const isCurrentUser =
    (userId && userProfile?.id === userId) ||
    (pseudo && userProfile?.pseudo?.toLowerCase() === pseudo.toLowerCase()) ||
    (email && userProfile?.email?.toLowerCase() === email.toLowerCase());

  const displayName = isCurrentUser ? "Moi" : pseudo || "Utilisateur";

  const typeClass =
    type === "suggestion"
      ? "me-badge-suggestion"
      : type === "coupdecoeur"
        ? "me-badge-coupdecoeur"
        : "me-badge-report";

  return (
    <span className="user-brand-line">
      <span
        className={`user-name ${isCurrentUser ? `me-badge ${typeClass}` : ""}`}
      >
        {truncate(displayName)}
      </span>{" "}
      <span className="cross">×</span>{" "}
      <strong>{truncate(capitalizeFirstLetter(brand))}</strong>
    </span>
  );
};

export default UserBrandLine;
