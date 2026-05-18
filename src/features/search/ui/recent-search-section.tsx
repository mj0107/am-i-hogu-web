"use client";

import XIcon from "@/assets/icons/x.svg";

type RecentSearchSectionProps = {
  recentSearches: string[];
  onClearAll: () => void;
  onSelectTerm: (term: string) => void;
  onRemoveTerm: (term: string) => void;
};

export function RecentSearchSection(props: RecentSearchSectionProps) {
  const { recentSearches, onClearAll, onSelectTerm, onRemoveTerm } = props;

  return (
    <section aria-label="최근 검색어" className="flex-1">
      <div className="flex items-center justify-between border-b border-line-02 px-common-padding py-4">
        <h2 className="text-body-m text-text-04">최근 검색어</h2>
        <button type="button" className="text-caption-m text-text-03" onClick={onClearAll}>
          전체 삭제
        </button>
      </div>

      {recentSearches.length > 0 ? (
        <ul>
          {recentSearches.map((term) => (
            <li key={term} className="flex items-center justify-between px-common-padding py-4">
              <button type="button" className="text-body-m text-text-03" onClick={() => onSelectTerm(term)}>
                {term}
              </button>
              <button type="button" aria-label={`${term} 검색어 삭제`} onClick={() => onRemoveTerm(term)}>
                <XIcon aria-hidden className="size-4 text-text-03" strokeWidth={20} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-common-padding py-4 text-body-m text-text-03">최근 검색된 검색어가 없습니다.</p>
      )}
    </section>
  );
}
