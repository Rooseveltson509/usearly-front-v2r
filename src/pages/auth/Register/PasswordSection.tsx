import InputText from "@src/components/inputs/inputsGlobal/InputText";
import PasswordRules from "./Components/PasswordRules/PasswordRules";

export default function PasswordSection({
  register,
  password,
  errors,
  getValues,
}: any) {
  return (
    <>
      <InputText
        registration={register("password", { required: true })}
        id="password"
        type="password"
        label="Mot de passe*"
        required
      />

      {password && (
        <PasswordRules
          value={password}
          enabled={["length", "lowercase", "uppercase", "number", "special"]}
          className="input-rules"
        />
      )}

      <InputText
        registration={register("password_confirm", {
          validate: (val: string) =>
            val === getValues("password") ||
            "Les mots de passe ne correspondent pas",
        })}
        id="password_confirm"
        type="password"
        label="Confirmation Mot de passe*"
        required
      />

      {errors.password_confirm && (
        <p className="error-message">{errors.password_confirm.message}</p>
      )}
    </>
  );
}
