import "./InputText.scss";
import React, { forwardRef, useState, useEffect } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

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
    const [isFilled, setIsFilled] = useState(!!value || !!defaultValue);

    // synchroniser si `value` est contrôlé par un parent
    useEffect(() => {
      setIsFilled(!!value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsFilled(e.target.value !== "");
      onChange?.(e); // garde l’onChange du parent
    };

    return (
      <div className={`${containerClassName}${error ? " has-error" : ""}`}>
        <input
          id={id}
          type={type}
          required={required}
          aria-invalid={!!error}
          className={`${className} ${isFilled ? "filled" : ""}`}
          value={value}
          defaultValue={defaultValue}
          {...registration}
          onChange={handleChange}
          ref={(el) => {
            registration?.ref?.(el);
            if (typeof ref === "function") ref(el);
            else if (ref)
              (ref as React.MutableRefObject<HTMLInputElement | null>).current =
                el;
          }}
          {...rest}
        />
        {label && <label htmlFor={id}>{label}</label>}
      </div>
    );
  },
);

InputText.displayName = "InputText";

export default InputText;
