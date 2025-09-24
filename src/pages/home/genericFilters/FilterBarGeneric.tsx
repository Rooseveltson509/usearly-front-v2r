import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import "./FilterBar.scss";

export interface FilterOption {
    value: string;
    label: string;
}

interface Props {
    filter: string;
    setFilter: (val: string) => void;

    viewMode: "flat" | "chrono" | "confirmed";
    setViewMode: (val: "flat" | "chrono" | "confirmed") => void;

    setSelectedBrand?: (val: string) => void;
    setSelectedCategory?: (val: string) => void;
    setActiveFilter?: (val: string) => void;

    onViewModeChange?: (mode: "flat" | "chrono" | "confirmed") => void;

    // Filtres dynamiques
    options: FilterOption[];

    // Recherche marque/catégorie (activable au besoin)
    withBrands?: boolean;
    withCategories?: boolean;

    availableBrands?: string[];
    availableCategories?: string[];

    dropdownRef?: React.RefObject<HTMLDivElement | null>;
    isDropdownOpen?: boolean;
    setIsDropdownOpen?: (val: boolean) => void;

    selectedBrand?: string;
    selectedCategory?: string;
    labelOverride?: string;
}

// ✅ fonction de normalisation (mêmes règles que dans HomeGroupedReportsList)
const normalize = (str: string) =>
    str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // accents
        .replace(/[’']/g, "'") // apostrophes
        .replace(/[\s.]+$/g, "") // espaces/points finaux
        .trim();

const FilterBarGeneric: React.FC<Props> = ({
    filter,
    setFilter,
    viewMode,
    setViewMode,
    setSelectedBrand = () => { },
    setSelectedCategory = () => { },
    setActiveFilter = () => { },
    onViewModeChange,
    options,
    withBrands = false,
    withCategories = false,
    availableBrands = [],
    availableCategories = [],
    dropdownRef,
    isDropdownOpen = false,
    setIsDropdownOpen = () => { },
    selectedBrand = "",
    selectedCategory = "",
}) => {
    const [search, setSearch] = useState("");

    // ✅ recherche marque normalisée
    const filteredBrands = search.trim()
        ? availableBrands.filter((b) => normalize(b).includes(normalize(search)))
        : availableBrands;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef?.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen, setIsDropdownOpen, dropdownRef]);

    return (
        <div className="filter-bar-generic-container">
            {/* 🔥 Premier select = filtres dynamiques */}
            <div className="select-filter-wrapper">
                <select
                    className="select-filter"
                    value={filter}
                    onChange={(e) => {
                        const value = e.target.value;

                        // reset marque/catégorie si on change de filtre
                        setSelectedBrand("");
                        setSelectedCategory("");

                        setFilter(value);
                        setActiveFilter(value);

                        // par défaut → mode chrono
                        setViewMode("chrono");
                        onViewModeChange?.("chrono");
                    }}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* 🔧 Deuxième filtre : input + catégories (optionnel) */}
            {(withBrands || withCategories) && (
                <div className="filter-dropdown-wrapper" ref={dropdownRef}>
                    <button
                        className="filter-toggle"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <SlidersHorizontal size={18} style={{ marginRight: "6px" }} />
                        Filtrer
                    </button>

                    {isDropdownOpen && (
                        <div className="filter-dropdown">
                            {/* 🔍 Recherche marque */}
                            {withBrands && (
                                <>
                                    <input
                                        type="text"
                                        value={search || selectedBrand}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Rechercher une marque..."
                                    />

                                    {search && (
                                        <ul className="autocomplete-list">
                                            {filteredBrands.length > 0 ? (
                                                filteredBrands.map((brand) => (
                                                    <li
                                                        key={brand}
                                                        onClick={() => {
                                                            setSelectedBrand(brand);
                                                            setSelectedCategory("");
                                                            setSearch("");
                                                            setIsDropdownOpen(false);

                                                            // 👉 Mode recherche (filtre vide)
                                                            setViewMode("flat");
                                                            setFilter("");
                                                            onViewModeChange?.("flat");
                                                            setActiveFilter("");
                                                        }}
                                                    >
                                                        {brand}
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="no-results">Aucune marque trouvée</li>
                                            )}
                                        </ul>
                                    )}
                                </>
                            )}

                            {/* 🎯 Select catégories dépendantes de la marque */}
                            {withCategories && (
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(e.target.value);

                                        // 👉 reste en mode recherche (filtre vide)
                                        setViewMode("flat");
                                        setFilter("");
                                        onViewModeChange?.("flat");
                                        setActiveFilter("");
                                    }}
                                    disabled={!selectedBrand}
                                >
                                    <option value="">Toutes les catégories</option>
                                    {availableCategories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {(selectedBrand || selectedCategory) && (
                                <button
                                    className="reset"
                                    onClick={() => {
                                        setSelectedBrand("");
                                        setSelectedCategory("");
                                        setSearch("");

                                        // 👉 retour au comportement par défaut
                                        setViewMode("chrono");
                                        setFilter(options[0]?.value || "");
                                        onViewModeChange?.("chrono");
                                        setActiveFilter(options[0]?.value || "");
                                    }}
                                >
                                    Réinitialiser
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FilterBarGeneric;
