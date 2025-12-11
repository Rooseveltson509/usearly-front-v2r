import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ConfirmAccount.scss";
import {
  confirmEmailRequest,
  resendConfirmationCode,
} from "@src/services/apiService";
import { showToast } from "@src/utils/toastUtils";
import { useAuth } from "@src/services/AuthContext";
import Buttons from "../buttons/Buttons";

export default function ConfirmAccount() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  // Email vient 1) du state (login/register) OU 2) du localStorage
  const email =
    location.state?.email || localStorage.getItem("pendingEmail") || "";

  const { login } = useAuth();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  /* ---------------------------------------------------------- */
  /* 🔥 1. VALIDATION AUTOMATIQUE PAR LIEN                      */
  /* ---------------------------------------------------------- */
  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const { accessToken, user } = await confirmEmailRequest({ token });
        login(accessToken, user);

        showToast("🎉 Ton compte a été confirmé automatiquement !");
        localStorage.removeItem("pendingEmail");
        navigate("/home");
      } catch (err: any) {
        showToast(
          err.response?.data?.message ||
            err.message ||
            "Erreur de validation automatique.",
          "error",
        );
      }
    })();
  }, [token]);

  /* ---------------------------------------------------------- */
  /* 🔥 2. PASTE FIX : permet de coller les 6 chiffres d’un coup */
  /* ---------------------------------------------------------- */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");

    if (!pasted) return;

    const digits = pasted.slice(0, 6).split("");

    if (digits.length === 0) return;

    // Remplit automatiquement les 6 cases
    const newCode = [...code];
    digits.forEach((d, i) => {
      if (i < 6) newCode[i] = d;
    });
    setCode(newCode);

    // Focus la dernière case remplie
    const lastIndex = digits.length - 1;
    inputsRef.current[lastIndex]?.focus();

    e.preventDefault();
  };

  /* ---------------------------------------------------------- */
  /* 🔥 3. Gestion des inputs chiffre par chiffre               */
  /* ---------------------------------------------------------- */
  const handleInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, ""); // garde que chiffres
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  /* ---------------------------------------------------------- */
  /* 🔥 4. Validation du code OTP                               */
  /* ---------------------------------------------------------- */
  const handleSubmit = async () => {
    const otp = code.join("");

    if (otp.length !== 6) {
      showToast("Veuillez entrer un code à 6 chiffres.", "error");
      return;
    }

    try {
      const { accessToken, user } = await confirmEmailRequest({ otp, email });

      login(accessToken, user);
      showToast("🎉 Compte confirmé !");
      localStorage.removeItem("pendingEmail");
      navigate("/home");
    } catch (err: any) {
      showToast(
        err.response?.data?.message ||
          err.message ||
          "Erreur lors de la confirmation.",
        "error",
      );
    }
  };

  /* ---------------------------------------------------------- */
  /* 🔥 5. Renvoyer le code                                     */
  /* ---------------------------------------------------------- */
  const handleResend = async () => {
    try {
      await resendConfirmationCode(email);
      showToast("📩 Nouveau code envoyé !");
    } catch (err: any) {
      showToast(err.message || "Erreur lors du renvoi.", "error");
    }
  };

  /* ---------------------------------------------------------- */
  /* 🔥 6. Auto-focus si pas de token                           */
  /* ---------------------------------------------------------- */
  useEffect(() => {
    if (!token) inputsRef.current[0]?.focus();
  }, [token]);

  /* ---------------------------------------------------------- */
  /* 🔥 7. Rendu                                                */
  /* ---------------------------------------------------------- */

  if (token) {
    return (
      <div className="confirm-account-container">
        <h2>Validation en cours...</h2>
        <p>Merci d’attendre une seconde ⏳</p>
      </div>
    );
  }

  return (
    <div className="confirm-account-container">
      <h2>Vérifie ton compte</h2>

      <div className="code-inputs">
        {code.map((digit, i) => (
          <input
            key={i}
            type="text"
            value={digit}
            maxLength={1}
            ref={(el: HTMLInputElement | null) => {
              inputsRef.current[i] = el;
            }}
            onPaste={handlePaste}
            onChange={(e) => handleInput(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
          />
        ))}
      </div>

      <Buttons
        addClassName="confirm-btn"
        onClick={handleSubmit}
        title="Valider"
      />

      <div className="resend-link" onClick={handleResend}>
        Je n’ai pas reçu mon code
      </div>
    </div>
  );
}
