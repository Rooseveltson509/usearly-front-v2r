import { useState, useEffect, useRef } from "react";
import FilterBarGeneric from "./genericFilters/FilterBarGeneric";
import { getAllBrands} from "@src/services/coupDeCoeurService";
import "./HomeFiltersCdc.scss";

interface Props {
  filter: string;
  setFilter: (val: string) => void;
  selectedBrand: string;
  setSelectedBrand: (val: string) => void;
}

const HomeFiltersCdc = ({
  filter,
  setFilter,
  selectedBrand,
  setSelectedBrand,
}: Props) => {
  const [viewMode, setViewMode] = useState<"flat" | "chrono" | "confirmed">("flat");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brands = await getAllBrands();
        setAvailableBrands(brands);
      } catch (e) {
        console.error("Erreur chargement marques:", e);
      }
    };
    fetchBrands();
  }, []);


  return (
    <div className="controls">
    <FilterBarGeneric
      options={[
        { value: "all", label: "👍 Coups de cœur populaires" }, // ✅ Ajout du filtre "all"
        { value: "enflammes", label: "❤️‍🔥 Coups de cœur les plus enflammés" }, // getEnflammesCoupsDeCoeur
        { value: "recent", label: "💌 Coups de cœur les plus récents" },
        /* { value: "commented", label: "💬 Les plus commentés" }, */
      ]}
      filter={filter}
      setFilter={setFilter}
      viewMode={viewMode}
      setViewMode={setViewMode}
      dropdownRef={dropdownRef}
      isDropdownOpen={isDropdownOpen}
      setIsDropdownOpen={setIsDropdownOpen}
      withBrands={true}
      withCategories={false}
      availableBrands={availableBrands}
      selectedBrand={selectedBrand}
      setSelectedBrand={setSelectedBrand}
      locationInfo={"cdc"}
    />
    </div>
  );
};

export default HomeFiltersCdc;