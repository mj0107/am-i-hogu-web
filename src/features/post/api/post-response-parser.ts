type JsonRecord = Record<string, unknown>;

const BOOLEAN_ALIAS_ENTRIES = [
  // Java primitive boolean record의 `is*` 필드는 Jackson 직렬화 결과에서 `is` 접두사가 빠질 수 있다.
  // 프론트는 OpenAPI generated 타입의 `is*` 이름을 기준으로 사용하므로, 응답 경계에서 한 번만 보정한다.
  ["mine", "isMine"],
  ["bookmarked", "isBookmarked"],
  ["deleted", "isDeleted"],
  ["helpful", "isHelpful"],
  ["postWriter", "isPostWriter"],
] as const;

function isJsonRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeBooleanAliases(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalizeBooleanAliases);
  }

  if (!isJsonRecord(value)) {
    return value;
  }

  const normalized = Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, normalizeBooleanAliases(child)]),
  );

  for (const [aliasKey, generatedKey] of BOOLEAN_ALIAS_ENTRIES) {
    if (typeof normalized[generatedKey] === "undefined" && typeof normalized[aliasKey] === "boolean") {
      normalized[generatedKey] = normalized[aliasKey];
    }
  }

  return normalized;
}

/**
 * 큰 게시글/댓글 ID는 JSON number로 파싱되는 순간 정밀도가 깨질 수 있어 raw JSON에서 문자열로 보존한다.
 * Java boolean record의 `is*` 필드는 런타임 JSON에서 `mine`처럼 내려올 수 있어 generated 타입 이름으로 보정한다.
 *
 * TODO: 백엔드 OpenAPI 스키마에서 ID/boolean 필드가 실제 응답과 동일하게 내려오면 해당 parser를 제거한다.
 */
export function parsePostIdJsonResponse<T>(text: string): T {
  const safeIdJson = text.replace(/"(postId|commentId|parentId)"\s*:\s*(\d{16,})/g, '"$1":"$2"');

  return normalizeBooleanAliases(JSON.parse(safeIdJson)) as T;
}
