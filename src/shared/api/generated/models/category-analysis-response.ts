/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface CategoryAnalysisResponse {
  /** 카테고리 코드 */
  category: "USED_TRADE" | "WORK" | "PURCHASE" | "CONTRACT" | "DATING" | "ETC";
  /** 카테고리별 호구 지수 */
  hoguIndex: number;
  /** 카테고리별 호구 레벨 코드 */
  hoguLevel: "SAFE" | "CAUTIOUS" | "WARNING" | "RISKY" | "CRITICAL" | "NONE";
}
