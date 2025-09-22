import { useNavigate } from "react-router-dom";
import { showToast } from "@src/utils/toastUtils";

type RedirectOptions = {
  onSuccess?: () => void; // callback après succès
};

export const useHandleAuthRedirect = () => {
  const navigate = useNavigate();

  const handleAuthRedirect = (
    response: any,
    { onSuccess }: RedirectOptions = {}
  ) => {
    // ⚠️ Compte non confirmé
    if (response.requiresConfirmation) {
      showToast("⚠️ Ce compte existe déjà mais n'a pas été confirmé. Vérifie ton email.", "warning");
      if (response.userId && response.email) {
        navigate(`/confirm?userId=${response.userId}&email=${encodeURIComponent(response.email)}`);
      }
      return false;
    }

    // ⚠️ Compte expiré
    if (response.expired) {
      showToast("❌ Ce compte a expiré, recrée ton compte.", "error");
      navigate("/signup");
      return false;
    }

    // ✅ Cas normal
    if (onSuccess) onSuccess();
    return true;
  };

  return { handleAuthRedirect };
};
