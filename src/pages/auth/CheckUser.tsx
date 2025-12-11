import InputText from "../../components/inputs/inputsGlobal/InputText";
import { checkMailExists } from "@src/services/apiService";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "./CheckUser.scss";
import Buttons from "@src/components/buttons/Buttons";

function CheckUser() {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement | null>(null);

  async function handleCheckUser() {
    const email = emailRef.current?.value?.trim() ?? "";

    // 🔹 Validation du format email
    if (!email || !email.includes("@")) {
      setError("Veuillez entrer une adresse E-mail valide.");
      return;
    }

    setError("");

    try {
      const { exists } = await checkMailExists(email);

      // 🔥 On passe l’email via location.state (login ou signup le récupère)
      if (exists) {
        navigate("/login", { state: { email } });
      } else {
        navigate("/signup", { state: { email } });
      }
    } catch (err) {
      console.error("Erreur lors de la vérification de l'email :", err);
      setError("Erreur lors de la vérification de l'email.");
    }
  }

  return (
    <div className="check-user-container">
      <div className="check-user-form">
        <h2>Saisi une adresse E-mail pour nous rejoindre ou te connecter</h2>

        <div>
          <InputText
            ref={emailRef}
            id="email"
            label="Email*"
            type="email"
            required
          />
          {error && <p className="error-message">{error}</p>}
        </div>

        <div>
          <Buttons onClick={handleCheckUser} title="Continuer" />
        </div>
      </div>
    </div>
  );
}

export default CheckUser;
