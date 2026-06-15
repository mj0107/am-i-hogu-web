/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface MyPostItemResponse {
  /** 게시물 ID */
  postId: number;
  /** 게시물 제목 */
  title: string;
  /** 카테고리 코드 */
  category: "USED_TRADE" | "WORK" | "PURCHASE" | "CONTRACT" | "DATING" | "ETC";
  /** 게시물 작성 시각 */
  createdAt: string;
  /** 투표 요약 */
  voteSummary: "HOGU" | "NOT_HOGU" | "NONE" | "TIE";
  /** 댓글 수 */
  commentCount: number;
}
