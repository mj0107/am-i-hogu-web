/**
 * @description
 * Auto-generated API parameters from backend OpenAPI paths.
 * Do not edit manually.
 */
export type GetHomePostsQuery = {
  /** 검색 키워드 */
  keyword?: string | null;
  /** 쉼표로 구분된 카테고리 코드들 */
  categories?: "USED_TRADE" | "WORK" | "PURCHASE" | "CONTRACT" | "DATING" | "ETC" | null;
  /** 정렬 기준 */
  sortBy?: "LATEST" | "MOST_VIEWED" | "MOST_COMMENTED" | "MOST_PARTICIPATED" | null;
  /** 페이지 크기 */
  pageSize?: number | null;
  /** 다음 페이지 커서 */
  cursor?: string | null;
};
