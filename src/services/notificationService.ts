import { apiService } from "./apiService";

const getAuthToken = () =>
  localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

/**
 * 🔔 Récupérer les notifications non lues (mini liste, ex: header)
 */
export const getNotifications = async () => {
  const { data } = await apiService.get(`/notifications`, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  return data;
};

/**
 * ✅ Marquer une notification comme lue
 */
export const markNotificationAsRead = async (id: string) => {
  const { data } = await apiService.patch(
    `/notifications/${id}/read`, // ✅ PATCH au lieu de POST
    {},
    {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    },
  );
  return data;
};

/**
 * 📜 Récupérer toutes les notifications avec pagination + filtre
 */
export const getAllNotifications = async (
  page = 1,
  limit = 10,
  type: "all" | "suggestion" | "coupdecoeur" | "report" = "all",
) => {
  const { data } = await apiService.get(`/notifications/all`, {
    params: {
      page,
      limit,
      ...(type !== "all" && { type }), // ✅ Ajoute le filtre uniquement si ≠ all
    },
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  return data;
};

/**
 * ❌ Supprimer une notification
 */
export const deleteNotification = async (id: string) => {
  const { data } = await apiService.delete(`/notifications/${id}`, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  return data;
};
