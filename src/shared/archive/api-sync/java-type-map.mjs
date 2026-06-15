const PRIMITIVE_TYPE_MAP = new Map([
  ["long", "number"],
  ["int", "number"],
  ["double", "number"],
  ["float", "number"],
  ["boolean", "boolean"],
  ["String", "string"],
  ["LocalDate", "string"],
  ["LocalDateTime", "string"],
  ["OffsetDateTime", "string"],
  ["ZonedDateTime", "string"],
  ["Instant", "string"],
]);

const WRAPPER_TYPE_MAP = new Map([
  ["Long", "number | null"],
  ["Integer", "number | null"],
  ["Double", "number | null"],
  ["Float", "number | null"],
  ["Boolean", "boolean | null"],
]);

function withNull(tsType) {
  return tsType.includes("null") ? tsType : `${tsType} | null`;
}

/**
 * Java DTO record 이름을 프론트 DTO 타입 이름으로 변환합니다.
 *
 * @description
 * 서버 record 이름은 프론트에서 DTO임을 명확히 보이도록 `Dto` suffix를 붙입니다.
 * 이미 `Dto`로 끝나는 이름은 중복 suffix를 붙이지 않습니다.
 *
 * @param javaType - Java record 또는 reference 타입 이름입니다.
 *
 * @returns 프론트에서 사용할 DTO 타입 이름입니다.
 */
export function toDtoTypeName(javaType) {
  const cleanType = javaType.trim();
  return cleanType.endsWith("Dto") ? cleanType : `${cleanType}Dto`;
}

/**
 * Java 필드 타입을 TypeScript 필드 타입으로 변환합니다.
 *
 * @description
 * primitive/date 타입은 프론트 primitive로 변환하고, Java wrapper 타입은 nullable로 변환합니다.
 * collection 타입은 배열로 변환합니다.
 * `JsonNullable<T>`는 API 응답에서 값이 없을 수 있으므로 `T | null`로 취급합니다.
 * 그 외 reference 타입은 DTO type alias 이름으로 변환합니다.
 *
 * @param javaType - Java record field에 선언된 타입 문자열입니다.
 *
 * @returns TypeScript field 타입 문자열입니다.
 */
export function javaTypeToTsType(javaType) {
  const cleanType = javaType.trim();
  const listMatch = cleanType.match(/^(?:List|ArrayList|Set)<(.+)>$/);
  if (listMatch) {
    const itemType = javaTypeToTsType(listMatch[1]);
    return itemType.includes("|") ? `(${itemType})[]` : `${itemType}[]`;
  }

  const nullableMatch = cleanType.match(/^JsonNullable<(.+)>$/);
  if (nullableMatch) {
    return withNull(javaTypeToTsType(nullableMatch[1]));
  }

  if (PRIMITIVE_TYPE_MAP.has(cleanType)) {
    return PRIMITIVE_TYPE_MAP.get(cleanType);
  }

  if (WRAPPER_TYPE_MAP.has(cleanType)) {
    return WRAPPER_TYPE_MAP.get(cleanType);
  }

  return toDtoTypeName(cleanType);
}

/**
 * TypeScript 타입에 맞는 단순 mock literal을 반환합니다.
 *
 * @description
 * DTO 생성기에서 파생 mock skeleton을 만들 때 사용할 수 있는 최소값 매핑입니다.
 * 현재 목데이터는 사람이 관리하므로, 값 생성이 어려운 DTO reference 타입은 `null`을 반환합니다.
 *
 * @param tsType - TypeScript field 타입 문자열입니다.
 * @param fieldName - mock 값을 만들 field 이름입니다.
 *
 * @returns mock literal 문자열 또는 자동 생성 불가를 뜻하는 `null`입니다.
 */
export function mockValueForTsType(tsType, fieldName) {
  if (tsType.endsWith("[]")) {
    return "[]";
  }
  if (tsType === "number") {
    return /id$/i.test(fieldName) ? "1" : "0";
  }
  if (tsType === "boolean") {
    return "false";
  }
  if (tsType === "string") {
    if (/At$|Date$|Time$/i.test(fieldName)) {
      return '"2026-05-22T00:00:00"';
    }
    return '""';
  }
  if (tsType.includes(" | null")) {
    return "null";
  }
  return null;
}
