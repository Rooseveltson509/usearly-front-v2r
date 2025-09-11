import { useState } from "react";
import { useLocation } from "react-router-dom";
import { loginUser, loginBrand } from "@src/services/apiService";
import { showToast } from "@src/utils/toastUtils";
import { useAuth } from "@src/services/AuthContext";
import "./styles/Login.scss";
import { Link } from "react-router-dom";
import iconEye from "../../../assets/images/eye-password-logo.svg";
import UsearlyDraw from "../Usearly";

const Login = () => {
  const { login } = useAuth();
  const location = useLocation();
  // if navigated here with state.email, use it to prefill the login input
  const initialEmail = (location.state as any)?.email ?? "";
  const [loginInput, setLoginInput] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

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
      setError(error.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  function continueButton(){
    if(step === 1 && loginInput && isEmail(loginInput)){
      setStep(2);
      setError("");
    } else if(step === 1 && (!loginInput || !isEmail(loginInput))){
      setError("Veuillez entrer une adresse E-mail valide.");
    } else if (step === 2){
      setStep(1);
      setError("");
    }
  }

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
            {loginInput}<span onClick={() => continueButton()}>Modifier</span>
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
                {error && <p className="error-message">{error}</p>}
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
                {error && <p className="error-message">{error}</p>}
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
            <button type="button" onClick={() => continueButton()}>
              Continuer
            </button>
          ) : (
            <button type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          )
        }
      </form>
      <UsearlyDraw />
      <div className="login-footer-logo">Usearly</div>
    </div>
  );
};

export default Login;
