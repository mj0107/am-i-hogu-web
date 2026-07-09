"use client";

import { type PointerEvent, type ReactNode, useMemo, useRef, useState } from "react";
import { useHorizontalDragScroll } from "@/shared/hooks/use-horizontal-drag-scroll";
import { cn } from "@/shared/utils";

export type ContentCardCarouselItem = {
  id: string;
  content: ReactNode;
};

export type ContentCardCarouselProps = {
  items: ContentCardCarouselItem[];
  className?: string;
  itemClassName?: string;
  showPagination?: boolean;
  paginationClassName?: string;
};

function resolveActiveIndex(element: HTMLUListElement) {
  const width = element.clientWidth;
  if (width === 0) {
    return 0;
  }

  return Math.round(element.scrollLeft / width);
}

export function ContentCardCarousel(props: ContentCardCarouselProps) {
  const { items, className, itemClassName, showPagination = false, paginationClassName } = props;
  const listRef = useRef<HTMLUListElement | null>(null);
  const { handlePointerDown, handlePointerMove, handlePointerUp } = useHorizontalDragScroll({
    ignorePointerDownSelector: "button, a, input, textarea, select",
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const itemCount = items.length;
  const paginationDotKeys = useMemo(
    () => Array.from({ length: itemCount }, (_, order) => `carousel-dot-${order + 1}`),
    [itemCount],
  );

  const onPointerDown = (event: PointerEvent<HTMLUListElement>) => {
    setIsDragging(true);
    handlePointerDown(event, listRef.current);
  };

  const onPointerMove = (event: PointerEvent<HTMLUListElement>) => {
    handlePointerMove(event, listRef.current, () => {
      if (!listRef.current) {
        return;
      }

      setActiveIndex(resolveActiveIndex(listRef.current));
    });
  };

  const onScroll = () => {
    if (!listRef.current) {
      return;
    }

    setActiveIndex(resolveActiveIndex(listRef.current));
  };

  const onPointerEnd = (event: PointerEvent<HTMLUListElement>) => {
    setIsDragging(false);
    handlePointerUp(event, listRef.current);
  };

  return (
    <div className="relative min-w-0">
      <ul
        ref={listRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onPointerLeave={onPointerEnd}
        className={cn(
          "no-scrollbar flex min-w-0 overflow-x-auto",
          isDragging ? "snap-none" : "snap-x snap-mandatory",
          "cursor-grab select-none active:cursor-grabbing",
          "[&>li]:min-w-0 [&>li]:w-full [&>li]:snap-start [&>li]:shrink-0",
          itemClassName,
          className,
        )}
      >
        {items.map((item) => (
          <li key={item.id} className="min-w-0">
            {item.content}
          </li>
        ))}
      </ul>
      {showPagination && itemCount > 1 ? (
        <div className={cn("pointer-events-none absolute inset-x-0 bottom-2 flex justify-center", paginationClassName)}>
          <div className="flex items-center">
            {paginationDotKeys.map((dotKey, index) => {
              const isActive = index === activeIndex;

              return (
                <span
                  key={dotKey}
                  className="grid h-3 w-3 place-items-center drop-shadow-[0_0_4px_rgba(0,0,0,0.12)] drop-shadow-[0_0_0.5px_rgba(0,0,0,0.08)]"
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", isActive ? "bg-primary-strong" : "bg-bg-01")} />
                </span>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
