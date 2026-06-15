import type { PostVoteResponse } from "./post-vote-response";
import type { PostWriterResponse } from "./post-writer-response";

/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface PostDetailResponse {
  /** 게시물 ID */
  postId: number;
  /** 내가 작성한 글 여부 */
  isMine: boolean;
  /** 카테고리 코드 목록 */
  categories: ("USED_TRADE" | "WORK" | "PURCHASE" | "CONTRACT" | "DATING" | "ETC")[];
  /** 게시물 제목 */
  title: string;
  /** 생성 시각 */
  createdAt: string;
  /** 수정 시각 */
  updatedAt: string;
  /** 조회 수 */
  viewCount: number;
  /** 게시물 본문 */
  content: string;
  /** 이미지 URL 목록 */
  images: string[];
  vote: PostVoteResponse;
  writer: PostWriterResponse;
}
