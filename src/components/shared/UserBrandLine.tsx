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

  // ✅ USER SAFE
  const safeUser = {
    id: userId ?? null,
    pseudo: pseudo ?? "Utilisateur",
    email: email ?? null,
  };

  // ✅ CURRENT USER SAFE
  const safeCurrentUser = {
    id: userProfile?.id ?? null,
    pseudo: userProfile?.pseudo?.toLowerCase() ?? null,
    email: userProfile?.email?.toLowerCase() ?? null,
  };

  // ✅ isCurrentUser
  const isCurrentUser =
    (safeUser.id && safeCurrentUser.id === safeUser.id) ||
    (safeUser.pseudo &&
      safeCurrentUser.pseudo === safeUser.pseudo.toLowerCase()) ||
    (safeUser.email && safeCurrentUser.email === safeUser.email.toLowerCase());

  const displayName = isCurrentUser ? "Moi" : safeUser.pseudo;

  // ✅ RESTAURÉ
  const typeClass =
    type === "suggestion"
      ? "me-badge-suggestion"
      : type === "coupdecoeur"
        ? "me-badge-coupdecoeur"
        : "me-badge-report";

  // ⬇️ JSX inchangé
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
