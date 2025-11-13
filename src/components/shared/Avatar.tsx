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
  preferBrandLogo?: boolean;
  siteUrl?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  avatar,
  pseudo,
  type = "user",
  className = "",
  wrapperClassName = "",
  preferBrandLogo = true,
  siteUrl,
}) => {
  const [imgError, setImgError] = useState(false);

  const initial = useMemo(
    () => (pseudo?.trim()?.charAt(0) || "?").toUpperCase(),
    [pseudo],
  );

  const brandKey = type === "brand" ? pseudo?.trim() || "" : "";

  const brandLookup = useMemo(
    () =>
      type === "brand" && preferBrandLogo && brandKey
        ? [{ brand: brandKey, siteUrl }]
        : [],
    [type, preferBrandLogo, brandKey, siteUrl],
  );

  const brandLogos = useBrandLogos(brandLookup);
  const preferredBrandLogo = useMemo(() => {
    if (!brandKey || !brandLogos) return undefined;

    // 🔑 essaye les clés possibles (avec domaine)
    const normalizedKey = brandKey.toLowerCase().trim();
    const domain =
      siteUrl
        ?.replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .split("/")[0]
        .toLowerCase() || "";

    const possibleKeys = [
      `${normalizedKey}|${domain}`,
      `${normalizedKey}|${normalizedKey}.com`,
      normalizedKey,
    ];

    for (const k of possibleKeys) {
      if (brandLogos[k]) return brandLogos[k];
    }

    return undefined;
  }, [brandKey, brandLogos, siteUrl]);

  const resolvedBrandLogo = useMemo(
    () =>
      preferredBrandLogo && preferredBrandLogo !== FALLBACK_BRAND_PLACEHOLDER
        ? preferredBrandLogo
        : null,
    [preferredBrandLogo],
  );
  const fullUrl = useMemo(() => {
    if (type === "brand") {
      // 1️⃣ Si on a un logo validé par le hook, on le garde
      if (
        resolvedBrandLogo &&
        resolvedBrandLogo !== FALLBACK_BRAND_PLACEHOLDER
      ) {
        return resolvedBrandLogo;
      }

      // 2️⃣ Sinon on force une requête backend (même si useBrandLogos n’a rien trouvé)
      if (siteUrl || pseudo) {
        const domain =
          siteUrl
            ?.replace(/^https?:\/\//, "")
            .replace(/^www\./, "")
            .split("/")[0]
            .toLowerCase() || `${pseudo?.toLowerCase().trim()}.com`;

        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        return `${baseUrl}/api/logo?domain=${domain}`;
      }

      // 3️⃣ Sinon avatar basique
      return avatar ?? null;
    }

    // 👤 Cas utilisateur normal
    return getFullAvatarUrl(avatar);
  }, [type, avatar, resolvedBrandLogo, siteUrl, pseudo]);

  /*   const fullUrl = useMemo(() => {
    if (type === "brand") {
      if (preferBrandLogo) {
        return resolvedBrandLogo ?? avatar ?? null;
      }
      return avatar ?? null;
    }
    return getFullAvatarUrl(avatar);
  }, [type, avatar, preferBrandLogo, resolvedBrandLogo]); */

  const isInvalidPlaceholder =
    !fullUrl ||
    fullUrl.includes("placeholderSvg") ||
    fullUrl === FALLBACK_BRAND_PLACEHOLDER;

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
