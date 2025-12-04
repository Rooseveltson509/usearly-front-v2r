import { resetPassword } from "@src/services/apiService";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ResetPassword.scss";
import { useAuth } from "@src/services/AuthContext";
import { showToast } from "@src/utils/toastUtils";
import InputText from "@src/components/inputs/inputsGlobal/InputText";
import Buttons from "@src/components/buttons/Buttons";

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      showToast("Les mots de passe ne correspondent pas.", "error");
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    try {
      const res = await resetPassword({
        token,
        newPassword: password,
        confirmPassword,
      });

      login(res.accessToken, res.user, true);
      navigate("/profile");
      showToast("Ravi de vous revoir", "success");
    } catch (err: any) {
      showToast("Erreur lors de la mise à jour.", "error");
      setError(err.response?.data?.error || "Erreur lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password">
      <h2>Définir un nouveau mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <InputText
          type="password"
          id="new-password"
          label="Nouveau mot de passe"
          placeholder=""
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {/* <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /> */}
        <InputText
          type="password"
          id="confirm-password"
          label="Confirmer le mot de passe"
          placeholder=""
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {/* <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        /> */}
        <Buttons
          onClick={handleSubmit}
          title={loading ? "Chargement..." : "Mettre à jour"}
          disabled={loading}
        />
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ResetPassword;
