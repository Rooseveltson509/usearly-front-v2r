import "./SearchBar.scss";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({
  value,
  onChange,
  placeholder = "Rechercher...",
}: SearchBarProps) => {
  const [isActive, setIsActive] = useState(() => Boolean(value));
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previousValueRef = useRef(value);

  useEffect(() => {
    if (value !== previousValueRef.current) {
      previousValueRef.current = value;
      if (value) {
        setIsActive(true);
      }
    }
  }, [value]);

  const toggleActive = () => {
    setIsActive(!isActive);
    onChange("");
  };

  return (
    <div className={`search-bar ${isActive ? "active" : ""}`}>
      <span
        className={`icon ${isActive ? "active" : ""}`}
        onClick={toggleActive}
      >
        <Search size={16} />
      </span>
      <input
        ref={inputRef}
        className={`input ${isActive ? "active" : ""}`}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        onFocus={() => setIsActive(true)}
        onBlur={() => {
          if (!value) {
            setIsActive(false);
          }
        }}
      />
    </div>
  );
};

export default SearchBar;
