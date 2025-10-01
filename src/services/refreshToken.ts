import { apiService } from "@src/services/apiService";
import { storeTokenInCurrentStorage } from "./tokenStorage";

export const refreshToken = async (): Promise<string> => {
  try {
    // 1️⃣ Récupérer le CSRF token
    const csrfRes = await apiService.get("/csrf-token", {
      withCredentials: true,
    });
    const csrfToken = csrfRes.data.csrfToken;

    if (!csrfToken) throw new Error("CSRF Token non reçu");

    // 2️⃣ Appel de l'API de refresh
    const response = await apiService.post(
      "/user/refresh-token",
      {},
      {
        withCredentials: true,
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      },
    );

    const newToken = response.data.accessToken;
    storeTokenInCurrentStorage(newToken);
    return newToken;
  } catch (error) {
    console.error("❌ Erreur lors du refresh token :", error);
    throw error;
  }
};
