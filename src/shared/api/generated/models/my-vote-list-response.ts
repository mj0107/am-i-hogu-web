import type { MyVoteItemResponse } from "./my-vote-item-response";

/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface MyVoteListResponse {
  /** 투표 목록 */
  votes: MyVoteItemResponse[];
  /** 다음 페이지 존재 여부 */
  hasNext: boolean;
  /** 다음 페이지 커서 */
  nextCursor: string | null;
}
