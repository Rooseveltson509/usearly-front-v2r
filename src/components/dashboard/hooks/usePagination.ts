import { type DependencyList, useEffect, useMemo, useState } from "react";

type OverflowStrategy = "none" | "reset" | "clamp";

type UsePaginationOptions<T> = {
  items?: T[];
  totalItems?: number;
  pageSize: number;
  resetDeps?: DependencyList;
  overflowStrategy?: OverflowStrategy;
};

const usePagination = <T>({
  items,
  totalItems,
  pageSize,
  resetDeps = [],
  overflowStrategy = "clamp",
}: UsePaginationOptions<T>) => {
  const [page, setPage] = useState(1);
  const effectiveTotalItems = totalItems ?? items?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(effectiveTotalItems / pageSize));
  const start = (page - 1) * pageSize;

  const pageItems = useMemo(() => {
    if (!items) return [] as T[];
    return items.slice(start, start + pageSize);
  }, [items, pageSize, start]);

  useEffect(() => {
    if (resetDeps.length === 0) return;
    setPage(1);
  }, resetDeps);

  useEffect(() => {
    if (overflowStrategy === "none") return;
    if (page > totalPages) {
      setPage(overflowStrategy === "reset" ? 1 : totalPages);
    }
  }, [overflowStrategy, page, totalPages]);

  const goPrev = () =>
    setPage((current) => (current > 1 ? current - 1 : current));
  const goNext = () =>
    setPage((current) => (current < totalPages ? current + 1 : current));

  return {
    page,
    setPage,
    totalPages,
    totalItems: effectiveTotalItems,
    start,
    pageItems,
    goPrev,
    goNext,
  };
};

export default usePagination;
