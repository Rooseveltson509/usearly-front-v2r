import "./SelectAccount.scss";
//import type { UseFormRegisterReturn } from "react-hook-form";

function SelectAccount({
  id,
  title,
  options,
  disabled,
  value,
  onChange,
}: {
  id: string;
  title: string;
  value: string;
  options: { value: string; label: string }[];
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="select-text-account">
      <label htmlFor={id}>{title}</label>
      <div>
        <select
          id={id}
          className="select"
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {!value && <option value="">Sélectionner un genre</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SelectAccount;
