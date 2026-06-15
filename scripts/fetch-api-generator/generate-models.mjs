import fs from "node:fs/promises";
import path from "node:path";

const HEADER_LINES = [
  "/**",
  " * @description",
  " * Auto-generated DTO from backend OpenAPI schema.",
  " * Do not edit manually.",
  " */",
];

/**
 * PascalCase schema 이름을 kebab-case 파일명으로 변환합니다.
 *
 * @param value - OpenAPI components.schemas에 정의된 schema 이름입니다.
 * @returns kebab-case 파일 이름입니다.
 */
function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

/**
 * OpenAPI 문서에서 schema 이름 목록을 추출합니다.
 *
 * @param specFile - 정규화된 OpenAPI JSON 파일 경로입니다.
 * @returns components.schemas의 schema 이름 목록입니다.
 */
async function readSchemaNames(specFile) {
  const spec = JSON.parse(await fs.readFile(specFile, "utf8"));
  return Object.keys(spec.components?.schemas ?? {}).sort((a, b) => a.localeCompare(b));
}

/**
 * OpenAPI `$ref` 값에서 schema 이름을 추출합니다.
 *
 * @param ref - `#/components/schemas/PostImageRequest` 형태의 참조값입니다.
 * @returns schema 이름입니다.
 */
function schemaNameFromRef(ref) {
  return ref.split("/").at(-1);
}

/**
 * TypeScript property 주석을 생성합니다.
 *
 * @param description - OpenAPI property description입니다.
 * @returns 한 줄 JSDoc 또는 빈 문자열입니다.
 */
function createPropertyComment(description) {
  return description ? `  /** ${description} */\n` : "";
}

/**
 * OpenAPI schema property를 TypeScript 타입 문자열로 변환합니다.
 *
 * @param schema - OpenAPI property schema입니다.
 * @returns TypeScript 타입 문자열입니다.
 */
function toType(schema) {
  if (!schema || typeof schema !== "object") {
    return "unknown";
  }

  if (schema.$ref) {
    return schemaNameFromRef(schema.$ref);
  }

  if (Array.isArray(schema.enum)) {
    return schema.enum.map((value) => JSON.stringify(value)).join(" | ");
  }

  if (schema.type === "array") {
    const itemType = toType(schema.items);
    return itemType.includes(" | ") ? `(${itemType})[]` : `${itemType}[]`;
  }

  if (schema.type === "integer" || schema.type === "number") {
    return "number";
  }

  if (schema.type === "boolean") {
    return "boolean";
  }

  if (schema.type === "string") {
    return "string";
  }

  if (schema.type === "object") {
    return "Record<string, unknown>";
  }

  return "unknown";
}

/**
 * property schema 안에서 참조된 다른 DTO schema 이름을 수집합니다.
 *
 * @param schema - OpenAPI property schema입니다.
 * @param refs - 수집 대상 Set입니다.
 */
function collectRefs(schema, refs) {
  if (!schema || typeof schema !== "object") {
    return;
  }

  if (schema.$ref) {
    refs.add(schemaNameFromRef(schema.$ref));
  }

  collectRefs(schema.items, refs);
}

/**
 * OpenAPI schema 하나를 TypeScript model 파일 내용으로 변환합니다.
 *
 * @param schemaName - DTO interface 이름입니다.
 * @param schema - OpenAPI schema object입니다.
 * @returns model 파일 내용입니다.
 */
function createModelContent(schemaName, schema) {
  const required = new Set(schema.required ?? []);
  const properties = schema.properties ?? {};
  const refs = new Set();

  for (const propertySchema of Object.values(properties)) {
    collectRefs(propertySchema, refs);
  }

  refs.delete(schemaName);

  const imports = [...refs]
    .sort((a, b) => a.localeCompare(b))
    .map((refName) => `import type { ${refName} } from "./${toKebabCase(refName)}";`);

  const lines = [...imports];

  if (lines.length > 0) {
    lines.push("");
  }

  lines.push(...HEADER_LINES, `export interface ${schemaName} {`);

  for (const [propertyName, propertySchema] of Object.entries(properties)) {
    const optional = required.has(propertyName) ? "" : "?";
    const nullable = propertySchema.nullable ? " | null" : "";

    lines.push(
      `${createPropertyComment(propertySchema.description)}  ${propertyName}${optional}: ${toType(propertySchema)}${nullable};`,
    );
  }

  lines.push("}", "");
  return lines.join("\n");
}

/**
 * OpenAPI components.schemas를 기준으로 사람이 읽기 쉬운 DTO model 파일을 생성합니다.
 *
 * @description
 * schema 이름별 interface 파일을 만들어 활용성을 높입니다.
 *
 * OpenAPI에서 `components.schemas`는 request/response body DTO가 모이는 영역입니다.
 * 예를 들어 `PostCreateRequest`, `HomePostListResponse` 같은 타입이 여기서 생성됩니다.
 * query/path parameter는 이 파일에서 만들지 않고 `generate-params.mjs`에서 따로 생성합니다.
 *
 * 생성 전 `modelsDir`를 비워 이전 OpenAPI 문서에만 있던 DTO 파일이 남지 않게 합니다.
 *
 * @param options - model 생성 옵션입니다.
 * @param options.specFile - OpenAPI JSON 파일 경로입니다.
 * @param options.modelsDir - 생성할 model 파일 디렉터리입니다.
 */
export async function generateDtoModels({ specFile, modelsDir }) {
  const spec = JSON.parse(await fs.readFile(specFile, "utf8"));
  const schemas = spec.components?.schemas ?? {};
  const schemaNames = await readSchemaNames(specFile);

  await fs.rm(modelsDir, { recursive: true, force: true });
  await fs.mkdir(modelsDir, { recursive: true });

  const exports = [];

  for (const schemaName of schemaNames) {
    const fileName = toKebabCase(schemaName);
    const filePath = path.join(modelsDir, `${fileName}.ts`);

    await fs.writeFile(filePath, createModelContent(schemaName, schemas[schemaName]));
    exports.push(`export type * from "./${fileName}";`);
  }

  await fs.writeFile(path.join(modelsDir, "index.ts"), `${exports.join("\n")}\n`);

  return {
    count: schemaNames.length,
    dir: modelsDir,
  };
}
