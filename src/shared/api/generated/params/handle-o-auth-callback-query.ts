/**
 * @description
 * Auto-generated API parameters from backend OpenAPI paths.
 * Do not edit manually.
 */
export type HandleOAuthCallbackQuery = {
  /** Authorization server로부터 발급 받은 일회용 인가 코드 */
  code: string;
  /** CSRF 공격 방어를 위한 무작위 난수 */
  state: string;
};
