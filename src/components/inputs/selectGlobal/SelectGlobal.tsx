import "./SelectGlobal.scss";
import type { UseFormRegisterReturn } from "react-hook-form";

function SelectGlobal({
  id,
  title,
  options,
  registration,
  onChange,
}: {
  id: string;
  title: string;
  options: string[];
  registration?: UseFormRegisterReturn;
  onChange: (value: string) => void;
}) {
  return (
    <div className="select-wrap">
      <select
        id={id}
        className="select"
        {...registration}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{title}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <label htmlFor={id}></label>
    </div>
  );
}

export default SelectGlobal;
