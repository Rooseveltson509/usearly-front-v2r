import { useEffect, useState } from "react";
import { getAllBrands } from "@src/services/feedbackService";
import type { BrandWithSubCategories } from "@src/types/Reports";

export const useBrands = () => {
  const [brands, setBrands] = useState<BrandWithSubCategories[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await getAllBrands();
        setBrands(data);
      } catch (err) {
        console.error("❌ Erreur récupération marques :", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { brands, loading };
};
