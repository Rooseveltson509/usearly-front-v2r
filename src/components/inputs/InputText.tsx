import React from "react";
import { useForm } from "react-hook-form";
import type { RegisterData } from "@src/types/RegisterData";
import "./InputText.scss";

// Forward the ref so parent components can read the input value without querying the DOM
const InputText = React.forwardRef<HTMLInputElement, { registerName: any; id: string; type: string; placeholder: string; label?: string; required?: boolean }>(
    ({ registerName, id, type, placeholder, label = "", required = false }, ref) => {
        const { register } = useForm<RegisterData>({ mode: "onChange" });
        return (
            <>
                <input
                    {...register(registerName, { required: required })}
                    ref={ref}
                    type={type}
                    id={id}
                    placeholder={placeholder}
                />
                <label htmlFor={id}>{label}</label>
            </>
        );
    }
);

InputText.displayName = "InputText";

export default InputText;