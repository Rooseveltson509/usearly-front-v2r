import { useState } from "react";
import { loginUser, loginBrand } from "@src/services/apiService";
import { showToast } from "@src/utils/toastUtils";
import { useAuth } from "@src/services/AuthContext";
import "./Login.scss";
import { Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEmail = (value: string) => value.includes("@");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;

      if (loginInput.includes("@brand.") || loginInput.includes("@marque.")) {
        response = await loginBrand({
          email: loginInput,
          mdp: password,
          rememberMe,
        });
      } else {
        response = await loginUser({
          email: isEmail(loginInput) ? loginInput : undefined,
          pseudo: !isEmail(loginInput) ? loginInput : undefined,
          password,
          rememberMe,
        });
      }

      await login(response.accessToken, response.user, rememberMe);
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
      <p>
        Saisis ton adresse e-mail <strong>ou ton pseudo</strong> et ton mot de
        passe pour rejoindre Usearly.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="floating-group">
          <input
            type="text"
            id="loginInput"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            required
            placeholder=" "
            className={loginInput ? "filled" : ""}
          />
          <label htmlFor="loginInput">Email ou pseudo</label>
        </div>

        <div className="floating-group">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder=" "
            className={password ? "filled" : ""}
          />
          <label htmlFor="password">Mot de passe</label>
        </div>

        <div className="login-options">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Se souvenir de moi.
          </label>
          <Link to="/forgot-password" className="forgot-link">
            Mot de passe oublié ?
          </Link>
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
