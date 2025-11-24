import "./SelectOption.scss";

type OptionProps<V extends string> = {
  value: V;
  label: string;
  leading?: React.ReactNode;
  selected?: boolean;
  isPlaceholder?: boolean;
  onSelect: (v: V) => void;
};

export function SelectOption<V extends string>({
  value,
  label,
  leading,
  selected,
  isPlaceholder,
  onSelect,
}: OptionProps<V>) {
  const cls = [
    "select-filter-option",
    selected && "is-selected",
    isPlaceholder && "select-filter-option--placeholder",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <span
      className={cls}
      role="option"
      aria-selected={!!selected}
      onClick={() => onSelect(value)}
    >
      {leading && (
        <span className="select-filter-option-leading">{leading}</span>
      )}
      <span className="select-filter-option-label">{label}</span>
    </span>
  );
}

export default SelectOption;
