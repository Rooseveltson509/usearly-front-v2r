import * as React from "react";
import type { SelectFilterOption } from "@src/components/champs/Champs";

type Props<V extends string = string> = {
  options: SelectFilterOption<V>[];
  value: V;
  onChange: (val: V) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
  getOptionLabel?: (opt: SelectFilterOption<V>) => string;
};

export default function NativeHiddenSelect<V extends string = string>({
  options,
  value,
  onChange,
  disabled = false,
  name,
  className = "",
  getOptionLabel = (opt) => (opt.emoji ? `${opt.emoji} ` : "") + opt.label,
}: Props<V>) {
  return (
    <select
      name={name}
      className={["select-filter", className].filter(Boolean).join(" ")}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as V)}
      aria-hidden
      tabIndex={-1}
      // on reste fidèle à ton implémentation: totalement masqué
      style={{ display: "none" }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {getOptionLabel(opt)}
        </option>
      ))}
    </select>
  );
}
