import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { registerUser } from "@src/services/apiService";
import type { RegisterData } from "@src/types/RegisterData";
import { useNavigate } from "react-router-dom";
import "./register.scss";
import { showToast } from "@src/utils/toastUtils";

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

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
  } = useForm<RegisterData>({ mode: "onChange" });
  const password = watch("password", "");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();



  const [validations, setValidations] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    setValidations({
      length: passwordRules.length(password),
      lowercase: passwordRules.lowercase(password),
      uppercase: passwordRules.uppercase(password),
      number: passwordRules.number(password),
      special: passwordRules.special(password),
    });
  }, [password]);

  const onSubmit = async (data: RegisterData) => {
    const formattedDate = formatDateToFR(data.born);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const payload = {
        pseudo: data.pseudo,
        email: data.email,
        password: data.password,
        password_confirm: data.password_confirm,
        born: formattedDate,
        gender: data.gender,
      };

      const response = await registerUser(payload);
      //setToastMessage(`✅ ${response.email} inscrit avec succès !`);
      showToast("✅ Connexion réussie !", "success");
      // setToastType("success");
      navigate(`/confirm?userId=${response.userId}&email=${encodeURIComponent(response.email)}`);


    } catch (error: any) {
      //setToastMessage(error.message);
      showToast(error.message, "error");
      //setToastType("error");

    }
  };

  return (
    <div className="register-container">
      <h2>Faisons de toi un Usear !</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>Pseudo (visible par tous)</label>
        <input {...register("pseudo", { required: true })} />

        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
        />

        <input
          type="password"
          placeholder="Mot de passe*"
          {...register("password", { required: true })}
        />

        <ul className="password-rules">
          <li className={validations.length ? "valid" : "invalid"}>
            Au moins 8 caractères.
          </li>
          <li className={validations.uppercase ? "valid" : "invalid"}>
            Au moins une lettre majuscule.
          </li>
          <li className={validations.lowercase ? "valid" : "invalid"}>
            Au moins une lettre minuscule.
          </li>
          <li className={validations.number ? "valid" : "invalid"}>
            Au moins un chiffre.
          </li>
          <li className={validations.special ? "valid" : "invalid"}>
            Au moins un caractère spécial.
          </li>
        </ul>

        <input
          type="password"
          placeholder="Confirmation Mot de passe*"
          {...register("password_confirm", {
            validate: (val) => val === password || "Les mots de passe ne correspondent pas",
          })}
        />

        <div className="double-field">
          <input
            type="date"
            placeholder="Date de naissance*"
            {...register("born", { required: true })}
          />
          <select {...register("gender", { required: true })}>
            <option value="">Genre</option>
            <option value="Femme">Femme</option>
            <option value="Homme">Homme</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <label className="terms-checkbox">
          <input type="checkbox" required />
          J’accepte les conditions d'utilisation et la politique de confidentialité.
        </label>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit">Créer un compte</button>
      </form>
    </div>
  );
};

export default Register;
