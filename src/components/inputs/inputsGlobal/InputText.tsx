import "./InputText.scss";
import React, { forwardRef, useState, useEffect } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import iconEye from "@src/assets/images/eye-password-logo.svg";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label?: string;
  value?: string | number;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  registration?: UseFormRegisterReturn; // résultat de register
  error?: string;
  className?: string;
  containerClassName?: string;
};

const InputText = forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      label = "",
      type = "text",
      value,
      required,
      registration,
      error,
      className = "",
      containerClassName = "floating-group",
      defaultValue,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const isPasswordType = type === "password";
    const forceFloatingLabel = type === "date"; // native date placeholder masque le label si on ne le force pas
    const [isFilled, setIsFilled] = useState(
      forceFloatingLabel || !!value || !!defaultValue,
    );
    const [showPassword, setShowPassword] = useState(false);

    // synchroniser si `value` est contrôlé par un parent
    useEffect(() => {
      if (value === undefined || value === null) return;
      const hasValue = value !== "";
      setIsFilled(forceFloatingLabel || hasValue);
    }, [value, forceFloatingLabel]);

    useEffect(() => {
      if (!isPasswordType && showPassword) {
        setShowPassword(false);
      }
    }, [isPasswordType, showPassword]);

    const resolvedType =
      isPasswordType && showPassword ? "text" : (type ?? "text");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const hasContent = forceFloatingLabel || e.target.value !== "";
      setIsFilled(hasContent);
      registration?.onChange?.(e);
      onChange?.(e); // garde l’onChange du parent
    };

    return (
      <div className={`${containerClassName}${error ? " has-error" : ""}`}>
        <input
          id={id}
          type={resolvedType}
          required={required}
          aria-invalid={!!error}
          className={`${className} ${isFilled ? "filled" : ""}`}
          {...registration}
          onChange={handleChange}
          ref={(el) => {
            registration?.ref?.(el);
            if (typeof ref === "function") ref(el);
            else if (ref) (ref as any).current = el;
          }}
          defaultValue={defaultValue}
          {...rest}
        />

        {isPasswordType && (
          <button
            type="button"
            className="eye-btn"
            aria-label={
              showPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
            aria-pressed={showPassword}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            <img
              src={iconEye}
              alt={
                showPassword
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
              className="eye-icon"
            />
          </button>
        )}

        {label && <label htmlFor={id}>{label}</label>}
      </div>
    );
  },
);

InputText.displayName = "InputText";

export default InputText;
