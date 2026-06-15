/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface UpdateProfileResponse {
  /** 유저를 구분하는 고유의 id */
  id: number;
  /** 유저가 설정한 닉네임 */
  nickname: string;
  /** 프로필 이미지 URL. 프로필 이미지가 삭제되었거나 없는 경우 null */
  profileImageUrl: string | null;
}
