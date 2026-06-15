import fs from "node:fs/promises";
import path from "node:path";

const HTTP_METHODS = ["get", "post", "put", "patch", "delete"];
const HEADER_LINES = [
  "/**",
  " * @description",
  " * Auto-generated API parameters from backend OpenAPI paths.",
  " * Do not edit manually.",
  " */",
];

function toPascalCase(value) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

function schemaNameFromRef(ref) {
  return ref.split("/").at(-1);
}

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

function createPropertyComment(description) {
  return description ? `  /** ${description} */\n` : "";
}

function getParameterGroups(spec) {
  const groups = [];

  for (const pathItem of Object.values(spec.paths ?? {})) {
    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (!operation?.operationId) {
        continue;
      }

      for (const location of ["query", "path"]) {
        const parameters = (operation.parameters ?? []).filter((parameter) => parameter.in === location);
        if (parameters.length === 0) {
          continue;
        }

        groups.push({
          fileName: `${toKebabCase(operation.operationId)}-${location}`,
          interfaceName: `${toPascalCase(operation.operationId)}${toPascalCase(location)}`,
          parameters,
        });
      }
    }
  }

  return groups.sort((a, b) => a.fileName.localeCompare(b.fileName));
}

function createParamsContent(interfaceName, parameters) {
  const lines = [...HEADER_LINES, `export type ${interfaceName} = {`];

  for (const parameter of parameters) {
    const optional = parameter.required ? "" : "?";
    const nullable = parameter.schema?.nullable ? " | null" : "";
    lines.push(
      `${createPropertyComment(parameter.description)}  ${parameter.name}${optional}: ${toType(parameter.schema)}${nullable};`,
    );
  }

  lines.push("};", "");
  return lines.join("\n");
}

/**
 * OpenAPI paths의 query/path parameter를 사람이 읽기 쉬운 타입 파일로 생성합니다.
 *
 * @description
 * `components.schemas`가 아닌 endpoint parameter는 model DTO로 내려오지 않으므로,
 * operationId 기준의 `*Query`, `*Path` 타입 파일을 별도로 생성합니다.
 *
 * 예:
 * - `getHomePosts`의 query parameter -> `get-home-posts-query.ts`
 * - `getPostDetail`의 path parameter -> `get-post-detail-path.ts`
 *
 * 이 타입은 `apiClient`의 query option이나 feature service 함수 인자에 사용합니다.
 * 생성 전 `paramsDir`를 비워 이전 OpenAPI 문서에만 있던 parameter 파일이 남지 않게 합니다.
 *
 * @param options - parameter 생성 옵션입니다.
 * @param options.specFile - OpenAPI JSON 파일 경로입니다.
 * @param options.paramsDir - 생성할 parameter 파일 디렉터리입니다.
 */
export async function generateApiParams({ specFile, paramsDir }) {
  const spec = JSON.parse(await fs.readFile(specFile, "utf8"));
  const groups = getParameterGroups(spec);

  await fs.rm(paramsDir, { recursive: true, force: true });
  await fs.mkdir(paramsDir, { recursive: true });

  const exports = [];

  for (const group of groups) {
    await fs.writeFile(
      path.join(paramsDir, `${group.fileName}.ts`),
      createParamsContent(group.interfaceName, group.parameters),
    );
    exports.push(`export type * from "./${group.fileName}";`);
  }

  await fs.writeFile(path.join(paramsDir, "index.ts"), `${exports.join("\n")}\n`);

  return {
    count: groups.length,
    dir: paramsDir,
  };
}
