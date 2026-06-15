/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface PostVoteResponse {
  /** 총 투표 수 */
  totalVotes: number;
  /** 호구예요 수 */
  yesVotes: number;
  /** 호구아니에요 수 */
  noVotes: number;
  /** 내 투표 값 */
  myVote: "HOGU" | "NOT_HOGU" | "NONE";
}
