import "./InputText.scss";
import React, { forwardRef } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  id: string;
  label?: string;
  value?: string | number;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
  /** résultat de register('name', { ...rules }) */
  registration?: UseFormRegisterReturn;
  /** message d’erreur optionnel */
  error?: string;
  className?: string;
  containerClassName?: string;
};

/**
 * Input flottant compatible react-hook-form.
 * On passe le résultat de `register(...)` via `registration`.
 */
const InputText = forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      label = "",
      type = "text",
      value,
      placeholder,
      required,
      registration,
      error,
      className = "",
      containerClassName = "floating-group",
      ...rest
    },
    ref
  ) => {
    return (
      <div className={`${containerClassName}${error ? " has-error" : ""}`}>
        <input
            id={id}
            type={type}
            placeholder={placeholder}
            required={required}
            aria-invalid={!!error}
            className={className}
            value={value}
            // on fusionne les refs : RHF + éventuelle ref parent
            {...registration}
            ref={(el) => {
                registration?.ref?.(el);
                if (typeof ref === "function") ref(el);
                else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
            }}
            {...rest}
        />
        {label && <label htmlFor={id}>{label}</label>}
      </div>
    );
  }
);

InputText.displayName = "InputText";
export default InputText;
