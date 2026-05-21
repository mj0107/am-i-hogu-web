"use client";

import { useEffect, useState } from "react";
import type { HoguIndexProgressProps } from "@/features/mypage/report/model";
import { cn } from "@/shared/utils";

function clampProgress(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export function HoguIndexProgress({
  value,
  size = 100,
  strokeWidth = 8,
  progressClassName,
  className,
  children,
}: HoguIndexProgressProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const progress = clampProgress(animatedValue);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(() => {
      setAnimatedValue(clampProgress(value));
    });

    return () => cancelAnimationFrame(animationFrameId);
  }, [value]);

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg
        className={cn("absolute inset-0 size-full -rotate-90 text-secondary-default", progressClassName)}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden
      >
        <title>호구 지수 원형 그래프</title>
        <circle
          className="opacity-20"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        <circle
          className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center text-primary-strong">{children}</div>
    </div>
  );
}
