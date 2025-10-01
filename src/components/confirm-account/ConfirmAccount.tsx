import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./ConfirmAccount.scss";
import {
  confirmEmailRequest,
  resendConfirmationCode,
} from "../../services/apiService";
import { showToast } from "@src/utils/toastUtils";
import { useAuth } from "../../services/AuthContext";

const ConfirmAccount = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userId") || "";
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const { login } = useAuth();

  const handleInput = (index: number, value: string) => {
    // autorise uniquement les chiffres
    const digit = value.replace(/[^0-9]/g, "");
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    // focus suivant si rempli
    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const token = code.join("");
    if (token.length !== 6) {
      showToast("Veuillez entrer un code à 6 chiffres.", "error");
      return;
    }

    try {
      const { accessToken, user } = await confirmEmailRequest({
        userId,
        token,
      });

      // Authentification via contexte
      login(accessToken, user); // pas besoin de rememberMe ici
      showToast("✅ Compte confirmé avec succès !");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de la confirmation.";
      showToast(message, "error");
    }
  };

  const handleResend = async () => {
    try {
      await resendConfirmationCode(email);
      showToast("📩 Nouveau code envoyé !");
    } catch (error: any) {
      showToast(error.message || "Erreur lors de la réémission.", "error");
    }
  };

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  return (
    <div className="confirm-account-container">
      <h2>Vérifie ton compte</h2>
      <div className="code-inputs">
        {code.map((digit, i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            value={code[i]}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            onChange={(e) => handleInput(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          />
        ))}
      </div>

      <button className="confirm-btn" onClick={handleSubmit}>
        Valider
      </button>

      <div className="resend-link" onClick={handleResend}>
        Je n’ai pas reçu mon code
      </div>
    </div>
  );
};

export default ConfirmAccount;
