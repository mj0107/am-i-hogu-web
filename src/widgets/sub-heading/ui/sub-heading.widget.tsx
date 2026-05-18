"use client";

import { useMemo, useState } from "react";
import { POST_FILTER_OPTIONS, POST_SORT_OPTIONS } from "@/features/post/constants/post-filter.constants";
import { FilterSortBar } from "@/shared/ui";

type PostFilterOption = (typeof POST_FILTER_OPTIONS)[number];
type PostSortValue = (typeof POST_SORT_OPTIONS)[number]["value"];

export type SubHeadingWidgetProps = {
  defaultSelectedOptions?: PostFilterOption[];
  defaultSort?: PostSortValue;
  selectedOptions?: PostFilterOption[];
  sortValue?: PostSortValue;
  totalCount?: number;
  onSelectedOptionsChange?: (options: PostFilterOption[]) => void;
  onSortValueChange?: (sort: PostSortValue) => void;
  className?: string;
};

export function SubHeadingWidget(props: SubHeadingWidgetProps) {
  const {
    defaultSelectedOptions = [],
    defaultSort = "latest",
    selectedOptions: selectedOptionsProp,
    sortValue: sortValueProp,
    totalCount: totalCountProp,
    onSelectedOptionsChange,
    onSortValueChange,
    className,
  } = props;
  const isSelectedControlled = selectedOptionsProp !== undefined;
  const isSortControlled = sortValueProp !== undefined;
  const [internalSelectedOptions, setInternalSelectedOptions] = useState<PostFilterOption[]>(defaultSelectedOptions);
  const [internalSort, setInternalSort] = useState<PostSortValue>(defaultSort);
  const selectedOptions = selectedOptionsProp ?? internalSelectedOptions;
  const sort = sortValueProp ?? internalSort;

  const fallbackTotalCount = useMemo(() => {
    if (selectedOptions.length === 0) {
      return POST_FILTER_OPTIONS.length;
    }

    return selectedOptions.length;
  }, [selectedOptions]);
  const totalCount = totalCountProp ?? fallbackTotalCount;

  const handleToggleOption = (option: PostFilterOption) => {
    const nextSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((value) => value !== option)
      : [...selectedOptions, option];
    if (!isSelectedControlled) {
      setInternalSelectedOptions(nextSelectedOptions);
    }
    onSelectedOptionsChange?.(nextSelectedOptions);
  };

  return (
    <FilterSortBar
      className={className}
      selectedOptions={selectedOptions}
      onToggleOption={(option) => handleToggleOption(option as PostFilterOption)}
      onResetOptions={() => {
        if (!isSelectedControlled) {
          setInternalSelectedOptions([]);
        }
        onSelectedOptionsChange?.([]);
      }}
      options={POST_FILTER_OPTIONS}
      sortValue={sort}
      sortOptions={POST_SORT_OPTIONS}
      onSortChange={(nextSort) => {
        const next = nextSort as PostSortValue;
        if (!isSortControlled) {
          setInternalSort(next);
        }
        onSortValueChange?.(next);
      }}
      totalCount={totalCount}
      allLabel="전체"
    />
  );
}
