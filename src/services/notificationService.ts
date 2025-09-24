import { apiService } from "./apiService";

const getAuthToken = () =>
    localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

/**
 * 🔔 Récupérer les notifications non lues
 */
export const getNotifications = async () => {
    const { data } = await apiService.get(`/notifications`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return data;
};

/**
 * ✅ Marquer une notif comme lue
 */
export const markNotificationAsRead = async (id: string) => {
    const { data } = await apiService.post(
        `/notifications/${id}/read`,
        {},
        {
            headers: { Authorization: `Bearer ${getAuthToken()}` },
        }
    );
    return data;
};

/**
 * 🔹 Notifications paginées
 */
export const getAllNotifications = async (page = 1, limit = 10) => {
    const { data } = await apiService.get(`/notifications/all`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return data;
};