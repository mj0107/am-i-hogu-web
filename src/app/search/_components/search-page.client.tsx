"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSearchPageState } from "@/features/search/hooks";
import { RecentSearchSection, SearchHeader, SearchResultSection } from "@/features/search/ui";

export default function SearchPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchPageState = useSearchPageState({
    pathname,
    searchParams,
    push: router.push,
  });

  return (
    <div className="flex min-h-full flex-col bg-bg-01">
      <main className="flex flex-1 flex-col pb-28">
        <SearchHeader
          keywordDraft={searchPageState.keywordDraft}
          onKeywordDraftChange={searchPageState.setKeywordDraft}
          onSearchSubmit={() => searchPageState.handleSearchSubmit(searchPageState.keywordDraft)}
          onBack={() => router.back()}
        />

        {searchPageState.hasSearchCondition ? (
          <SearchResultSection
            keyword={searchPageState.keyword}
            selectedCategoryParams={searchPageState.selectedCategoryParams}
            selectedCategories={searchPageState.selectedCategories}
            sortValue={searchPageState.sortValue}
            pageSize={searchPageState.pageSize}
            onCategoryChange={searchPageState.handleCategoryChange}
            onSortChange={searchPageState.handleSortChange}
          />
        ) : (
          <RecentSearchSection
            recentSearches={searchPageState.recentSearches}
            onClearAll={searchPageState.handleRecentSearchesClear}
            onSelectTerm={searchPageState.handleSearchSubmit}
            onRemoveTerm={searchPageState.handleRecentSearchRemove}
          />
        )}
      </main>
    </div>
  );
}
