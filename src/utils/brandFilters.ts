import { type AdminBrand } from "@src/services/adminService";
import {
  type AdminBrandsFiltersState,
  type LastActionRange,
  type OfferVariant,
} from "@src/types/Filters";

export const getOfferVariant = (
  offer?: AdminBrand["offres"] | string,
): OfferVariant => {
  const normalized = offer?.trim().toLowerCase();
  if (normalized === "freemium") return "freemium";
  if (normalized === "start" || normalized === "start pro") return "start";
  if (normalized === "premium") return "premium";
  return "unknown";
};

export const formatLastAction = (daysAgo: number) => {
  if (daysAgo > 90) return ">3 mois";
  if (daysAgo > 30) return `${Math.floor(daysAgo / 30)}mois`;
  if (daysAgo > 7) return `${Math.floor(daysAgo / 7)}sem`;
  return `${daysAgo}j`;
};

const hashStringToNumber = (value: string) => {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return Math.abs(hash);
};

export const getBrandSector = (brand: AdminBrand) => {
  return brand.sector?.trim() || "Non défini";
};

export const getBrandLastActionDays = (brand: AdminBrand) => {
  const createdAtMs = Date.parse(brand.createdAt);
  const daysSinceCreation = Number.isFinite(createdAtMs)
    ? Math.max(0, Math.floor((Date.now() - createdAtMs) / 86400000))
    : 45;
  const hashedDays = hashStringToNumber(brand.id) % 45;
  return Math.min(daysSinceCreation, hashedDays);
};

export const isLastActionInRange = (
  range: LastActionRange,
  daysAgo: number,
) => {
  if (range === "0-2j") return daysAgo <= 2;
  if (range === "+2j") return daysAgo > 2;
  if (range === "+1semaine") return daysAgo > 7;
  if (range === "+1mois") return daysAgo > 30;
  return true;
};

export const filterBrands = (
  brands: AdminBrand[],
  search: string,
  filters: AdminBrandsFiltersState,
) => {
  const normalizedSearch = search.toLowerCase();
  return brands.filter((brand) => {
    const matchesSearch =
      brand.name.toLowerCase().includes(normalizedSearch) ||
      brand.email.toLowerCase().includes(normalizedSearch);

    const offerVariant = getOfferVariant(brand.offres);
    const matchesPlan =
      filters.plans.length === 0 || filters.plans.includes(offerVariant);

    const brandSector = (brand.sector ?? "").trim().toUpperCase();

    const matchesSector =
      filters.sectors.length === 0 || filters.sectors.includes(brandSector);

    const lastActionDays = getBrandLastActionDays(brand);
    const matchesLastAction = isLastActionInRange(
      filters.lastAction,
      lastActionDays,
    );

    return matchesSearch && matchesPlan && matchesSector && matchesLastAction;
  });
};
