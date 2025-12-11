import { useForm } from "react-hook-form";
import { useState } from "react";
import { registerUser } from "@src/services/apiService";
import type { RegisterData } from "@src/types/RegisterData";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/Register.scss";
import { showToast } from "@src/utils/toastUtils";
import InputText from "../../../components/inputs/inputsGlobal/InputText";
import Buttons from "@src/components/buttons/Buttons";
import { useHandleAuthRedirect } from "@src/hooks/useHandleAuthRedirect";
import { errorMessages } from "@src/utils/errorMessages";
import { toDMY } from "@src/utils/dateUtils";
import EditableEmail from "./EditableEmail";
import PasswordSection from "./PasswordSection";

const Register = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    watch,
  } = useForm<RegisterData>({ mode: "onChange" });

  const location = useLocation();
  const navigate = useNavigate();
  const { handleAuthRedirect } = useHandleAuthRedirect();

  const initialEmail = (location.state as any)?.email ?? "";
  const [email, setEmail] = useState(initialEmail);

  const password = watch("password", "");

  /* -------------------------------------------------------- */
  /*  SUBMIT                                                 */
  /* -------------------------------------------------------- */
  const onSubmit = async (data: RegisterData) => {
    const bornDate = new Date(data.born);
    if (isNaN(bornDate.getTime())) {
      showToast("Date invalide", "error");
      return;
    }

    const payload = {
      pseudo: data.pseudo,
      email,
      password: data.password,
      password_confirm: data.password_confirm,
      born: toDMY(bornDate),
      gender: data.gender,
    };

    try {
      const response = await registerUser(payload);

      /* ----------------- Compte non confirmé ---------------- */
      if (response.code === "CONFIRMATION_REQUIRED") {
        if (response.email) {
          localStorage.setItem("pendingEmail", response.email);
        }

        showToast(
          `📧 ${response.email} existe déjà. Confirme ton compte.`,
          "info",
        );

        navigate("/confirm", {
          replace: true,
          state: { email: response.email },
        });

        return;
      }

      /* ----------------- Succès normal ---------------- */
      const ok = handleAuthRedirect(response, {
        onSuccess: () => {
          showToast(`🎉 ${response.email} inscrit avec succès !`, "success");

          if (response.email) {
            localStorage.setItem("pendingEmail", response.email);
            navigate("/confirm", {
              state: { email: response.email },
            });
          }
        },
      });

      if (!ok) return;
    } catch (error: any) {
      const code = error.response?.data?.code;
      const message =
        errorMessages[code] || error.message || "Erreur inconnue.";
      showToast(message, "error");
    }
  };

  /* -------------------------------------------------------- */
  /*  RENDER                                                 */
  /* -------------------------------------------------------- */
  return (
    <div className="register-container">
      <h2 style={{ marginBottom: initialEmail ? 0 : "2.5rem" }}>
        Faisons de toi un Usear !
      </h2>

      {/* Email déjà fourni → email éditable */}
      {initialEmail && <EditableEmail email={email} setEmail={setEmail} />}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputText
          registration={register("pseudo", {
            required: "Le pseudo est obligatoire",
            pattern: {
              value: /^[a-zA-Z0-9]{3,50}$/,
              message: "Pseudo invalide (3–50 caractères, lettres/chiffres).",
            },
          })}
          id="pseudo"
          type="text"
          label="Pseudo*"
          required
        />
        {errors.pseudo && (
          <p className="error-message">{errors.pseudo.message}</p>
        )}

        {/* Email classique si pas envoyé via CheckUser */}
        {!initialEmail && (
          <InputText
            registration={register("email", { required: true })}
            id="email"
            type="email"
            label="Email*"
            defaultValue={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />
        )}

        {/* Password + règles */}
        <PasswordSection
          register={register}
          password={password}
          errors={errors}
          getValues={getValues}
        />

        {/* Date + Genre */}
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
              <option value="madame">Femme</option>
              <option value="monsieur">Homme</option>
              <option value="N/A">Non spécifié</option>
            </select>
          </div>
        </div>

        <div className="terms-conditions">
          <label className="terms-checkbox">
            <input type="checkbox" required />
            <p>
              J'accepte les <a href="#">conditions d'utilisation</a> et j’ai lu
              la <a href="#">politique de confidentialité</a>.
            </p>
          </label>
        </div>

        <Buttons title="Créer un compte" type="submit" />
      </form>
    </div>
  );
};

export default Register;
