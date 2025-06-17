import { useState } from "react";
import { loginUser, loginBrand } from "@src/services/apiService";
import { showToast } from "@src/utils/toastUtils";
import { useAuth } from "@src/services/AuthContext";
import "./Login.scss";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;

      if (email.includes("@brand.") || email.includes("@marque.")) {
        response = await loginBrand({ email, mdp: password, rememberMe });
      } else {
        response = await loginUser({ email, password, rememberMe });
      }

      // Appel au AuthContext pour stocker les infos
      login(response.accessToken, response.user, rememberMe);
      showToast("✅ Connexion réussie !");
    } catch (error: any) {
      showToast(error.message || "Erreur de connexion", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Ravi de te revoir Usear !</h2>
      <p>Saisis ton adresse e-mail et ton mot de passe pour rejoindre Usearly.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="login-options">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Se souvenir de moi.
          </label>
          <span className="forgot-link">Mot de passe oublié ?</span>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <div className="login-footer-logo">Usearly</div>
    </div>
  );
};

export default Login;
