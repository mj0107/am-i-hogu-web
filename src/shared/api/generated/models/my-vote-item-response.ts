import type { MyVotePostResponse } from "./my-vote-post-response";

/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface MyVoteItemResponse {
  /** 내 투표 값 */
  myVote: "HOGU" | "NOT_HOGU";
  /** 투표 시각 */
  createdAt: string;
  post: MyVotePostResponse;
}
