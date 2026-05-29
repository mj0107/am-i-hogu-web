import { javaTypeToTsType, toDtoTypeName } from "./java-type-map.mjs";

/**
 * Java source에서 block/line comment를 제거합니다.
 *
 * @description
 * record 선언을 정규식으로 얇게 읽기 전에 주석 안의 괄호나 쉼표가 parser에 섞이지 않도록 정리합니다.
 *
 * @param source - Java source 문자열입니다.
 *
 * @returns 주석을 제거한 Java source 문자열입니다.
 */
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

/**
 * Java record body의 field 선언을 쉼표 기준으로 나눕니다.
 *
 * @description
 * `List<PostItemResponse>`처럼 generic 내부에 쉼표가 들어갈 수 있으므로 angle bracket depth를 추적합니다.
 *
 * @param rawBody - record 괄호 안의 원본 field 선언 문자열입니다.
 *
 * @returns 개별 field 선언 문자열 목록입니다.
 */
function splitRecordFields(rawBody) {
  const fields = [];
  let current = "";
  let depth = 0;

  for (const character of rawBody) {
    if (character === "<") depth += 1;
    if (character === ">") depth -= 1;
    if (character === "," && depth === 0) {
      if (current.trim()) fields.push(current.trim());
      current = "";
      continue;
    }
    current += character;
  }

  if (current.trim()) fields.push(current.trim());
  return fields;
}

/**
 * Java record field 하나를 TypeScript DTO field 정보로 변환합니다.
 *
 * @description
 * field annotation을 제거한 뒤 Java 타입과 field 이름을 분리합니다.
 * `@JsonInclude(NON_NULL)`은 응답에서 빠질 수 있는 값이라 TypeScript 타입에 `null`을 붙입니다.
 *
 * @param rawField - Java record field 원본 선언 문자열입니다.
 *
 * @returns DTO 생성에 사용할 field 이름, Java 타입, TypeScript 타입입니다.
 */
function parseRecordField(rawField) {
  const isNullable = /@JsonInclude\s*\(\s*JsonInclude\.Include\.NON_NULL\s*\)/.test(rawField);
  const normalized = rawField
    .replace(/@\w+(?:\([^)]*(?:\)[^)]*)?\))?/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const match = normalized.match(/^(.+)\s+([A-Za-z_$][\w$]*)$/);
  if (!match) {
    throw new Error(`Unable to parse Java record field: ${rawField}`);
  }

  const javaType = match[1].trim();
  const tsType = javaTypeToTsType(javaType);
  return {
    name: match[2],
    javaType,
    tsType: isNullable && !tsType.includes("null") ? `${tsType} | null` : tsType,
  };
}

/**
 * Java 파일 목록에서 public record DTO 선언을 파싱합니다.
 *
 * @description
 * Spring 서버 DTO가 `public record` 중심이라 class 전체 AST 대신 record 선언만 가볍게 읽습니다.
 * 예: `public record PostDetailResponse(Long postId, List<String> categories) {}`
 *
 * @param files - `{ path, source }` 형태의 Java 파일 목록입니다.
 *
 * @returns TypeScript DTO 생성에 사용할 record 목록입니다.
 */
export function parseJavaRecords(files) {
  const records = [];

  for (const file of files) {
    const source = stripComments(file.source);
    const recordPattern = /public\s+record\s+([A-Za-z_$][\w$]*)\s*\(([\s\S]*?)\)\s*\{/g;
    let match = recordPattern.exec(source);

    while (match !== null) {
      const name = match[1];
      const rawFields = match[2].trim();
      records.push({
        name,
        tsName: toDtoTypeName(name),
        sourcePath: file.path,
        fields: rawFields ? splitRecordFields(rawFields).map(parseRecordField) : [],
      });
      match = recordPattern.exec(source);
    }
  }

  return records.sort((left, right) => left.name.localeCompare(right.name));
}
