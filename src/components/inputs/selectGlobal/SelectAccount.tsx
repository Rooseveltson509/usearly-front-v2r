import "./SelectAccount.scss";
import type { UseFormRegisterReturn } from "react-hook-form";

function SelectAccount({id, title, options, registration, disabled, onChange }: { id: string; title: string; options: string[]; disabled: boolean; registration?: UseFormRegisterReturn; onChange: (value: string) => void }) {
    return (
        <div className="select-text-account">
            <label htmlFor={id}>{title}</label>
            <div>
                <select id={id} className="select" {...registration} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
                <option value="">{title}</option>
                {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
                </select>
            </div>
        </div>
    );
}

export default SelectAccount;