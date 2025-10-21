import { useEffect, useState } from "react";
import { recolorSvg } from "@src/utils/recolorSvg";

export interface UseRecoloredSvgResult {
  markup: string | null;
  loading: boolean;
  error: Error | null;
}

const svgSourceCache = new Map<string, string>();

const toError = (error: unknown): Error =>
  error instanceof Error ? error : new Error(String(error));

export const useRecoloredSvg = (
  src: string | null | undefined,
  brandColor: string,
): UseRecoloredSvgResult => {
  const [rawSvg, setRawSvg] = useState<string | null>(null);
  const [result, setResult] = useState<UseRecoloredSvgResult>({
    markup: null,
    loading: Boolean(src),
    error: null,
  });

  useEffect(() => {
    if (!src) {
      setRawSvg(null);
      setResult({
        markup: null,
        loading: false,
        error: new Error("Missing SVG source."),
      });
      return;
    }

    if (svgSourceCache.has(src)) {
      setRawSvg(svgSourceCache.get(src) ?? null);
      setResult((prev) => ({
        ...prev,
        loading: false,
        error: null,
      }));
      return;
    }

    let isActive = true;
    const abortController = new AbortController();

    setResult({
      markup: null,
      loading: true,
      error: null,
    });

    fetch(src, { signal: abortController.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load SVG (${response.status})`);
        }
        return response.text();
      })
      .then((svgText) => {
        if (!isActive) return;
        svgSourceCache.set(src, svgText);
        setRawSvg(svgText);
      })
      .catch((error) => {
        if (!isActive || abortController.signal.aborted) {
          return;
        }
        setRawSvg(null);
        setResult({
          markup: null,
          loading: false,
          error: toError(error),
        });
      });

    return () => {
      isActive = false;
      abortController.abort();
    };
  }, [src]);

  useEffect(() => {
    if (!rawSvg) {
      return;
    }

    try {
      const markup = recolorSvg(rawSvg, brandColor);
      setResult({
        markup,
        loading: false,
        error: null,
      });
    } catch (error) {
      setResult({
        markup: null,
        loading: false,
        error: toError(error),
      });
    }
  }, [rawSvg, brandColor]);

  return result;
};
