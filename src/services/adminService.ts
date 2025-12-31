import { apiService } from "./apiService";

/* -------------------------------------------------------------------------- */
/* Types */
/* -------------------------------------------------------------------------- */

export interface CreateBrandPayload {
  name: string;
  email: string;
  domain: string;
  offres?: "freemium" | "start" | "start pro" | "premium";
}

export interface CreateBrandResponse {
  success: boolean;
  brand: {
    id: string;
    name: string;
    email: string;
    offres: string;
  };
  tempPassword: string;
}

/* -------------------------------------------------------------------------- */
/* Brand admin types */
/* -------------------------------------------------------------------------- */

export interface AdminBrand {
  id: string;
  name: string;
  domain: string;
  email: string;
  offres: "freemium" | "start" | "start pro" | "premium";
  logo?: string | null;
  isActive: boolean;
  createdAt: string;
}

/* -------------------------------------------------------------------------- */
/* Admin API */
/* -------------------------------------------------------------------------- */

export async function createBrand(
  payload: CreateBrandPayload,
): Promise<CreateBrandResponse> {
  const { data } = await apiService.post<CreateBrandResponse>(
    "/admin/brands",
    payload,
  );
  return data;
}

/* -------------------------------------------------------------------------- */
/* Admin API */
/* -------------------------------------------------------------------------- */

// 📋 Liste des marques
export async function getBrands(): Promise<AdminBrand[]> {
  const { data } = await apiService.get("/admin/brands");
  return Array.isArray(data?.brands) ? data.brands : [];
}

// 🔁 Activer / désactiver une marque
export async function toggleBrandStatus(brandId: string) {
  const { data } = await apiService.patch(`/admin/brands/${brandId}/toggle`);
  return data;
}

// 🔐 Reset mot de passe marque
export async function resetBrandPassword(brandId: string) {
  const { data } = await apiService.post(
    `/admin/brands/${brandId}/reset-password`,
  );
  return data;
}
