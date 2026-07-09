"use client";

import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import ArrowUpIcon from "@/assets/icons/arrow-up.svg";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils";

export type TopScrollButtonProps = {
  mode?: "single" | "withPostWrite";
  useFlexLayout?: boolean;
  extraBottomOffset?: number;
  isFloatingOpen?: boolean;
  threshold?: number;
  forceVisible?: boolean;
  className?: string;
};

type VisibilityStyleParams = {
  shouldShow: boolean;
  animateIn: boolean;
};

function getVisibilityStyle({ shouldShow, animateIn }: VisibilityStyleParams): CSSProperties {
  if (!shouldShow) {
    return {
      opacity: 0,
      transform: "translateY(0)",
      transition: "opacity 0.3s ease",
    };
  }

  return {
    opacity: 1,
    transform: animateIn ? "translateY(3rem)" : "translateY(0)",
    transition: "transform 0.4s ease-out, opacity 0.3s ease",
  };
}

function useTopScrollVisibility(threshold: number, forceVisible?: boolean) {
  const [isVisible, setIsVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const clearAnimationTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (window.scrollY > threshold) {
      setIsVisible((prev) => {
        if (!prev) {
          clearAnimationTimeout();
          setAnimateIn(true);
          timeoutRef.current = window.setTimeout(() => {
            setAnimateIn(false);
            timeoutRef.current = null;
          }, 50);
        }

        return true;
      });
      return;
    }

    clearAnimationTimeout();
    setIsVisible(false);
    setAnimateIn(false);
  }, [clearAnimationTimeout, threshold]);

  useEffect(() => {
    if (forceVisible !== undefined) {
      setIsVisible(forceVisible);
      setAnimateIn(false);
      return;
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearAnimationTimeout();
    };
  }, [clearAnimationTimeout, forceVisible, handleScroll]);

  return {
    shouldShow: forceVisible ?? isVisible,
    animateIn,
  };
}

export function TopScrollButton(props: TopScrollButtonProps) {
  const {
    mode = "single",
    useFlexLayout = false,
    extraBottomOffset = 0,
    isFloatingOpen = false,
    threshold = 200,
    forceVisible,
    className,
  } = props;
  const { shouldShow, animateIn } = useTopScrollVisibility(threshold, forceVisible);

  if (isFloatingOpen) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    (document.activeElement as HTMLElement | null)?.blur();
  };

  const visibilityStyle = getVisibilityStyle({ shouldShow, animateIn });

  return (
    <div
      className={cn(
        "z-40 h-fit w-fit",
        !useFlexLayout && "fixed right-[var(--spacing-app-floating-edge)]",
        !useFlexLayout && mode === "single" && "bottom-12",
        !useFlexLayout && mode === "withPostWrite" && "bottom-[11.25rem]",
        useFlexLayout && "relative",
        className,
      )}
      style={useFlexLayout ? { bottom: `${12 + extraBottomOffset}px` } : undefined}
    >
      <Button
        type="button"
        variant="primary"
        size="iconLg"
        onClick={scrollToTop}
        style={visibilityStyle}
        className="shadow-strong h-12 w-12 bg-primary-strong"
        aria-label="최상단으로 이동"
      >
        <ArrowUpIcon aria-hidden className="size-5" strokeWidth={24} />
      </Button>
    </div>
  );
}
