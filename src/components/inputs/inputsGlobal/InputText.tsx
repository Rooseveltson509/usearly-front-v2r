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
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
      onChange,
      disabled = false,
      ...rest
    },
    ref
  ) => {
    return (
      <div className={`${containerClassName}${error ? " has-error" : ""}`}>
        {label && <label htmlFor={id}>{label}</label>}
        <input
            style={{ marginTop: label ? "0.5rem" : ""}}
            id={id}
            type={type}
            placeholder={placeholder}
            required={required}
            aria-invalid={!!error}
            className={className}
            value={value}
            onChange={onChange}
            disabled={disabled}
            // on fusionne les refs : RHF + éventuelle ref parent
            {...registration}
            ref={(el) => {
                registration?.ref?.(el);
                if (typeof ref === "function") ref(el);
                else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
            }}
            {...rest}
        />
      </div>
    );
  }
);

InputText.displayName = "InputText";
export default InputText;
