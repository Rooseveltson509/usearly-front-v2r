import { useForm } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { registerUser } from "@src/services/apiService";
import type { RegisterData } from "@src/types/RegisterData";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/Register.scss";
import { showToast } from "@src/utils/toastUtils";
import PasswordRules from "./Components/PasswordRules/PasswordRules";
import UsearlyDraw from "../Usearly";
import InputText from "../../../components/inputs/InputText";
import Buttons from "@src/components/buttons/Buttons";

const passwordRules = {
  length: (val: string) => val.length >= 8,
  lowercase: (val: string) => /[a-z]/.test(val),
  uppercase: (val: string) => /[A-Z]/.test(val),
  number: (val: string) => /\d/.test(val),
  special: (val: string) => /[^A-Za-z0-9]/.test(val),
};

const formatDateToFR = (isoDate: string): string => {
  const [year, month, day] = isoDate.split("-");
  return `${day}-${month}-${year}`; // format attendu : dd-mm-yyyy
};

// caractère invisible pour garder le curseur dans le span vide
const ZWS = "\u200B";

const Register = () => {
  const { register, handleSubmit, watch } = useForm<RegisterData>({ mode: "onChange" });
  const location = useLocation();
  const password = watch("password", "");
  const initialEmail = (location.state as any)?.email ?? "";
  const [mailUser, setMailUser] = useState(initialEmail);
  const [mailContentEditable, setMailContentEditable] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const allowedSpecialChars = "@$!%*?&";
  const emailSpanRef = useRef<HTMLSpanElement | null>(null);

  const [validations, setValidations] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    const invalidSpecialChar = /[^A-Za-z0-9@$!%*?&]/.test(password); // ❌ char non autorisé
    setValidations({
      length: passwordRules.length(password),
      lowercase: passwordRules.lowercase(password),
      uppercase: passwordRules.uppercase(password),
      number: passwordRules.number(password),
      special: passwordRules.special(password) && !invalidSpecialChar,
    });
  }, [password]);

  useEffect(() => {
    if (!mailContentEditable) return;
    const el = emailSpanRef.current;
    if (!el) return;

    if (!el.textContent || el.textContent === "") {
      el.textContent = (mailUser && mailUser.length > 0) ? mailUser : ZWS;
    }

    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, [mailContentEditable, mailUser]);

  const editableProps = mailContentEditable
    ? ({ contentEditable: true, suppressContentEditableWarning: true } as const)
    : {};

  const handleSpanInput = (e: React.FormEvent<HTMLSpanElement>) => {
    const raw = e.currentTarget.textContent ?? "";
    const clean = raw.replace(new RegExp(ZWS, "g"), "");
    console.log("handleSpanInput: raw=", raw, " clean=", clean);
    setMailUser(clean);
  };

  const handleSpanKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    const text = (emailSpanRef.current?.textContent ?? "").replace(new RegExp(ZWS, "g"), "");
    if ((e.key === "Backspace" || e.key === "Delete") && text.length === 0) {
      e.preventDefault();
    }
  };

  const onSubmit = async (data: RegisterData) => {
    const formattedDate = formatDateToFR(data.born);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const payload = {
        pseudo: data.pseudo,
        email: mailUser,
        password: data.password,
        password_confirm: data.password_confirm,
        born: formattedDate,
        gender: data.gender,
      };

      const response = await registerUser(payload);
      showToast("✅ Connexion réussie !", "success");
      navigate(`/confirm?userId=${response.userId}&email=${encodeURIComponent(response.email)}`);
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  return (
    <div className="register-container">
      <h2>Faisons de toi un Usear !</h2>

      <p className="register-subtitle">
        Votre mail est bien {" "}
        <span
          ref={emailSpanRef}
          {...editableProps}
          role="textbox"
          tabIndex={0}
          className={mailContentEditable ? "editable" : ""}
          onInput={handleSpanInput}
          onKeyDown={handleSpanKeyDown}
        >
          {/* quand non éditable, contenu contrôlé par React ; en mode éditable, le DOM gère (avec ZWS) */}
          {!mailContentEditable ? mailUser : null}
        </span>{" ? "}
        <span
          className="modifyLink"
          onClick={() => setMailContentEditable(!mailContentEditable)}
        >
          Modifier
        </span>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ display: "none" }}>
          <InputText
            registration={register("email", { required: true })}
            id="email"
            type="email"
            placeholder="Email*"
            value={mailUser}
            required
          />
        </div>

        <div>
          <InputText
            registration={register("pseudo", { required: true })}
            id="pseudo"
            type="text"
            placeholder="Pseudo"
            required
          />
        </div>

        <div>
          <InputText
            registration={register("password", { required: true })}
            id="password"
            type="password"
            placeholder="Mot de passe*"
            required
          />
          {password && (
            <PasswordRules
              value={password}
              enabled={["length", "lowercase", "uppercase", "number", "special"]}
              className="input-rules"
            />
          )}
        </div>

        <div>
          <InputText
            registration={register("password_confirm", {
              validate: (val) => val === password || "Les mots de passe ne correspondent pas",
            })}
            id="password_confirm"
            type="password"
            placeholder="Confirmation Mot de passe*"
            required
          />
        </div>

        <div className="double-field">
          <div>
            <InputText
              registration={register("born", { required: true })}
              id="born"
              type="date"
              placeholder="Date de naissance*"
              required
            />
          </div>
          <div className="select-wrap">
            <select id="gender" className="select" {...register("gender", { required: true })}>
              <option value="">Genre*</option>
              <option value="Femme">Femme</option>
              <option value="Homme">Homme</option>
              <option value="Autre">Autre</option>
            </select>
            <label htmlFor="gender"></label>
          </div>
        </div>

        <div className="terms-conditions">
          <label className="terms-checkbox">
            <input type="checkbox" required />
            <p>
              J'accepte les{" "}
              <a href="#" target="_blank" rel="noopener noreferrer">
                conditions d'utilisation
              </a>{" "}
              et je confirme avoir lu la{" "}
              <a href="#" target="_blank" rel="noopener noreferrer">
                politique de confidentialité
              </a>{" "}
              de Usearly.
            </p>
          </label>
        </div>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <Buttons title="Créer un compte" type="submit" />
      </form>

      <UsearlyDraw />
    </div>
  );
};

export default Register;
