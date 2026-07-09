"use client";

import type { PointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import XIcon from "@/assets/icons/x.svg";
import { useHorizontalDragScroll } from "@/shared/hooks/use-horizontal-drag-scroll";
import { Chip } from "@/shared/ui/chip";
import { SortSelect, type SortSelectOption } from "@/shared/ui/sort-select";
import { cn } from "@/shared/utils";

export type FilterSortBarProps = {
  options?: readonly string[];
  selectedOptions?: string[];
  onToggleOption?: (option: string) => void;
  onResetOptions?: () => void;
  sortValue?: string;
  sortOptions?: readonly SortSelectOption<string>[];
  onSortChange?: (sort: string) => void;
  totalCount?: number;
  allLabel?: string;
  className?: string;
};

type UseCategoryFadeEffectParams = {
  updateCategoryFade: () => void;
};

type UseSelectedCategoryExpandedEffectParams = {
  selectedOptionsLength: number;
  setIsSelectedCategoryExpanded: (value: boolean) => void;
};

function useCategoryFadeEffect({ updateCategoryFade }: UseCategoryFadeEffectParams) {
  useEffect(() => {
    updateCategoryFade();
    window.addEventListener("resize", updateCategoryFade);

    return () => {
      window.removeEventListener("resize", updateCategoryFade);
    };
  }, [updateCategoryFade]);
}

function useSelectedCategoryExpandedEffect({
  selectedOptionsLength,
  setIsSelectedCategoryExpanded,
}: UseSelectedCategoryExpandedEffectParams) {
  useEffect(() => {
    if (selectedOptionsLength <= 2) {
      setIsSelectedCategoryExpanded(false);
    }
  }, [selectedOptionsLength, setIsSelectedCategoryExpanded]);
}

export function FilterSortBar(props: FilterSortBarProps) {
  const {
    options = [],
    selectedOptions = [],
    onToggleOption,
    onResetOptions,
    sortValue,
    sortOptions = [],
    onSortChange,
    totalCount = 0,
    allLabel = "전체",
    className,
  } = props;

  const hasSelectedOptions = selectedOptions.length > 0;
  const [isSelectedCategoryExpanded, setIsSelectedCategoryExpanded] = useState(false);
  const visibleSelectedOptions = isSelectedCategoryExpanded ? selectedOptions : selectedOptions.slice(0, 2);
  const hiddenSelectedCount = Math.max(0, selectedOptions.length - visibleSelectedOptions.length);
  const categoryScrollRef = useRef<HTMLUListElement>(null);
  const selectedScrollRef = useRef<HTMLUListElement>(null);
  const [showCategoryFade, setShowCategoryFade] = useState(true);
  const categoryScroll = useHorizontalDragScroll({ preventDefaultOnPointerDown: false });
  const selectedScroll = useHorizontalDragScroll({ preventDefaultOnPointerDown: false });

  const updateCategoryFade = useCallback(() => {
    const element = categoryScrollRef.current;
    if (!element) {
      return;
    }

    const canScroll = element.scrollWidth > element.clientWidth;
    const reachedEnd = element.scrollLeft + element.clientWidth >= element.scrollWidth - 1;
    setShowCategoryFade(canScroll && !reachedEnd);
  }, []);

  useCategoryFadeEffect({ updateCategoryFade });
  useSelectedCategoryExpandedEffect({
    selectedOptionsLength: selectedOptions.length,
    setIsSelectedCategoryExpanded,
  });

  const onCategoryPointerDown = (event: PointerEvent<HTMLUListElement>) => {
    categoryScroll.handlePointerDown(event, categoryScrollRef.current);
  };

  const onSelectedPointerDown = (event: PointerEvent<HTMLUListElement>) => {
    selectedScroll.handlePointerDown(event, selectedScrollRef.current);
  };

  const onCategoryPointerEnd = (event: PointerEvent<HTMLUListElement>) => {
    categoryScroll.handlePointerUp(event, categoryScrollRef.current);
  };

  const onSelectedPointerEnd = (event: PointerEvent<HTMLUListElement>) => {
    selectedScroll.handlePointerUp(event, selectedScrollRef.current);
  };

  return (
    <section className={cn("flex w-full flex-col gap-5", className)}>
      <div className="relative">
        <ul
          data-drag-scroll="x"
          ref={categoryScrollRef}
          onScroll={updateCategoryFade}
          onPointerDown={onCategoryPointerDown}
          onPointerMove={(event) =>
            categoryScroll.handlePointerMove(event, categoryScrollRef.current, updateCategoryFade)
          }
          onPointerUp={onCategoryPointerEnd}
          onPointerCancel={onCategoryPointerEnd}
          onPointerLeave={onCategoryPointerEnd}
          className={cn("flex gap-2 overflow-x-auto", showCategoryFade ? "pr-10" : "")}
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
        >
          <li>
            <Chip
              onClick={(event) => {
                if (categoryScroll.guardClickWhenDragged(event)) {
                  return;
                }
                onResetOptions?.();
              }}
              tone={hasSelectedOptions ? "inactive" : "active"}
              className="shrink-0"
            >
              {allLabel}
            </Chip>
          </li>

          {options.map((option) => {
            const isActive = selectedOptions.includes(option);

            return (
              <li key={option}>
                <Chip
                  onClick={(event) => {
                    if (categoryScroll.guardClickWhenDragged(event)) {
                      return;
                    }
                    onToggleOption?.(option);
                  }}
                  tone={isActive ? "active" : "inactive"}
                  className="shrink-0"
                >
                  {option}
                </Chip>
              </li>
            );
          })}
        </ul>
        {showCategoryFade ? (
          <div className="pointer-events-none absolute right-0 top-0 h-9 w-14 bg-gradient-to-l from-bg-01 to-transparent" />
        ) : null}
      </div>

      <div className="flex min-h-9 items-center justify-between gap-2">
        <ul
          data-drag-scroll="x"
          ref={selectedScrollRef}
          onPointerDown={onSelectedPointerDown}
          onPointerMove={(event) => selectedScroll.handlePointerMove(event, selectedScrollRef.current)}
          onPointerUp={onSelectedPointerEnd}
          onPointerCancel={onSelectedPointerEnd}
          onPointerLeave={onSelectedPointerEnd}
          className="flex items-center gap-2 overflow-x-auto"
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
        >
          {visibleSelectedOptions.map((option) => (
            <li key={option}>
              <Chip
                onClick={(event) => {
                  if (selectedScroll.guardClickWhenDragged(event)) {
                    return;
                  }
                  onToggleOption?.(option);
                }}
                tone="inactive"
                className="shrink-0"
                rightIcon={<XIcon aria-hidden className="size-4 text-text-03" strokeWidth={20} />}
              >
                {option}
              </Chip>
            </li>
          ))}
          {hiddenSelectedCount > 0 ? (
            <li>
              <Chip
                onClick={(event) => {
                  if (selectedScroll.guardClickWhenDragged(event)) {
                    return;
                  }
                  setIsSelectedCategoryExpanded(true);
                }}
                tone="inactive"
                className="shrink-0"
                aria-label={`숨겨진 카테고리 ${hiddenSelectedCount}개 보기`}
              >
                +{hiddenSelectedCount}
              </Chip>
            </li>
          ) : null}

          {hasSelectedOptions ? <li className="shrink-0 text-caption-sb text-text-03">{totalCount}개</li> : null}
        </ul>

        {sortOptions.length > 0 && sortValue !== undefined ? (
          <SortSelect value={sortValue} options={sortOptions} onChange={(nextSort) => onSortChange?.(nextSort)} />
        ) : null}
      </div>
    </section>
  );
}
