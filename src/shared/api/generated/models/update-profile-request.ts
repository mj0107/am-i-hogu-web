/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface UpdateProfileRequest {
  /** 설정하고자 하는 닉네임 */
  nickname?: string | null;
  /** 프로필 이미지 URL. 필드 미포함 시 유지, null이면 삭제, 문자열이면 업데이트 */
  profileImageUrl?: string | null;
}
