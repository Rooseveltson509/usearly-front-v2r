import { useForm } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { registerUser } from "@src/services/apiService";
import type { RegisterData } from "@src/types/RegisterData";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/Register.scss";
import { showToast } from "@src/utils/toastUtils";
import PasswordRules from "./Components/PasswordRules/PasswordRules";
import UsearlyDraw from "../../../components/background/Usearly";
import InputText from "../../../components/inputs/inputsGlobal/InputText";
import Buttons from "@src/components/buttons/Buttons";
import { useHandleAuthRedirect } from "@src/hooks/useHandleAuthRedirect";
import { errorMessages } from "@src/utils/errorMessages";

const passwordRules = {
  length: (val: string) => val.length >= 8,
  lowercase: (val: string) => /[a-z]/.test(val),
  uppercase: (val: string) => /[A-Z]/.test(val),
  number: (val: string) => /\d/.test(val),
  special: (val: string) => /[^A-Za-z0-9]/.test(val),
};

const formatDateToFR = (isoDate: string): string => {
  const [year, month, day] = isoDate.split("-");
  return `${day}-${month}-${year}`;
};

const ZWS = "\u200B";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<RegisterData>({ mode: "onChange" });

  const location = useLocation();
  const navigate = useNavigate();
  const { handleAuthRedirect } = useHandleAuthRedirect();
  const password = watch("password", "");
  const initialEmail = (location.state as any)?.email ?? "";

  const [mailUser, setMailUser] = useState(initialEmail);
  const [mailContentEditable, setMailContentEditable] = useState(false);
  const emailSpanRef = useRef<HTMLSpanElement | null>(null);

  const [, setValidations] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    const invalidSpecialChar = /[^A-Za-z0-9@$!%*?&]/.test(password);
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

    if (!el.textContent) {
      el.textContent = mailUser || ZWS;
    }

    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, [mailContentEditable, mailUser]);

  const handleSpanInput = (e: React.FormEvent<HTMLSpanElement>) => {
    const raw = e.currentTarget.textContent ?? "";
    const clean = raw.replace(new RegExp(ZWS, "g"), "");
    setMailUser(clean);
  };

  const handleSpanKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    const text = (emailSpanRef.current?.textContent ?? "").replace(
      new RegExp(ZWS, "g"),
      "",
    );
    if ((e.key === "Backspace" || e.key === "Delete") && text.length === 0) {
      e.preventDefault();
    }
  };

  const onSubmit = async (data: RegisterData) => {
    const formattedDate = formatDateToFR(data.born);

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

      // 🟢 Cas spécial : confirmation requise
      if (response.code === "CONFIRMATION_REQUIRED") {
        if (response.userId && response.email) {
          const url = `/confirm?userId=${response.userId}&email=${encodeURIComponent(
            response.email,
          )}`;
          showToast(
            `📧 ${response.email} existe déjà. Confirme ton compte pour continuer.`,
            "info",
          );
          navigate(url, { replace: true });
        }
        return;
      }

      // 🟢 Cas normal → success
      const ok = handleAuthRedirect(response, {
        onSuccess: () => {
          showToast(`✅ ${response.email} inscrit avec succès !`, "success");
          if (response.userId && response.email) {
            navigate(
              `/confirm?userId=${response.userId}&email=${encodeURIComponent(
                response.email,
              )}`,
            );
          }
        },
      });

      if (!ok) return;
    } catch (error: any) {
      // 🔴 autres erreurs (vraies erreurs)
      const code = error.code || "";
      const message =
        errorMessages[code] ||
        error.message ||
        "❌ Erreur lors de l'inscription.";
      showToast(message, "error");
    }
  };

  const editableProps = mailContentEditable
    ? ({ contentEditable: true, suppressContentEditableWarning: true } as const)
    : {};

  return (
    <div className="register-container">
      <h2 style={{ marginBottom: initialEmail ? 0 : "2.5rem" }}>
        Faisons de toi un Usear !
      </h2>

      {initialEmail && (
        <p className="register-subtitle">
          Votre mail est bien{" "}
          <span
            ref={emailSpanRef}
            {...editableProps}
            role="textbox"
            tabIndex={0}
            className={mailContentEditable ? "editable" : ""}
            onInput={handleSpanInput}
            onKeyDown={handleSpanKeyDown}
          >
            {!mailContentEditable ? mailUser : null}
          </span>{" "}
          ?{" "}
          <span
            className="modifyLink"
            onClick={() => setMailContentEditable(!mailContentEditable)}
          >
            Modifier
          </span>
        </p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          if (errors.password_confirm) {
            showToast(errors.password_confirm.message as string, "error");
          }
        })}
        noValidate
      >
        <InputText
          registration={register("pseudo", { required: true })}
          id="pseudo"
          type="text"
          label="Pseudo*"
          required
        />

        {!initialEmail && (
          <InputText
            registration={register("email", { required: true })}
            id="email"
            type="email"
            label="Email*"
            defaultValue={mailUser}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMailUser(e.target.value)
            }
            required
          />
        )}

        <div>
          <InputText
            registration={register("password", { required: true })}
            id="password"
            type="password"
            label="Mot de passe*"
            required
            /* onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)} */
          />
          {password && (
            <PasswordRules
              value={password}
              enabled={[
                "length",
                "lowercase",
                "uppercase",
                "number",
                "special",
              ]}
              className="input-rules"
            />
          )}
        </div>

        <InputText
          registration={register("password_confirm", {
            validate: (val) =>
              val === getValues("password") ||
              "Les mots de passe ne correspondent pas",
          })}
          id="password_confirm"
          type="password"
          label="Confirmation Mot de passe*"
          required
        />
        {errors.password_confirm && (
          <p className="error-message">
            {errors.password_confirm.message as string}
          </p>
        )}

        <div className="double-field">
          <InputText
            registration={register("born", { required: true })}
            id="born"
            type="date"
            label="Date de naissance*"
            required
          />

          <div className="select-wrap">
            <select
              id="gender"
              className="select"
              {...register("gender", { required: true })}
            >
              <option value="">Genre*</option>
              <option value="Femme">Femme</option>
              <option value="Homme">Homme</option>
              <option value="Autre">Autre</option>
            </select>
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

        <Buttons title="Créer un compte" type="submit" />
      </form>

      <UsearlyDraw />
    </div>
  );
};

export default Register;
