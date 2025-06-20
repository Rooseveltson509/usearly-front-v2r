import axios from "axios";
import type { RegisterData } from "@src/types/RegisterData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const API_VERSION = import.meta.env.VITE_API_VERSION || "api/v1";

export const apiService = axios.create({
  baseURL: `${API_BASE_URL}/${API_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
});

interface RegisterResponse {
  userId: string;
  email: string;
}
export const loginUser = async ({
  email,
  password,
  rememberMe,
}: {
  email: string;
  password: string;
  rememberMe: boolean;
}) => {
  try {
    const response = await apiService.post("/user/login", {
      email,
      password,
      rememberMe,
    });

    return response.data; // contient accessToken + user { avatar, type: 'user' }
  } catch (error: any) {
    const msg =
      error.response?.data?.message || "Erreur lors de la connexion utilisateur.";
    throw new Error(msg);
  }
};

export const loginBrand = async ({
  email,
  mdp,
  rememberMe,
}: {
  email: string;
  mdp: string;
  rememberMe: boolean;
}) => {
  try {
    const response = await apiService.post("/brand/login", {
      email,
      mdp,
      rememberMe,
    });

    return response.data; // contient accessToken + user { avatar, type: 'brand' }
  } catch (error: any) {
    const msg =
      error.response?.data?.message || "Erreur lors de la connexion marque.";
    throw new Error(msg);
  }
};

export const registerUser = async (
  data: RegisterData
): Promise<RegisterResponse> => {
  try {
    const { data: response } = await apiService.post<RegisterResponse>(
      "/user/register",
      data
    );
    return response;
  } catch (error: unknown) {
    let errorMessage = "Erreur inconnue lors de l’inscription.";

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.error || errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const confirmEmailRequest = async (data: { userId: string; token: string }) => {
  const response = await apiService.post("/user/confirm", data);
  return response.data;
};

export const resendConfirmationCode = async (email: string) => {
  const response = await apiService.post("/user/resend-confirmation", { email });
  return response.data;
};
export const requestResetPassword = async (email: string) => {
  const res = await apiService.post("/user/request-reset", { email });
  return res.data;
};

export const resetPassword = async ({
  token,
  newPassword,
  confirmPassword,
}: {
  token: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const res = await apiService.post("/user/reset-password", {
    token,
    newPassword,
    confirmPassword,
  });

  return res.data;
};

export const updateUserProfile = async (formData: FormData) => {
  try {
    const response = await apiService.patch("/user/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.user;
  } catch (error: any) {
    const msg = error.response?.data?.error || "Erreur lors de la mise à jour du profil.";
    throw new Error(msg);
  }
};

export const updatePassword = async ({
  oldPassword,
  newPassword,
  confirmPassword,
}: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  try {
    const response = await apiService.put("/user/update-password", {
      oldPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.error || "Erreur lors de la mise à jour du mot de passe.";
    throw new Error(msg);
  }
};

export const deleteUserProfile = async () => {
  try {
    const response = await apiService.delete("/user/profile");
    return response.data;
  } catch (error: any) {
    const msg = error.response?.data?.error || "Erreur lors de la suppression du compte.";
    throw new Error(msg);
  }
};


