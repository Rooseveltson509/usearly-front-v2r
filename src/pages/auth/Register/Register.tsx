import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { registerUser } from "@src/services/apiService";
import type { RegisterData } from "@src/types/RegisterData";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/Register.scss";
import { showToast } from "@src/utils/toastUtils";
import PasswordRules from "./Components/PasswordRules/PasswordRules";
import UsearlyDraw from "../Usearly";
import InputText from "../../../components/inputs/InputText";

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
  const location = useLocation();
  const password = watch("password", "");
  const initialEmail = (location.state as any)?.email ?? "";
  const [mailUser, setMailUser] = useState(initialEmail);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const allowedSpecialChars = "@$!%*?&";

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
      <p className="register-subtitle">Nous avons envoyé un code à {mailUser} <span className="modifyLink" onClick={() => navigate("/lookup")}>Modifier</span></p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <InputText registration={register("pseudo", { required: true })} id="pseudo" type="text" placeholder="Pseudo" required />
        </div>

        {/* <div>
          <InputText registerName={"email"} id="email" type="email" placeholder="Email" required />
        </div> */}
        <div>
          <InputText registration={register("password", { required: true })} id="password" type="password" placeholder="Mot de passe*" required />
          { password && (
            <PasswordRules
              value={password}
              enabled={["length", "lowercase", "uppercase", "number", "special"]}
              className="input-rules"
            />
          )}
        </div>

        <div>
          <InputText registration={register("password_confirm", { validate: (val) => val === password || "Les mots de passe ne correspondent pas",
            })} id="password_confirm" type="password" placeholder="Confirmation Mot de passe*" required />
        </div>

        <div className="double-field">
          <div>
            <InputText registration={register("born", { required: true })} id="born" type="date" placeholder="Date de naissance*" required />
          </div>
          <div>
            { /* A styliser */}
            <select id="gender" {...register("gender", { required: true })}>
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
            <p>J'accepte les <a href="#" target="_blank" rel="noopener noreferrer">conditions d'utilisation</a> et je confirme avoir lu la <a href="#" target="_blank" rel="noopener noreferrer">politique de confidentialité</a> de Usearly.</p>
          </label>
        </div>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit">Créer un compte</button>
      </form>
      <UsearlyDraw />
    </div>
  );
};

export default Register;
