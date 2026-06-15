/**
 * @description
 * Auto-generated API parameters from backend OpenAPI paths.
 * Do not edit manually.
 */
export type GetCommentsQuery = {
  /** 정렬 기준. LATEST는 최신순, HELPFUL은 유익해요 많은 순 */
  sortBy?: "LATEST" | "HELPFUL" | null;
  /** 페이지 크기. 최소 1, 최대 15이며 생략 시 기본값은 5 */
  pageSize?: number | null;
  /** 다음 페이지 커서. 이전 응답의 nextCursor 값을 그대로 사용 */
  cursor?: string | null;
};
