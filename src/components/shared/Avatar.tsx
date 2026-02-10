import React, { useState, useMemo, useEffect } from "react";
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
  sizeHW?: number;
  fallbackInitial?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  avatar,
  pseudo,
  type = "user",
  className = "",
  wrapperClassName = "",
  preferBrandLogo = true,
  siteUrl,
  sizeHW = 50,
  fallbackInitial,
}) => {
  const [imgError, setImgError] = useState(false);
  const [dbBrandLogo, setDbBrandLogo] = useState<string | null>(null);
  const [, setLoadingDbLogo] = useState(false);

  const baseInitial = useMemo(() => {
    if (!pseudo) return "?";
    const parts = pseudo.trim().split(" ").filter(Boolean);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }, [pseudo]);

  useEffect(() => {
    if (
      type !== "brand" ||
      !preferBrandLogo ||
      !siteUrl ||
      dbBrandLogo !== null
    ) {
      return;
    }

    const domain = siteUrl
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0]
      .toLowerCase();

    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    setLoadingDbLogo(true);

    fetch(`${baseUrl}/api/brand/by-domain/${domain}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.logo) {
          setDbBrandLogo(data.logo);
        }
      })
      .catch(() => {
        // silence volontaire → fallback existant
      })
      .finally(() => {
        setLoadingDbLogo(false);
      });
  }, [type, preferBrandLogo, siteUrl, dbBrandLogo]);

  const displayInitial = useMemo(() => {
    const override = fallbackInitial?.trim()?.charAt(0);
    return (override || baseInitial).toUpperCase();
  }, [fallbackInitial, baseInitial]);

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
      // 🟢 1. Logo BDD
      if (preferBrandLogo && dbBrandLogo) {
        return dbBrandLogo;
      }

      // 🟡 2. Logos détectés existants
      if (
        preferBrandLogo &&
        resolvedBrandLogo &&
        resolvedBrandLogo !== FALLBACK_BRAND_PLACEHOLDER
      ) {
        return resolvedBrandLogo;
      }

      // 🟠 3. Favicon / logo externe
      if (preferBrandLogo && (siteUrl || pseudo)) {
        const domain =
          siteUrl
            ?.replace(/^https?:\/\//, "")
            .replace(/^www\./, "")
            .split("/")[0]
            .toLowerCase() || `${pseudo?.toLowerCase().trim()}.com`;

        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        return `${baseUrl}/api/logo?domain=${domain}`;
      }

      return avatar ?? null;
    }

    // 👤 User
    return getFullAvatarUrl(avatar);
  }, [
    type,
    avatar,
    preferBrandLogo,
    dbBrandLogo,
    resolvedBrandLogo,
    siteUrl,
    pseudo,
  ]);

  const isInvalidPlaceholder =
    !fullUrl ||
    fullUrl.includes("placeholderSvg") ||
    fullUrl === FALLBACK_BRAND_PLACEHOLDER;

  const shouldShowImage =
    !imgError &&
    !isInvalidPlaceholder &&
    (type !== "brand" || preferBrandLogo || !!avatar);

  const colorIndex = displayInitial.charCodeAt(0) % 6;
  const colorClass =
    type === "brand"
      ? `avatar-brand-color-${colorIndex}`
      : `avatar-user-color-${colorIndex}`;

  return (
    <div className={`avatar-wrapper-custom ${wrapperClassName}`}>
      {shouldShowImage ? (
        <img
          style={{ width: sizeHW, height: sizeHW }}
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
          style={{ width: sizeHW, height: sizeHW }}
          className={`avatar-fallback-custom ${colorClass} ${className} ${
            type === "brand" ? "brand-fallback" : ""
          }`}
          title={pseudo}
          aria-label={pseudo || "Avatar fallback"}
        >
          {displayInitial}
        </div>
      )}
    </div>
  );
};

export default Avatar;
