import type { CommentWriterResponse } from "./comment-writer-response";

/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface CommentCreateResponse {
  /** 집단지성 ID */
  commentId: number;
  /** 집단지성 내용 */
  content: string;
  /** 내가 작성한 집단지성 여부. 생성 직후에는 항상 true */
  isMine: boolean;
  writer: CommentWriterResponse;
  /** 생성 시각 */
  createdAt: string;
  /** 수정 시각 */
  updatedAt: string;
  /** 현재 사용자의 유익해요 선택 여부. 생성 직후에는 항상 false */
  isHelpful: boolean;
  /** 총 유익해요 수 */
  totalHelpfulCount: number;
  /** 부모 집단지성 ID. 최상위 집단지성인 경우 null */
  parentId: number | null;
  /** 집단지성 깊이. 최상위는 0, 대댓글은 1 */
  depth: number;
}
