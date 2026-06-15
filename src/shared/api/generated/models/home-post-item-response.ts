import type { PostWriterResponse } from "./post-writer-response";

/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface HomePostItemResponse {
  /** 게시물 ID */
  postId: number;
  /** 북마크 여부 */
  isBookmarked: boolean;
  /** 카테고리 코드 목록 */
  categories: ("USED_TRADE" | "WORK" | "PURCHASE" | "CONTRACT" | "DATING" | "ETC")[];
  /** 게시물 제목 */
  title: string;
  /** 생성 시각 */
  createdAt: string;
  /** 조회 수 */
  viewCount: number;
  /** 미리보기 본문 */
  contentPreview: string;
  /** 썸네일 URL */
  thumbnailUrl: string | null;
  /** 총 투표 수 */
  totalVoteCount: number;
  /** 댓글 수 */
  commentCount: number;
  writer: PostWriterResponse;
}
