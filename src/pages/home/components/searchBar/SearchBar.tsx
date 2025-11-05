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
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (value && !isActive) {
      setIsActive(true);
    }
  }, [value, isActive]);

  const toggleActive = () => {
    if (isActive) {
      setIsActive(false);
      onChange("");
      return;
    }

    setIsActive(true);
    setTimeout(() => inputRef.current?.focus(), 0);
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
