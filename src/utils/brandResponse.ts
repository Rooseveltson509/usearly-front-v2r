import { getBrandLogo } from "@src/utils/brandLogos";
import { getBrandThemeColor } from "@src/utils/getBrandThemeColor";
import type {
  BrandAvatarData,
  HasBrandResponse,
} from "@src/types/brandResponse";

type BrandResponseSeed = {
  brand?: string | null;
  displayName?: string | null;
  siteUrl?: string | null;
  avatar?: string | null;
  logoUrl?: string | null;
  imageUrl?: string | null;
  brandColor?: string | null;
  primaryColor?: string | null;
  color?: string | null;
};

const isBrandResponseObject = (
  value: HasBrandResponse | undefined,
): value is BrandAvatarData =>
  Boolean(
    value &&
    typeof value === "object" &&
    ("avatar" in value ||
      "pseudo" in value ||
      "displayName" in value ||
      "logoUrl" in value ||
      "imageUrl" in value ||
      "siteUrl" in value ||
      "type" in value ||
      "brandColor" in value ||
      "primaryColor" in value ||
      "color" in value),
  );

export const normalizeBrandResponse = (
  value: HasBrandResponse | undefined,
  seed: BrandResponseSeed,
): HasBrandResponse => {
  if (!value) return false;

  const fromValue = isBrandResponseObject(value) ? value : undefined;
  const displayName = fromValue?.displayName ?? seed.displayName ?? undefined;
  const pseudo =
    fromValue?.pseudo ??
    displayName ??
    seed.brand ??
    seed.displayName ??
    undefined;
  const siteUrl = fromValue?.siteUrl ?? seed.siteUrl ?? undefined;
  const explicitAvatar =
    fromValue?.avatar ??
    fromValue?.logoUrl ??
    fromValue?.imageUrl ??
    seed.avatar ??
    seed.logoUrl ??
    seed.imageUrl ??
    null;
  const avatar =
    explicitAvatar ??
    (pseudo ? getBrandLogo(pseudo, siteUrl ?? undefined) : null);
  const explicitBrandColor =
    fromValue?.brandColor ??
    fromValue?.primaryColor ??
    fromValue?.color ??
    seed.brandColor ??
    seed.primaryColor ??
    seed.color ??
    undefined;
  const resolvedBrandColor =
    explicitBrandColor ??
    (pseudo ? getBrandThemeColor(pseudo).base : undefined);

  return {
    avatar: avatar ?? null,
    pseudo,
    displayName,
    type: "brand",
    siteUrl,
    logoUrl: fromValue?.logoUrl ?? seed.logoUrl ?? undefined,
    imageUrl: fromValue?.imageUrl ?? seed.imageUrl ?? undefined,
    brandColor: resolvedBrandColor ?? undefined,
    primaryColor: fromValue?.primaryColor ?? seed.primaryColor ?? undefined,
    color: fromValue?.color ?? seed.color ?? undefined,
  };
};

export const getBrandAvatarFromResponse = (
  value: HasBrandResponse | undefined,
): BrandAvatarData | undefined => {
  if (!isBrandResponseObject(value)) return undefined;

  const data = value as BrandAvatarData;
  const resolvedPseudo = data.pseudo ?? data.displayName ?? undefined;
  const resolvedAvatar = data.avatar ?? data.logoUrl ?? data.imageUrl ?? null;

  if (resolvedPseudo !== data.pseudo || resolvedAvatar !== data.avatar) {
    return {
      ...data,
      pseudo: resolvedPseudo,
      avatar: resolvedAvatar,
    };
  }

  return data;
};
