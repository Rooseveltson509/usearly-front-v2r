import { useMemo, useState } from "react";
import type { UserGroupedReport } from "@src/types/Reports";

export const useUserProfileFilters = (data: UserGroupedReport[]) => {
  const [selectedBrand, setSelectedBrand] = useState("Tous");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const availableBrands = useMemo(() => {
    const brands = Array.from(new Set(data.map((d) => d.marque))).sort();
    return ["Tous", ...brands];
  }, [data]);

  const availableCategories = useMemo(() => {
    const categories = Array.from(
      new Set(data.map((d) => d.subCategory)),
    ).sort();
    return ["Tous", ...categories];
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const brandMatch =
        selectedBrand === "Tous" || item.marque === selectedBrand;
      const categoryMatch =
        selectedCategory === "Tous" || item.subCategory === selectedCategory;
      return brandMatch && categoryMatch;
    });
  }, [data, selectedBrand, selectedCategory]);

  return {
    filteredData,
    availableBrands,
    availableCategories,
    selectedBrand,
    setSelectedBrand,
    selectedCategory,
    setSelectedCategory,
  };
};
