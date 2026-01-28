import { type DependencyList, useCallback, useEffect, useState } from "react";

type DashboardDataResult<TData, TMeta> = {
  data: TData;
  meta?: TMeta;
};

type UseDashboardDataOptions<TData, TMeta> = {
  initialData: TData;
  fetcher: () => Promise<DashboardDataResult<TData, TMeta>>;
  deps: DependencyList;
  enabled?: boolean;
};

const useDashboardData = <TData, TMeta = undefined>({
  initialData,
  fetcher,
  deps,
  enabled = true,
}: UseDashboardDataOptions<TData, TMeta>) => {
  const [data, setData] = useState<TData>(initialData);
  const [meta, setMeta] = useState<TMeta | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetcher();
      setData(result.data);
      setMeta(result.meta);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    if (!enabled) return;
    void reload();
  }, [enabled, reload]);

  return {
    data,
    setData,
    meta,
    setMeta,
    loading,
    error,
    reload,
  };
};

export default useDashboardData;
