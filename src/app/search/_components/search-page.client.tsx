"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  CATEGORY_TO_PARAM,
  mockSearchPosts,
  PARAM_TO_CATEGORY,
  parseCategoryParams,
  parseCursor,
  parsePageSize,
  parseSortValue,
} from "@/features/search/model/search.mock";
import type { CategoryLabel, SortValue } from "@/features/search/model/search.types";
import { RecentSearchSection } from "@/features/search/ui/recent-search-section";
import { SearchHeader } from "@/features/search/ui/search-header";
import { SearchResultSection } from "@/features/search/ui/search-result-section";
import { FooterWidget } from "@/widgets/footer/ui";

const MAX_RECENT_SEARCHES = 10;
const DEFAULT_CURSOR = "0";

function upsertRecentSearches(previous: string[], keyword: string) {
  const trimmed = keyword.trim();
  if (!trimmed) {
    return previous;
  }

  const deduplicated = previous.filter((item) => item !== trimmed);
  return [trimmed, ...deduplicated].slice(0, MAX_RECENT_SEARCHES);
}

export default function SearchPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const keyword = searchParams.get("keyword") ?? "";
  const selectedCategoryParams = parseCategoryParams(searchParams.get("categories"));
  const selectedCategories = selectedCategoryParams.map((category) => PARAM_TO_CATEGORY[category]);
  const sortValue = parseSortValue(searchParams.get("sortBy"));
  const pageSize = parsePageSize(searchParams.get("pageSize"));
  const cursor = parseCursor(searchParams.get("cursor"));
  const [keywordDraft, setKeywordDraft] = useState(keyword);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const hasSearchCondition = keyword.trim().length > 0 || selectedCategories.length > 0;

  useEffect(() => {
    setKeywordDraft(keyword);
  }, [keyword]);

  const response = useMemo(
    () =>
      mockSearchPosts({
        keyword,
        categories: selectedCategoryParams,
        sortBy: sortValue,
        pageSize,
        cursor,
      }),
    [keyword, selectedCategoryParams, sortValue, pageSize, cursor],
  );

  const pushQuery = (next: {
    keyword?: string;
    categories?: CategoryLabel[];
    sortBy?: SortValue;
    pageSize?: number;
    cursor?: string;
  }) => {
    const query = new URLSearchParams(searchParams.toString());
    const nextKeyword = next.keyword ?? keyword;
    const nextCategories = next.categories ?? selectedCategories;
    const nextSortBy = next.sortBy ?? sortValue;
    const nextPageSize = String(next.pageSize ?? pageSize);
    const nextCursor = next.cursor ?? DEFAULT_CURSOR;

    if (nextKeyword) {
      query.set("keyword", nextKeyword);
    } else {
      query.delete("keyword");
    }

    if (nextCategories.length > 0) {
      query.set("categories", nextCategories.map((label) => CATEGORY_TO_PARAM[label]).join(","));
    } else {
      query.delete("categories");
    }

    query.set("sortBy", nextSortBy);
    query.set("pageSize", nextPageSize);
    query.set("cursor", nextCursor);

    router.push(`${pathname}?${query.toString()}`);
  };

  const runSearch = (nextKeyword: string) => {
    const trimmed = nextKeyword.trim();
    setKeywordDraft(trimmed);
    setRecentSearches((previous) => upsertRecentSearches(previous, trimmed));
    pushQuery({ keyword: trimmed, cursor: DEFAULT_CURSOR });
  };

  return (
    <div className="flex min-h-full flex-col bg-bg-01">
      <main className="flex flex-1 flex-col">
        <SearchHeader
          keywordDraft={keywordDraft}
          onKeywordDraftChange={setKeywordDraft}
          onSearchSubmit={() => runSearch(keywordDraft)}
          onBack={() => router.back()}
        />

        {hasSearchCondition ? (
          <SearchResultSection
            selectedCategories={selectedCategories}
            sortValue={sortValue}
            response={response}
            onCategoryChange={(nextCategories) =>
              pushQuery({
                categories: nextCategories,
                cursor: DEFAULT_CURSOR,
              })
            }
            onSortChange={(nextSort) =>
              pushQuery({
                sortBy: nextSort,
                cursor: DEFAULT_CURSOR,
              })
            }
            onLoadMore={() => pushQuery({ cursor: response.nextCursor ?? undefined })}
          />
        ) : (
          <RecentSearchSection
            recentSearches={recentSearches}
            onClearAll={() => setRecentSearches([])}
            onSelectTerm={runSearch}
            onRemoveTerm={(term) => setRecentSearches((prev) => prev.filter((item) => item !== term))}
          />
        )}
      </main>

      <footer className="sticky bottom-0 z-20 px-common-padding">
        <FooterWidget activeTab="search" />
      </footer>
    </div>
  );
}
