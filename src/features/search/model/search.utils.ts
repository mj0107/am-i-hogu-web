import { POST_CATEGORY_LABEL_BY_VALUE, POST_CATEGORY_VALUES, POST_LIST_PAGE_SIZE } from "@/features/post/constants";
import { MAX_SEARCH_PAGE_SIZE } from "@/features/search/constants";
import type { CategoryParam, SortValue } from "./search.types";

export function parseSortValue(value: string | null): SortValue {
  if (value === "views" || value === "comments" || value === "votes") {
    return value;
  }
  return "latest";
}

export function parsePageSize(value: string | null) {
  const pageSize = Number(value);
  if (!Number.isFinite(pageSize) || pageSize <= 0) {
    return POST_LIST_PAGE_SIZE;
  }
  return Math.min(pageSize, MAX_SEARCH_PAGE_SIZE);
}

export function parseCategoryParams(value: string | null): CategoryParam[] {
  if (!value) {
    return [];
  }
  const raw = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return raw.filter((item): item is CategoryParam => POST_CATEGORY_VALUES.includes(item as CategoryParam));
}

export const PARAM_TO_CATEGORY_LABEL = POST_CATEGORY_LABEL_BY_VALUE;
