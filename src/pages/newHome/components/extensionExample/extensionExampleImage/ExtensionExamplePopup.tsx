import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
} from "react";
import gsap, { type TweenVars } from "gsap";
import StepAnimation from "@src/components/shared/StepAnimation";
import type { ExtensionScenario } from "../extensionExample.types";

export type PopupAnimationPreset =
  | "fade"
  | "fade-up"
  | "fade-down"
  | "slide-left"
  | "slide-right";

export type PopupAdvanceMode = "auto" | "click";

export type PopupClickTarget = {
  x: number;
  y: number;
  width: number;
  height: number;
  targetIndex: number;
};

export type CursorPosition = { x: string; y: string };
export type CursorPath = CursorPosition[];
export type CursorPathCollection = CursorPath[];

const DEFAULT_POPUP_ANIMATION_PRESET: PopupAnimationPreset = "fade-up";
const DEFAULT_POPUP_ANIMATION_DURATION_MS = 420;

const POPUP_ANIMATION_PRESETS: Record<
  PopupAnimationPreset,
  { from: TweenVars; to: TweenVars }
> = {
  fade: { from: { opacity: 0 }, to: { opacity: 1 } },
  "fade-up": { from: { opacity: 0, y: 18 }, to: { opacity: 1, y: 0 } },
  "fade-down": { from: { opacity: 0, y: -18 }, to: { opacity: 1, y: 0 } },
  "slide-left": { from: { opacity: 0, x: 26 }, to: { opacity: 1, x: 0 } },
  "slide-right": { from: { opacity: 0, x: -26 }, to: { opacity: 1, x: 0 } },
};

const parsePercent = (value: string) => {
  if (!value.endsWith("%")) return null;
  const parsed = Number.parseFloat(value.slice(0, -1));
  return Number.isFinite(parsed) ? parsed : null;
};

const parseLength = (value: string, size: number) => {
  if (value.endsWith("%")) {
    const parsed = Number.parseFloat(value.slice(0, -1));
    return Number.isFinite(parsed) ? (size * parsed) / 100 : size / 2;
  }
  if (value === "center") return size / 2;
  if (value === "left" || value === "top") return 0;
  if (value === "right" || value === "bottom") return size;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : size / 2;
};

const getTransformInfo = (transform: string) => {
  if (!transform || transform === "none") {
    return { scaleX: 1, scaleY: 1, translateX: 0, translateY: 0 };
  }

  const match3d = transform.match(/matrix3d\(([^)]+)\)/);
  if (match3d) {
    const values = match3d[1]
      .split(",")
      .map((value) => Number.parseFloat(value));
    if (values.length >= 16) {
      return {
        scaleX: Number.isFinite(values[0]) ? values[0] : 1,
        scaleY: Number.isFinite(values[5]) ? values[5] : 1,
        translateX: Number.isFinite(values[12]) ? values[12] : 0,
        translateY: Number.isFinite(values[13]) ? values[13] : 0,
      };
    }
  }

  const match2d = transform.match(/matrix\(([^)]+)\)/);
  if (match2d) {
    const values = match2d[1]
      .split(",")
      .map((value) => Number.parseFloat(value));
    if (values.length >= 6) {
      const [a, b, c, d, e, f] = values;
      const scaleX =
        Number.isFinite(a) && Number.isFinite(b) ? Math.hypot(a, b) : 1;
      const scaleY =
        Number.isFinite(c) && Number.isFinite(d) ? Math.hypot(c, d) : 1;
      return {
        scaleX,
        scaleY,
        translateX: Number.isFinite(e) ? e : 0,
        translateY: Number.isFinite(f) ? f : 0,
      };
    }
  }

  return { scaleX: 1, scaleY: 1, translateX: 0, translateY: 0 };
};

const getOffsetWithin = (element: HTMLElement, ancestor: HTMLElement) => {
  let x = 0;
  let y = 0;
  let current: HTMLElement | null = element;

  while (current && current !== ancestor) {
    x += current.offsetLeft;
    y += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }

  return { x, y };
};

type CursorTrailProps = {
  path: CursorPath;
  stepClass: string;
  stepDurationMs: number;
  imageRef: RefObject<HTMLImageElement | null>;
};

const CursorTrail = ({
  path,
  stepClass,
  stepDurationMs,
  imageRef,
  slowCursor,
}: CursorTrailProps) => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const fallbackCursorPosition = path[0] ?? { x: "50%", y: "50%" };
  const [cursorIndex, setCursorIndex] = useState(0);
  const [cursorStyle, setCursorStyle] = useState(() => ({
    left: fallbackCursorPosition.x,
    top: fallbackCursorPosition.y,
  }));
  const activeCursorPosition = path[cursorIndex] ?? fallbackCursorPosition;

  const durationScale = slowCursor ? 1.5 : 1;
  const cursorMovesCount = Math.max(path.length - 1, 1);
  const cursorMoveDuration =
    path.length > 1
      ? Math.max(
          160,
          Math.round(
            (stepDurationMs * durationScale) /
              Math.max(1, cursorMovesCount * 1.3),
          ),
        )
      : Math.max(120, Math.round(stepDurationMs * durationScale * 0.35));
  const cursorClickDelay = Math.max(
    110,
    Math.round(stepDurationMs * durationScale * 0.35),
  );
  const cursorClickDuration = Math.max(
    230,
    Math.round(stepDurationMs * durationScale * 0.35),
  );

  const updateCursorPosition = useCallback(() => {
    const image = imageRef.current;
    const cursor = cursorRef.current;
    if (!image || !cursor) return;

    const offsetParent = cursor.offsetParent as HTMLElement | null;
    if (!offsetParent) return;

    const xPercent = parsePercent(activeCursorPosition.x);
    const yPercent = parsePercent(activeCursorPosition.y);

    if (xPercent === null || yPercent === null) {
      setCursorStyle({
        left: activeCursorPosition.x,
        top: activeCursorPosition.y,
      });
      return;
    }

    const width = image.offsetWidth;
    const height = image.offsetHeight;
    if (!width || !height) return;

    const style = window.getComputedStyle(image);
    const originParts = style.transformOrigin.split(" ");
    const originX = parseLength(originParts[0] ?? "50%", width);
    const originY = parseLength(originParts[1] ?? "50%", height);
    const { scaleX, scaleY, translateX, translateY } = getTransformInfo(
      style.transform,
    );

    const localX = (width * xPercent) / 100;
    const localY = (height * yPercent) / 100;
    const scaledX = originX + scaleX * (localX - originX) + translateX;
    const scaledY = originY + scaleY * (localY - originY) + translateY;
    const offset = getOffsetWithin(image, offsetParent);
    const left = `${Math.round(offset.x + scaledX)}px`;
    const top = `${Math.round(offset.y + scaledY)}px`;

    setCursorStyle((prev) =>
      prev.left === left && prev.top === top ? prev : { left, top },
    );
  }, [activeCursorPosition.x, activeCursorPosition.y, imageRef]);

  useEffect(() => {
    setCursorIndex(0);
    setCursorStyle({
      left: fallbackCursorPosition.x,
      top: fallbackCursorPosition.y,
    });
  }, [fallbackCursorPosition.x, fallbackCursorPosition.y, path]);

  useEffect(() => {
    if (path.length <= 1) return;

    const timeouts = path.map((_, index) => {
      if (index === 0) return null;
      return window.setTimeout(
        () => {
          setCursorIndex(index);
        },
        Math.max(0, cursorMoveDuration) * index,
      );
    });

    return () => {
      timeouts.forEach((timeoutId) => {
        if (timeoutId !== null) {
          window.clearTimeout(timeoutId);
        }
      });
    };
  }, [cursorMoveDuration, path]);

  useLayoutEffect(() => {
    let rafId: number | null = null;
    const scheduleUpdate = () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(updateCursorPosition);
    };

    scheduleUpdate();

    const image = imageRef.current;
    const cursor = cursorRef.current;
    const offsetParent = cursor?.offsetParent as HTMLElement | null;
    const observers: ResizeObserver[] = [];

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => scheduleUpdate());
      if (image) observer.observe(image);
      if (offsetParent) observer.observe(offsetParent);
      observers.push(observer);
    }

    const handleResize = () => scheduleUpdate();
    window.addEventListener("resize", handleResize);
    image?.addEventListener("load", scheduleUpdate);

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      image?.removeEventListener("load", scheduleUpdate);
      observers.forEach((observer) => observer.disconnect());
    };
  }, [stepDurationMs, path, updateCursorPosition]);

  return (
    <div
      ref={cursorRef}
      className={`extension-mouse ${stepClass}`}
      style={{
        left: cursorStyle.left,
        top: cursorStyle.top,
        transitionDuration: `${cursorMoveDuration}ms`,
      }}
      aria-hidden="true"
    >
      <span className="cursor-dot" />
      <span
        key={`pulse-${stepClass}-${cursorIndex}`}
        className="cursor-pulse"
        style={{
          animationDelay: `${cursorClickDelay}ms`,
          animationDuration: `${cursorClickDuration}ms`,
        }}
      />
    </div>
  );
};

type PopupFrameProps = {
  stepClass: string;
  popupSrc: string;
  modeClass: string;
  cursorPaths: CursorPath[];
  showCursor: boolean;
  stepDurationMs: number;
  stepIndex: number;
  animationPreset?: PopupAnimationPreset;
  ariaLabel: string;
  onAdvance?: () => void;
  clickTargets?: PopupClickTarget[];
  onClickTarget?: (targetIndex: number) => void;
};

const PopupFrame = ({
  stepClass,
  popupSrc,
  modeClass,
  cursorPaths,
  showCursor,
  stepDurationMs,
  stepIndex,
  animationPreset,
  ariaLabel,
  onAdvance,
  clickTargets,
  onClickTarget,
}: PopupFrameProps) => {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const hasAnimatedRef = useRef(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const validCursorPaths =
    cursorPaths && cursorPaths.length
      ? cursorPaths
      : [[{ x: "50%", y: "50%" }]];
  const canInteract = Boolean(onAdvance || onClickTarget);

  useLayoutEffect(() => {
    const node = frameRef.current;
    if (!node) return;

    const mediaQuery =
      typeof window !== "undefined"
        ? window.matchMedia?.("(prefers-reduced-motion: reduce)")
        : null;
    const reduceMotion = mediaQuery?.matches ?? false;

    gsap.killTweensOf(node);

    if (!hasAnimatedRef.current || reduceMotion) {
      gsap.set(node, { clearProps: "transform,opacity" });
      hasAnimatedRef.current = true;
      return;
    }

    const preset =
      POPUP_ANIMATION_PRESETS[
        animationPreset ?? DEFAULT_POPUP_ANIMATION_PRESET
      ];

    gsap.fromTo(
      node,
      { ...preset.from },
      {
        ...preset.to,
        duration: DEFAULT_POPUP_ANIMATION_DURATION_MS / 1000,
        ease: "power3.out",
        overwrite: "auto",
        clearProps: "transform,opacity",
      },
    );
  }, [animationPreset, modeClass, popupSrc, stepClass]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!canInteract) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onAdvance?.();
      }
    },
    [canInteract, onAdvance],
  );

  const handleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!canInteract) return;
      if (clickTargets?.length && onClickTarget) {
        const image = imageRef.current;
        if (image) {
          const rect = image.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            const target = clickTargets.find((item) => {
              const withinX = x >= item.x && x <= item.x + item.width;
              const withinY = y >= item.y && y <= item.y + item.height;
              return withinX && withinY;
            });
            if (target) {
              onClickTarget(target.targetIndex);
              return;
            }
          }
        }
      }
      onAdvance?.();
    },
    [canInteract, clickTargets, onAdvance, onClickTarget],
  );

  return (
    <div
      ref={frameRef}
      className={`${modeClass} extension-popup-frame ${stepClass}`}
      role={canInteract ? "button" : undefined}
      tabIndex={canInteract ? 0 : undefined}
      aria-label={canInteract ? ariaLabel : undefined}
      onClick={canInteract ? handleClick : undefined}
      onKeyDown={canInteract ? handleKeyDown : undefined}
    >
      <img
        ref={imageRef}
        src={popupSrc}
        alt=""
        className={`extension-image ${modeClass} ${stepClass}`}
        draggable={false}
      />
      {/* {clickTargets?.length ? (
        <div
          className={`extension-click-targets ${modeClass} ${stepClass}`}
          aria-hidden="true"
        >
          {clickTargets.map((target, index) => (
            <span
              key={`target-${stepClass}-${index}`}
              className="extension-click-target"
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                width: `${target.width}%`,
                height: `${target.height}%`,
              }}
            />
          ))}
        </div>
      ) : null} */}
      {showCursor &&
        validCursorPaths.map((path, index) => (
          <CursorTrail
            key={`cursor-${stepClass}-${index}`}
            path={path}
            stepClass={stepClass}
            stepDurationMs={stepDurationMs}
            imageRef={imageRef}
            slowCursor={stepIndex === 0}
          />
        ))}
    </div>
  );
};

type ExtensionExamplePopupProps = {
  activeKey: ExtensionScenario;
  modeClass: string;
  stepsByScenario: Record<ExtensionScenario, string[]>;
  stepDurationsByScenario: Record<ExtensionScenario, number[]>;
  cursorPathsByScenario: Record<ExtensionScenario, CursorPath[][]>;
  cursorVisibilityByScenario: Record<ExtensionScenario, boolean[]>;
  popupAnimationPresetsByScenario: Record<
    ExtensionScenario,
    PopupAnimationPreset[]
  >;
  defaultStepDurationMs: number;
  fallbackPopupSrc: string;
  ariaLabel: string;
  advanceMode?: PopupAdvanceMode;
  advanceModesByScenario?: Record<
    ExtensionScenario,
    PopupAdvanceMode[] | undefined
  >;
  clickTargetsByScenario?: Record<
    ExtensionScenario,
    PopupClickTarget[][] | undefined
  >;
  stayOnStepsByScenario?: Record<ExtensionScenario, number[]>;
  stayTargetIndexByScenario?: Record<ExtensionScenario, number>;
};

const ExtensionExamplePopup = ({
  activeKey,
  modeClass,
  stepsByScenario,
  stepDurationsByScenario,
  cursorPathsByScenario,
  cursorVisibilityByScenario,
  popupAnimationPresetsByScenario,
  defaultStepDurationMs,
  fallbackPopupSrc,
  ariaLabel,
  advanceMode = "click",
  advanceModesByScenario,
  clickTargetsByScenario,
  stayOnStepsByScenario,
  stayTargetIndexByScenario,
}: ExtensionExamplePopupProps) => {
  const autoAdvanceByScenario = advanceModesByScenario
    ? (Object.keys(advanceModesByScenario) as ExtensionScenario[]).reduce(
        (acc, key) => {
          const modes = advanceModesByScenario[key];
          if (modes) {
            acc[key] = modes.map((mode) => mode === "auto");
          }
          return acc;
        },
        {} as Record<ExtensionScenario, boolean[]>,
      )
    : undefined;

  return (
    <StepAnimation
      activeKey={activeKey}
      stepsByKey={stepsByScenario}
      stepDurationsByKey={stepDurationsByScenario}
      defaultStepDurationMs={defaultStepDurationMs}
      autoAdvance={advanceMode === "auto"}
      autoAdvanceByKey={autoAdvanceByScenario}
    >
      {({
        stepIndex,
        stepDurationMs,
        step,
        activeKey,
        advanceStep,
        goToStep,
      }) => {
        const popupSrc = step ?? fallbackPopupSrc;
        const cursorPaths = cursorPathsByScenario[activeKey]?.[stepIndex] ?? [
          [{ x: "50%", y: "50%" }],
        ];
        const showCursor =
          cursorVisibilityByScenario[activeKey]?.[stepIndex] ?? true;
        const stepClass = `e${stepIndex}`;
        const animationPreset =
          popupAnimationPresetsByScenario[activeKey]?.[stepIndex];
        const stepAdvanceMode =
          advanceModesByScenario?.[activeKey]?.[stepIndex] ?? advanceMode;
        const clickTargets =
          clickTargetsByScenario?.[activeKey]?.[stepIndex] ?? [];
        const holdSteps = stayOnStepsByScenario?.[activeKey];
        const targetIndex = stayTargetIndexByScenario?.[activeKey];
        const shouldHold =
          holdSteps !== undefined &&
          holdSteps.length > 0 &&
          holdSteps.includes(stepIndex) &&
          targetIndex !== undefined;

        const onAdvance =
          stepAdvanceMode === "click"
            ? () => {
                if (shouldHold) {
                  goToStep(targetIndex);
                  return;
                }
                advanceStep();
              }
            : undefined;
        const onClickTarget =
          stepAdvanceMode === "click"
            ? (targetIndex: number) => {
                goToStep(targetIndex);
              }
            : undefined;

        return (
          <PopupFrame
            stepClass={stepClass}
            popupSrc={popupSrc}
            modeClass={modeClass}
            cursorPaths={cursorPaths}
            showCursor={showCursor}
            stepDurationMs={stepDurationMs}
            stepIndex={stepIndex}
            animationPreset={animationPreset}
            ariaLabel={ariaLabel}
            onAdvance={onAdvance}
            clickTargets={clickTargets}
            onClickTarget={onClickTarget}
          />
        );
      }}
    </StepAnimation>
  );
};

export default ExtensionExamplePopup;
