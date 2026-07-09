"use client";

import type { ReadonlyURLSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { POST_CATEGORY_VALUE_BY_LABEL, POST_LIST_PAGE_SIZE } from "@/features/post/constants";
import { MAX_RECENT_SEARCHES } from "@/features/search/constants";
import {
  type CategoryLabel,
  PARAM_TO_CATEGORY_LABEL,
  parseCategoryParams,
  parsePageSize,
  parseSortValue,
  type SortValue,
} from "@/features/search/model";

/**
 * 탐색 페이지의 URL query 상태와 최근 검색어 상태를 관리하는 훅
 *
 * @description
 * 검색어, 카테고리, 정렬, pageSize는 URL query를 단일 source of truth로 두고,
 * 입력 중인 검색어와 최근 검색어만 클라이언트 상태로 관리합니다.
 */

type UseSearchPageStateParams = {
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
  push: (href: string) => void;
};

const RECENT_SEARCHES_STORAGE_KEY = "hogu:recent-searches";

function readRecentSearches() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === "string").slice(0, MAX_RECENT_SEARCHES);
  } catch {
    return [];
  }
}

function writeRecentSearches(recentSearches: string[]) {
  try {
    window.localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(recentSearches));
  } catch {
    // localStorage 접근이 제한된 환경에서는 화면 상태만 유지한다.
  }
}

function upsertRecentSearches(previous: string[], keyword: string) {
  const trimmed = keyword.trim();
  if (!trimmed) {
    return previous;
  }

  const deduplicated = previous.filter((item) => item !== trimmed);
  return [trimmed, ...deduplicated].slice(0, MAX_RECENT_SEARCHES);
}

export function useSearchPageState(params: UseSearchPageStateParams) {
  const { pathname, searchParams, push } = params;

  const keyword = searchParams.get("keyword") ?? "";
  const selectedCategoryParams = parseCategoryParams(searchParams.get("categories"));
  const selectedCategories = selectedCategoryParams.map((category) => PARAM_TO_CATEGORY_LABEL[category]);
  const sortValue = parseSortValue(searchParams.get("sortBy"));
  const pageSize = parsePageSize(searchParams.get("pageSize"));
  const hasSearchCondition = keyword.trim().length > 0 || selectedCategories.length > 0;
  const [keywordDraft, setKeywordDraft] = useState(keyword);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isRecentSearchesLoaded, setIsRecentSearchesLoaded] = useState(false);

  useEffect(() => {
    setRecentSearches(readRecentSearches());
    setIsRecentSearchesLoaded(true);
  }, []);

  useEffect(() => {
    setKeywordDraft(keyword);
  }, [keyword]);

  useEffect(() => {
    if (!isRecentSearchesLoaded) {
      return;
    }

    writeRecentSearches(recentSearches);
  }, [isRecentSearchesLoaded, recentSearches]);

  const pushQuery = (next: {
    keyword?: string;
    categories?: CategoryLabel[];
    sortBy?: SortValue;
    pageSize?: number;
  }) => {
    const query = new URLSearchParams(searchParams.toString());
    const nextKeyword = next.keyword ?? keyword;
    const nextCategories = next.categories ?? selectedCategories;
    const nextSortBy = next.sortBy ?? sortValue;
    const nextPageSize = String(next.pageSize ?? pageSize ?? POST_LIST_PAGE_SIZE);

    if (nextKeyword) {
      query.set("keyword", nextKeyword);
    } else {
      query.delete("keyword");
    }

    if (nextCategories.length > 0) {
      query.set("categories", nextCategories.map((label) => POST_CATEGORY_VALUE_BY_LABEL[label]).join(","));
    } else {
      query.delete("categories");
    }

    query.set("sortBy", nextSortBy);
    query.set("pageSize", nextPageSize);
    query.delete("cursor");

    push(`${pathname}?${query.toString()}`);
  };

  const handleSearchSubmit = (nextKeyword: string) => {
    const trimmed = nextKeyword.trim();
    setKeywordDraft(trimmed);
    setRecentSearches((previous) => upsertRecentSearches(previous, trimmed));
    pushQuery({ keyword: trimmed });
  };

  const handleCategoryChange = (nextCategories: CategoryLabel[]) => {
    pushQuery({ categories: nextCategories });
  };

  const handleSortChange = (nextSort: SortValue) => {
    pushQuery({ sortBy: nextSort });
  };

  const handleRecentSearchesClear = () => {
    setRecentSearches([]);
  };

  const handleRecentSearchRemove = (term: string) => {
    setRecentSearches((previous) => previous.filter((item) => item !== term));
  };

  return {
    keyword,
    keywordDraft,
    selectedCategoryParams,
    selectedCategories,
    sortValue,
    pageSize,
    recentSearches,
    hasSearchCondition,
    setKeywordDraft,
    handleSearchSubmit,
    handleCategoryChange,
    handleSortChange,
    handleRecentSearchesClear,
    handleRecentSearchRemove,
  };
}
