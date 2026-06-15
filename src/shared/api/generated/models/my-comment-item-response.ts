import type { MyCommentPostResponse } from "./my-comment-post-response";

/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface MyCommentItemResponse {
  /** 댓글 ID */
  commentId: number;
  /** 댓글 내용 */
  content: string;
  /** 댓글 작성 시각 */
  createdAt: string;
  post: MyCommentPostResponse;
}
