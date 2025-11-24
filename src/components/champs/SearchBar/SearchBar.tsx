import { Search, X } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
  placeholder?: string;
  inputRef?: React.Ref<HTMLInputElement>;
};

export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = "Rechercher…",
  inputRef,
}: SearchBarProps) {
  return (
    <div className="select-filter-search">
      <Search size={16} className="select-filter-search-icon" aria-hidden />
      <input
        ref={inputRef}
        className="select-filter-search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          type="button"
          className="select-filter-search-clear"
          onClick={onClear}
          aria-label="Effacer"
        >
          <X size={14} aria-hidden />
        </button>
      )}
    </div>
  );
}
