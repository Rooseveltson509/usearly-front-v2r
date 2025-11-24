type OptionProps<V extends string> = {
  value: V;
  label: string;
  leading?: React.ReactNode;
  selected?: boolean;
  onSelect: (v: V) => void;
  isPlaceholder?: boolean;
};
export function Option<V extends string>({
  value,
  label,
  leading,
  selected,
  onSelect,
  isPlaceholder,
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
