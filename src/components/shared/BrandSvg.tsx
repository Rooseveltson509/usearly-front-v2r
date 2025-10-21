import { memo, type HTMLAttributes } from "react";
import { useRecoloredSvg } from "@src/hooks/useRecoloredSvg";

type SpanProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "dangerouslySetInnerHTML" | "children"
>;

interface BrandSvgProps extends SpanProps {
  src: string;
  brandColor: string;
  alt?: string;
}

const BrandSvgComponent = ({
  src,
  brandColor,
  className,
  alt,
  ...rest
}: BrandSvgProps) => {
  const { markup, loading, error } = useRecoloredSvg(src, brandColor);

  if (error) {
    return <img src={src} className={className} alt={alt ?? ""} />;
  }

  const spanProps: HTMLAttributes<HTMLSpanElement> = {
    ...rest,
    className,
    role: rest.role ?? (alt ? "img" : "presentation"),
    "aria-busy": loading || undefined,
  };

  if (alt) {
    if (!spanProps["aria-label"]) {
      spanProps["aria-label"] = alt;
    }
  } else if (
    spanProps["aria-label"] === undefined &&
    spanProps["aria-hidden"] === undefined
  ) {
    spanProps["aria-hidden"] = true;
  }

  if (!markup) {
    return <span {...spanProps} />;
  }

  return <span {...spanProps} dangerouslySetInnerHTML={{ __html: markup }} />;
};

export const BrandSvg = memo(BrandSvgComponent);
