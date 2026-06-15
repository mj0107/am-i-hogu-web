import type { PostImageRequest } from "./post-image-request";

/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface PostUpdateRequest {
  /** 게시물 제목 */
  title?: string;
  /** 변경할 카테고리 코드 목록. 1개만 허용 */
  categories?: ("USED_TRADE" | "WORK" | "PURCHASE" | "CONTRACT" | "DATING" | "ETC")[];
  /** 게시물 본문 */
  content?: string;
  /** 이미지 목록 */
  images?: PostImageRequest[];
}
