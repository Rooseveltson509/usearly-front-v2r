import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

type StepAnimationRenderProps<T, K extends string> = {
  stepIndex: number;
  stepDurationMs: number;
  isAnimating: boolean;
  step: T | undefined;
  steps: T[];
  activeKey: K;
  advanceStep: () => void;
  goToStep: (index: number) => void;
};

type StepAnimationProps<T, K extends string = string> = {
  active?: boolean;
  autoAdvance?: boolean;
  autoAdvanceByKey?: Record<K, boolean[] | undefined>;
  activeKey: K;
  stepsByKey: Record<K, T[]>;
  stepDurationsByKey?: Record<K, number[] | undefined>;
  defaultStepDurationMs?: number;
  resetIndex?: number;
  loop?: boolean;
  children: (props: StepAnimationRenderProps<T, K>) => ReactNode;
};

const StepAnimation = <T, K extends string = string>({
  active = true,
  autoAdvance = true,
  autoAdvanceByKey,
  activeKey,
  stepsByKey,
  stepDurationsByKey = {} as Record<K, number[] | undefined>,
  defaultStepDurationMs = 2200,
  resetIndex = 0,
  loop = true,
  children,
}: StepAnimationProps<T, K>) => {
  const steps = stepsByKey[activeKey] ?? [];
  const stepDurationsMs = stepDurationsByKey[activeKey] ?? [];
  const safeStepsCount = Math.max(steps.length, 1);
  const [stepIndex, setStepIndex] = useState(resetIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoAdvanceForStep =
    autoAdvanceByKey?.[activeKey]?.[stepIndex] ?? autoAdvance;
  const goToStep = useCallback(
    (nextIndex: number) => {
      setStepIndex(() => {
        if (safeStepsCount <= 0) return 0;
        if (loop) {
          const mod =
            ((nextIndex % safeStepsCount) + safeStepsCount) % safeStepsCount;
          return mod;
        }
        return Math.min(Math.max(nextIndex, 0), safeStepsCount - 1);
      });
    },
    [loop, safeStepsCount],
  );
  const advanceStep = () => {
    setStepIndex((prev) => {
      const next = prev + 1;
      if (loop) {
        return next % safeStepsCount;
      }
      return Math.min(next, safeStepsCount - 1);
    });
  };

  useEffect(() => {
    setStepIndex(resetIndex);
  }, [activeKey, resetIndex]);

  useEffect(() => {
    if (!steps.length) {
      if (stepIndex !== resetIndex) {
        setStepIndex(resetIndex);
      }
      return;
    }

    if (stepIndex > steps.length - 1) {
      setStepIndex(resetIndex);
    }
  }, [resetIndex, stepIndex, steps.length]);

  useEffect(() => {
    if (!active) {
      if (stepIndex !== resetIndex) {
        setStepIndex(resetIndex);
      }
      return;
    }

    if (!autoAdvanceForStep) {
      return;
    }

    const duration = stepDurationsMs[stepIndex] ?? defaultStepDurationMs;
    const timeoutId = window.setTimeout(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (loop) {
          return next % safeStepsCount;
        }
        return Math.min(next, safeStepsCount - 1);
      });
    }, duration);

    return () => window.clearTimeout(timeoutId);
  }, [
    active,
    autoAdvanceForStep,
    defaultStepDurationMs,
    loop,
    resetIndex,
    safeStepsCount,
    stepDurationsMs,
    stepIndex,
  ]);

  useLayoutEffect(() => {
    if (!active) {
      setIsAnimating(false);
      return;
    }

    // Restart CSS animations on each step.
    setIsAnimating(false);
    const rafId = window.requestAnimationFrame(() => {
      setIsAnimating(true);
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [active, stepIndex]);

  const stepDurationMs = stepDurationsMs[stepIndex] ?? defaultStepDurationMs;
  const step = steps[stepIndex];

  return children({
    stepIndex,
    stepDurationMs,
    isAnimating,
    step,
    steps,
    activeKey,
    advanceStep,
    goToStep,
  });
};

export default StepAnimation;
