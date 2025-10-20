import { apiService } from "@src/services/apiService";
import { storeTokenInCurrentStorage } from "./tokenStorage";

/**
 * Rafraîchit le token d’accès à partir du refreshToken (cookie sécurisé)
 * Retourne le nouveau accessToken ou null si échec
 */
export const refreshToken = async (): Promise<string | null> => {
  try {
    // 1️⃣ Récupère le CSRF token
    const { data: csrfData } = await apiService.get("/csrf-token", {
      withCredentials: true,
    });
    const csrfToken = csrfData?.csrfToken;
    if (!csrfToken) throw new Error("CSRF Token non reçu");

    // 2️⃣ Appelle l'endpoint de refresh
    const { data } = await apiService.post(
      "/user/refresh-token",
      {},
      {
        withCredentials: true,
        headers: { "X-CSRF-Token": csrfToken },
      },
    );

    const newToken = data?.accessToken;

    // 3️⃣ Vérifie que le token reçu est valide
    if (!newToken || typeof newToken !== "string" || newToken.length < 30) {
      console.warn("🚫 Aucun accessToken valide reçu lors du refresh !");
      return null;
    }

    // 4️⃣ Stocke le token et met à jour Axios
    storeTokenInCurrentStorage(newToken);
    apiService.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

    console.log("✅ Nouveau accessToken obtenu via refresh.");
    return newToken;
  } catch (error) {
    console.error("❌ Erreur lors du refresh token :", error);
    return null;
  }
};
