/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface MyPageResponse {
  /** 닉네임 */
  nickname: string;
  /** 프로필 이미지 URL */
  profileImageUrl: string | null;
  /** 호구 지수 */
  hoguIndex: number;
  /** 호구 레벨 코드 */
  hoguLevel: "SAFE" | "CAUTIOUS" | "WARNING" | "RISKY" | "CRITICAL" | "NONE";
  /** 호구 레벨 한 줄 설명 */
  hoguShortDescription: string;
}
