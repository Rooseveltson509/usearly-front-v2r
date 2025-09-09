import { useState } from "react";
import { loginUser, loginBrand } from "@src/services/apiService";
import { showToast } from "@src/utils/toastUtils";
import { useAuth } from "@src/services/AuthContext";
import "./styles/Login.scss";
import { Link } from "react-router-dom";
import iconEye from "../../../../public/assets/icons/eye-password-logo.svg";

const Login = () => {
  const { login } = useAuth();
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      {step === 1 ? (
        <>
          <h2>Ravi de te revoir !</h2>
          <p className="login-subtitle">
            Entre ton adresse e-mail et ton mot de passe pour te connecter
          </p>
        </>
      ) : (
        <>
          <h2>Quel est ton mot de passe ?</h2>
          <p className="login-subtitle login-mdp-subtitle">
            {loginInput}<span onClick={() => setStep(1)}>Modifier</span>
          </p>
        </>
      )}
      

      <form onSubmit={handleSubmit}>
          { step === 1 ? (
            <>
              <div className="floating-group">
                <input
                  type="text"
                  id="loginInput"
                  required
                  placeholder="E-mail*"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  className={loginInput ? "filled" : ""}
                />
                <label htmlFor="loginInput"></label>
              </div>
              <div className="info-text">
                <p>En continuant, tu acceptes les <a href="#">conditions d'utilisation</a> et tu confirmes avoir lu la <a href="#">politique de confidentialité</a> de Usearly.</p>
              </div>
            </>
          ) : (
            <>
              <div className="floating-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Mot de passe*"
                  className={`password-input ${password ? "filled" : ""}`}
                />
                <button
                  type="button"
                  className="eye-btn"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  <img src={iconEye} alt="" className="eye-icon" />
                </button>
                <label htmlFor="password"></label>
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
            </>
          )}

        { step === 1 ? (
            <button type="button" onClick={() => setStep(2)}>
              Continuer
            </button>
          ) : (
            <button type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          )
        }
      </form>

      <div className="login-footer-logo">Usearly</div>
    </div>
  );
};

export default Login;
