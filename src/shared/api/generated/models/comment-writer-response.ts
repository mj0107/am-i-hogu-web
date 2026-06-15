/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface CommentWriterResponse {
  /** 작성자 닉네임 */
  nickname: string;
  /** 작성자 프로필 이미지 URL */
  profileImageUrl: string | null;
  /** 게시물 작성자 여부 */
  isPostWriter: boolean;
}
