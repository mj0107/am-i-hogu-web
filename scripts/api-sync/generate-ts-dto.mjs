/**
 * Java record 파싱 결과를 프론트에서 import 가능한 TypeScript DTO 파일 내용으로 변환합니다.
 *
 * @description
 * 생성 파일에는 자동 생성 안내와 domain 정보를 함께 남깁니다.
 * record별 필드는 parser가 변환한 TypeScript 타입을 그대로 사용합니다.
 *
 * @param records - TypeScript DTO로 출력할 Java record 파싱 결과 목록입니다.
 * @param options.domain - 생성 파일에 기록할 API domain 이름입니다.
 *
 * @returns DTO type alias들이 포함된 TypeScript 파일 내용입니다.
 */
export function generateTypeScriptDto(records, options = {}) {
  const domain = options.domain ?? "api";
  const lines = [
    "// AUTO-GENERATED from am-i-hogu/api Java records.",
    "// Do not edit manually. Run `pnpm sync:api` instead.",
    `// Domain: ${domain}`,
    "",
  ];

  for (const record of records) {
    lines.push(`export type ${record.tsName} = {`);
    for (const field of record.fields) {
      lines.push(`  ${field.name}: ${field.tsType};`);
    }
    lines.push("};", "");
  }

  return `${lines.join("\n").trimEnd()}\n`;
}
