import { requestResetPassword } from "@src/services/apiService";
import { useState } from "react";
import { showToast } from "@src/utils/toastUtils";
import "./RequestResetPassword.scss";
import InputText from "@src/components/inputs/inputsGlobal/InputText";
import Buttons from "@src/components/buttons/Buttons";

const RequestResetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await requestResetPassword(email);
      const msg = res.message || "Lien de réinitialisation envoyé !";
      setMessage(msg);
      showToast(msg, "success");
    } catch (err: any) {
      const errMsg =
        err.response?.data?.error || err.message || "Erreur inattendue";
      setError(errMsg);
      showToast(errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-request">
      <h2>Réinitialiser mon mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <InputText
          type="email"
          id="email"
          label="Email"
          placeholder=""
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {/* <input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /> */}
        <Buttons
          onClick={handleSubmit}
          title={loading ? "Envoi..." : "Envoyer"}
          disabled={loading}
        />
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default RequestResetPassword;
