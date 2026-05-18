"use client";

import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import { SearchTextfield } from "@/shared/ui";

type SearchHeaderProps = {
  keywordDraft: string;
  onKeywordDraftChange: (value: string) => void;
  onSearchSubmit: () => void;
  onBack: () => void;
};

export function SearchHeader(props: SearchHeaderProps) {
  const { keywordDraft, onKeywordDraftChange, onSearchSubmit, onBack } = props;

  return (
    <section className="bg-bg-02 px-common-padding pb-4 pt-4" aria-label="검색 헤더">
      <div className="flex items-center gap-2">
        <button type="button" aria-label="뒤로가기" onClick={onBack}>
          <ArrowLeftIcon aria-hidden className="size-5 text-text-03" strokeWidth={20} />
        </button>
        <div className="flex-1">
          <SearchTextfield
            className="bg-bg-01"
            value={keywordDraft}
            onChange={(event) => {
              // TODO: 타이핑 시 연관 검색어(suggestion) API 연동 및 드롭다운 UI 노출 처리
              onKeywordDraftChange(event.target.value);
            }}
            placeholder="검색어를 입력해주세요."
            showClearButton
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onSearchSubmit();
              }
            }}
          />
        </div>
      </div>
    </section>
  );
}
