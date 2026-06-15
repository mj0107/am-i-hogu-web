/**
 * @description
 * Auto-generated DTO from backend OpenAPI schema.
 * Do not edit manually.
 */
export interface CommentCreateRequest {
  /** 부모 집단지성 ID. 최상위 집단지성인 경우 null */
  parentId: number | null;
  /** 집단지성 내용. 공백만 허용되지 않으며 최대 300자까지 입력할 수 있다. */
  content: string;
}
