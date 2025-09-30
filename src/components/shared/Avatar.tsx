import React, { useState } from "react";
import "./Avatar.scss";
import { getFullAvatarUrl } from "@src/utils/avatarUtils";

interface AvatarProps {
  avatar: string | null;
  pseudo?: string;
  type?: "user" | "brand";
  className?: string;
  wrapperClassName?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  avatar,
  pseudo,
  type = "user",
  className = "",
  wrapperClassName = "",
}) => {
  const [imgError, setImgError] = useState(false);

  const initial = pseudo?.charAt(0)?.toUpperCase() || "?";
  const fullUrl = type === "brand" ? avatar || null : getFullAvatarUrl(avatar);

  // Fallback si pas d’URL valide OU erreur de chargement
  const showFallback = !fullUrl || imgError;

  const colorIndex = initial.charCodeAt(0) % 6;
  const colorClass =
    type === "brand"
      ? `avatar-brand-color-${colorIndex}`
      : `avatar-user-color-${colorIndex}`;

  return (
    <div className={`avatar-wrapper-custom ${wrapperClassName}`}>
      {!showFallback ? (
        <img
          src={fullUrl || ""}
          alt={pseudo}
          onError={() => setImgError(true)}
          className={`avatar-img-custom ${className} ${
            type === "brand" ? "brand-logo-img-loaded" : ""
          }`}
        />
      ) : (
        <div
          className={`avatar-fallback-custom ${colorClass} ${className} ${
            type === "brand" ? "brand-fallback" : ""
          }`}
          title={pseudo}
        >
          {initial}
        </div>
      )}
    </div>
  );
};

export default Avatar;
