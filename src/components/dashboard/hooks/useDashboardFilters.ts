import { useCallback, useState } from "react";

type FilterValue = string | number | boolean | null | undefined;

type FiltersState = Record<string, FilterValue | FilterValue[]>;

type SerializeMode = "all" | "active";

const isArrayEqual = (a: FilterValue[], b: FilterValue[]) => {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
};

const isValueEqual = (
  a: FilterValue | FilterValue[],
  b: FilterValue | FilterValue[],
) => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return isArrayEqual(a, b);
  }
  return a === b;
};

const useDashboardFilters = <T extends FiltersState>(initialState: T) => {
  const [filters, setFilters] = useState<T>(initialState);

  const setFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters((prev) => {
      if (isValueEqual(prev[key] as FilterValue, value as FilterValue)) {
        return prev;
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const resetFilters = useCallback(
    (keys?: (keyof T)[]) => {
      if (!Array.isArray(keys) || keys.length === 0) {
        setFilters(initialState);
        return;
      }
      setFilters((prev) => {
        const next = { ...prev };
        keys.forEach((key) => {
          next[key] = initialState[key];
        });
        return next;
      });
    },
    [initialState],
  );

  const toggleInArray = useCallback(
    <K extends keyof T>(
      key: K,
      value: T[K] extends Array<infer U> ? U : never,
    ) => {
      setFilters((prev) => {
        const current = prev[key];
        if (!Array.isArray(current)) return prev;
        const exists = current.includes(value as FilterValue);
        const next = exists
          ? current.filter((item) => item !== value)
          : [...current, value];
        return { ...prev, [key]: next };
      });
    },
    [],
  );

  const serialize = useCallback(
    (mode: SerializeMode = "active") => {
      if (mode === "all") return { ...filters } as Partial<T>;
      const entries = Object.entries(filters).filter(([key, value]) => {
        const defaultValue = initialState[key as keyof T];
        return !isValueEqual(value as FilterValue, defaultValue as FilterValue);
      });
      return Object.fromEntries(entries) as Partial<T>;
    },
    [filters, initialState],
  );

  return {
    filters,
    setFilters,
    setFilter,
    resetFilters,
    toggleInArray,
    serialize,
  };
};

export default useDashboardFilters;
