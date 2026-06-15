/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface MyVotePostResponse {
  /** 게시물 ID */
  postId: number;
  /** 게시물 제목 */
  title: string;
  /** 카테고리 코드 */
  category: "USED_TRADE" | "WORK" | "PURCHASE" | "CONTRACT" | "DATING" | "ETC";
  /** 댓글 수 */
  commentCount: number;
  /** 게시물 삭제 여부 */
  isDeleted: boolean;
}
