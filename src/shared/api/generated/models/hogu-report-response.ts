import type { CategoryAnalysisResponse } from "./category-analysis-response";

/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface HoguReportResponse {
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
  /** 호구 레벨 상세 설명 */
  hoguDescription: string;
  /** 카테고리별 분석 결과 */
  categoryAnalysis: CategoryAnalysisResponse[];
  /** 전체 게시물 수 */
  totalPostCount: number;
  /** 호구 판정 게시물 수 */
  hoguPostCount: number;
  /** 호구 아님 판정 게시물 수 */
  notHoguPostCount: number;
}
