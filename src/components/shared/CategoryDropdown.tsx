import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { categoryIcons } from "@src/utils/categoriesIcon";
import "./CategoryDropdown.scss";

interface Props {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
  placeholder?: string;
}

const CategoryDropdown: React.FC<Props> = ({
  categories,
  selected,
  onSelect,
  placeholder = "Catégorie principale",
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="category-dropdown" ref={dropdownRef}>
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        {selected ? (
          <>
            <img
              src={categoryIcons[selected] || categoryIcons["Autre souci"]}
              alt={selected}
              className="icon"
            />
            <span>{selected}</span>
          </>
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
        <ChevronDown size={16} className="chevron" />
      </button>

      {open && (
        <ul className="dropdown-menu">
          {categories.map((cat) => (
            <li
              key={cat}
              className={`dropdown-item ${cat === selected ? "active" : ""}`}
              onClick={() => {
                onSelect(cat);
                setOpen(false);
              }}
            >
              <img
                src={categoryIcons[cat] || categoryIcons["Autre souci"]}
                alt={cat}
                className="icon"
              />
              <span>{cat}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryDropdown;
