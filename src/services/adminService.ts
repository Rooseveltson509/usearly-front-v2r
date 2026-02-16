import type { Sector } from "@src/types/sectors";
import { apiService } from "./apiService";

/* -------------------------------------------------------------------------- */
/* Types */
/* -------------------------------------------------------------------------- */
export type EditableRole = "user" | "admin";

export interface CreateAdminPayload {
  pseudo: string;
  born: string; // ISO ou yyyy-mm-dd
  email: string;
  password: string;
}

export interface CreateBrandPayload {
  name: string;
  email: string;
  domain: string;
  offres?: "freemium" | "start" | "start pro" | "premium";
  sector?: Sector;
}

export interface CreateBrandResponse {
  success: boolean;
  brand: {
    id: string;
    name: string;
    email: string;
    offres: string;
    sector?: Sector;
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
  sector?: string | null;
  pendingEmail?: string | null;
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

/*-------------------------------------------------------------------------- */
/* Sectors API */
/* -------------------------------------------------------------------------- */
export async function getSectors(): Promise<string[]> {
  const { data } = await apiService.get("/admin/sectors");
  return data.sectors;
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

export const updateBrand = async (
  brandId: string,
  payload: {
    domain?: string;
    offres?: string;
    email?: string;
    sector?: string;
  },
) => {
  const res = await apiService.patch(`/admin/brands/${brandId}`, payload);
  return res.data;
};

export const getAdminUsers = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  statuts?: string[],
) => {
  const params: any = { page, limit };

  if (search && search.trim()) {
    params.search = search.trim();
  }

  if (statuts && statuts.length > 0) {
    params.statuts = statuts.join(",");
  }

  const { data } = await apiService.get("/admin/users", { params });
  return data;
};

export const getAdminUserDetail = async (id: string) => {
  const { data } = await apiService.get(`/admin/users/${id}`);
  return data;
};

/* -------------------------------------------------------------------------- */
/* Admin users actions */
/* -------------------------------------------------------------------------- */

// 🔒 Suspendre / réactiver un utilisateur
export const toggleUserSuspension = async (userId: string) => {
  const { data } = await apiService.patch(`/admin/users/${userId}/suspend`);
  return data;
};

// 🗑️ Supprimer un utilisateur (soft delete)
export const deleteUser = async (userId: string) => {
  const { data } = await apiService.delete(`/admin/users/${userId}`);
  return data;
};

// 👮‍♂️ Liste admins
export const getAdmins = async () => {
  const { data } = await apiService.get("/admin/admins");
  return data.admins;
};

// ➕ Créer admin (ROLE = admin forcé backend)
export const createAdmin = async (payload: CreateAdminPayload) => {
  const { data } = await apiService.post("/admin/admins", payload);
  return data.admin;
};

// 🔄 Modifier rôle (user <-> admin)
export const updateAdminRole = async (userId: string, role: EditableRole) => {
  const { data } = await apiService.patch(`/admin/admins/${userId}/role`, {
    role,
  });
  return data;
};

export const getAdminOverviewMetrics = async () => {
  const { data } = await apiService.get("/admin/metrics/overview");
  return data.metrics;
};
export const deleteBrand = async (brandId: string) => {
  await apiService.delete(`/admin/brand/${brandId}`);
};
