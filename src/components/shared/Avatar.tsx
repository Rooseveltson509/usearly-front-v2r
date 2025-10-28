import React, { useState, useMemo } from "react";
import "./Avatar.scss";
import { getFullAvatarUrl } from "@src/utils/avatarUtils";
import { FALLBACK_BRAND_PLACEHOLDER } from "@src/utils/brandLogos";
import { useBrandLogos } from "@src/hooks/useBrandLogos";

interface AvatarProps {
  avatar: string | null;
  pseudo?: string;
  type?: "user" | "brand";
  className?: string;
  wrapperClassName?: string;
  /** Optionnel : si false et type="brand", force le fallback lettre même si une URL existe */
  preferBrandLogo?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  avatar,
  pseudo,
  type = "user",
  className = "",
  wrapperClassName = "",
  preferBrandLogo = true,
}) => {
  const [imgError, setImgError] = useState(false);

  const initial = useMemo(
    () => (pseudo?.trim()?.charAt(0) || "?").toUpperCase(),
    [pseudo],
  );

  const brandKey = type === "brand" ? pseudo?.trim() || "" : "";

  const brandLookup = useMemo(
    () => (type === "brand" && preferBrandLogo && brandKey ? [brandKey] : []),
    [type, preferBrandLogo, brandKey],
  );

  const brandLogos = useBrandLogos(brandLookup);
  const preferredBrandLogo =
    brandKey && brandLogos ? brandLogos[brandKey] : undefined;

  const resolvedBrandLogo = useMemo(
    () =>
      preferredBrandLogo && preferredBrandLogo !== FALLBACK_BRAND_PLACEHOLDER
        ? preferredBrandLogo
        : null,
    [preferredBrandLogo],
  );

  // Pour "brand", on prend l’URL telle quelle ; pour "user", on normalise via util.
  const fullUrl = useMemo(() => {
    if (type === "brand") {
      if (preferBrandLogo) {
        return resolvedBrandLogo ?? avatar ?? null;
      }
      return avatar ?? null;
    }
    return getFullAvatarUrl(avatar);
  }, [type, avatar, preferBrandLogo, resolvedBrandLogo]);

  // 🚫 Évite d’afficher le placeholder noir/base64
  const isInvalidPlaceholder =
    !fullUrl ||
    fullUrl.includes("placeholderSvg") ||
    fullUrl === FALLBACK_BRAND_PLACEHOLDER;

  // Doit-on afficher l’image ?
  const shouldShowImage =
    !imgError && !isInvalidPlaceholder && (type !== "brand" || preferBrandLogo);

  const colorIndex = initial.charCodeAt(0) % 6;
  const colorClass =
    type === "brand"
      ? `avatar-brand-color-${colorIndex}`
      : `avatar-user-color-${colorIndex}`;

  return (
    <div className={`avatar-wrapper-custom ${wrapperClassName}`}>
      {shouldShowImage ? (
        <img
          src={fullUrl || ""}
          alt={pseudo || "Avatar"}
          onError={() => setImgError(true)}
          className={`avatar-img-custom ${className} ${
            type === "brand" ? "brand-logo-img-loaded" : ""
          }`}
          decoding="async"
          loading="lazy"
        />
      ) : (
        <div
          className={`avatar-fallback-custom ${colorClass} ${className} ${
            type === "brand" ? "brand-fallback" : ""
          }`}
          title={pseudo}
          aria-label={pseudo || "Avatar fallback"}
        >
          {initial}
        </div>
      )}
    </div>
  );
};

export default Avatar;
