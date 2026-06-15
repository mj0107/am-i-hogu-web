const HTTP_METHODS = ["get", "post", "put", "patch", "delete"];
const MODEL_IMPORT_EXCLUDED_TYPES = new Set(["FormData", "unknown"]);

// OpenAPI 문서를 기준으로 feature api 폴더에 service/action/query 파일을 생성합니다.
//
// controllerName: 백엔드 OpenAPI 리소스명입니다. 예) user -> /api/users/*
// outputName: 프론트 feature에서 사용할 파일/폴더 이름입니다. 예) user 리소스를 mypage feature에 붙일 때 mypage
//
// service/action은 API 계약을 그대로 옮기는 자동 생성 영역에 가깝고,
// query는 화면의 캐시 정책, enabled 조건, 무한 스크롤, invalidate 범위에 맞게 다듬는 초안입니다.
// query를 직접 수정해서 쓰는 경우 이후 재생성할 때는 --no-query 옵션을 사용하는 편이 안전합니다.
//
// 처리 흐름:
// 1. OpenAPI paths에서 controllerName에 해당하는 endpoint만 모읍니다.
// 2. 각 endpoint의 method, operationId, parameters, requestBody, response schema를 TypeScript 재료로 정리합니다.
// 3. 정리된 operation 목록을 service/action/query/index 파일 문자열로 렌더링합니다.

function toPascalCase(value) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function toResourceSegment(controllerName) {
  if (controllerName.endsWith("s")) {
    return controllerName;
  }
  if (controllerName.endsWith("y")) {
    return `${controllerName.slice(0, -1)}ies`;
  }
  return `${controllerName}s`;
}

function toResourceSegments(controllerName) {
  const segments = new Set([controllerName, toResourceSegment(controllerName)]);
  if (controllerName.endsWith("y")) {
    segments.add(`${controllerName.slice(0, -1)}ies`);
  }
  return [...segments];
}

function toQueryHookName(operationId) {
  return `use${toPascalCase(operationId)}Query`;
}

function toMutationHookName(operationId) {
  return `use${toPascalCase(operationId)}Mutation`;
}

function toTypeName(operationId, suffix) {
  return `${toPascalCase(operationId)}${suffix}`;
}

function schemaNameFromRef(ref) {
  return ref.split("/").at(-1);
}

function schemaToType(schema) {
  // OpenAPI schema 조각을 생성 파일에서 바로 쓸 TypeScript 타입 문자열로 바꿉니다.
  // 복잡한 DTO object는 api-sync가 만든 models 파일을 참조하도록 $ref 이름만 꺼냅니다.
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
    const itemType = schemaToType(schema.items);
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

function getJsonSchema(content) {
  return content?.["application/json"]?.schema;
}

function getRequestBodyType(requestBody) {
  // JSON body는 DTO 모델 타입으로, multipart/form-data는 브라우저 FormData로 받습니다.
  if (!requestBody?.content) {
    return "unknown";
  }

  if (requestBody.content["multipart/form-data"]) {
    return "FormData";
  }

  return schemaToType(getJsonSchema(requestBody.content));
}

function getSuccessStatus(responses = {}) {
  return Object.keys(responses).find((status) => status.startsWith("2")) ?? "200";
}

function hasRequestBody(operation) {
  return Boolean(operation.requestBody?.content);
}

function hasQueryParameters(operation) {
  return operation.parameters?.some((parameter) => parameter.in === "query") ?? false;
}

function hasRequiredQueryParameters(operation) {
  return operation.parameters?.some((parameter) => parameter.in === "query" && parameter.required) ?? false;
}

function hasPathParameters(operation) {
  return operation.parameters?.some((parameter) => parameter.in === "path") ?? false;
}

function getParameters(operation, parameterIn) {
  return (operation.parameters ?? []).filter((parameter) => parameter.in === parameterIn);
}

function pathToTemplate(pathname) {
  // /api/posts/{postId} 같은 OpenAPI path를 apiClient에서 사용할 template literal로 바꿉니다.
  if (!pathname.includes("{")) {
    return `"${pathname}"`;
  }

  const template = pathname.replaceAll(/\{([^}]+)\}/g, (_, name) => `\${params.${name}}`);
  return `\`${template}\``;
}

function getOperationsForController(spec, controllerName) {
  // Spring controller/resource 이름과 실제 path가 단수/복수로 섞일 수 있어 후보를 같이 봅니다.
  // 예) user -> /api/user, /api/users / policy -> /api/policy, /api/policies
  const prefixes = toResourceSegments(controllerName).map((resourceSegment) => `/api/${resourceSegment}`);
  const operations = [];

  for (const [pathname, pathItem] of Object.entries(spec.paths ?? {})) {
    if (!prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
      continue;
    }

    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (!operation?.operationId) {
        continue;
      }

      operations.push({
        method,
        operation,
        operationId: operation.operationId,
        pathname,
        hasBody: hasRequestBody(operation),
        hasPath: hasPathParameters(operation),
        hasQuery: hasQueryParameters(operation),
        hasRequiredQuery: hasRequiredQueryParameters(operation),
        successStatus: getSuccessStatus(operation.responses),
        bodyType: getRequestBodyType(operation.requestBody),
        pathParameters: getParameters(operation, "path"),
        queryParameters: getParameters(operation, "query"),
        responseType: schemaToType(
          getJsonSchema(operation.responses?.[getSuccessStatus(operation.responses)]?.content),
        ),
      });
    }
  }

  return operations.sort((a, b) => a.operationId.localeCompare(b.operationId));
}

function renderServiceFunction(item) {
  // operation 하나를 apiClient 호출 함수 하나로 렌더링합니다.
  // query/path/body 존재 여부에 따라 함수 파라미터와 apiClient options가 달라집니다.
  const queryType = toTypeName(item.operationId, "QueryParams");
  const pathType = toTypeName(item.operationId, "PathParams");
  const bodyType = toTypeName(item.operationId, "Body");
  const responseType = toTypeName(item.operationId, "Response");
  const params = [];

  if (item.hasPath) {
    params.push(`params: ${pathType}`);
  }

  if (item.hasQuery) {
    const queryDefault = item.hasRequiredQuery ? "" : " = {}";
    if (item.hasPath) {
      params.push(`query: ${queryType}${queryDefault}`);
    } else {
      params.push(`params: ${queryType}${queryDefault}`);
    }
  }

  if (item.hasBody) {
    params.push(`body: ${bodyType}`);
  }

  const options = [`method: "${item.method.toUpperCase()}"`];
  if (item.hasQuery) {
    options.push(item.hasPath ? "query" : "query: params");
  }
  if (item.hasBody) {
    options.push("body");
  }

  return `export async function ${item.operationId}(${params.join(", ")}) {
  return apiClient<${responseType}>(${pathToTemplate(item.pathname)}, {
    ${options.join(",\n    ")},
  });
}`;
}

function renderService(operations) {
  // service는 apiClient를 직접 호출하는 가장 얇은 레이어입니다.
  // OpenAPI에서 추출한 request body, response, query/path parameter 타입을 여기서 한 번 alias로 정리합니다.
  const localTypeNames = new Set(
    operations.flatMap((item) => {
      const names = [`${toTypeName(item.operationId, "Response")}`];
      if (item.hasBody) {
        names.push(toTypeName(item.operationId, "Body"));
      }
      return names;
    }),
  );
  const modelTypeNames = [
    ...new Set(
      operations
        .flatMap((item) => [item.bodyType, item.responseType])
        .filter((typeName) => typeName && /^[A-Z]/.test(typeName) && !MODEL_IMPORT_EXCLUDED_TYPES.has(typeName)),
    ),
  ].sort((a, b) => a.localeCompare(b));
  const modelTypeAliases = new Map(
    modelTypeNames.map((typeName) => [typeName, localTypeNames.has(typeName) ? `${typeName}Model` : typeName]),
  );
  const paramImports = [
    ...new Set(
      operations.flatMap((item) => {
        const imports = [];
        if (item.hasPath) {
          imports.push(toTypeName(item.operationId, "Path"));
        }
        if (item.hasQuery) {
          imports.push(toTypeName(item.operationId, "Query"));
        }
        return imports;
      }),
    ),
  ].sort((a, b) => a.localeCompare(b));

  const typeExports = operations.flatMap((item) => {
    const responseType = modelTypeAliases.get(item.responseType) ?? item.responseType;
    const bodyType = modelTypeAliases.get(item.bodyType) ?? item.bodyType;
    const entries = [`export type ${toTypeName(item.operationId, "Response")} = ${responseType};`];
    if (item.hasQuery) {
      entries.unshift(
        `export type ${toTypeName(item.operationId, "QueryParams")} = ${toTypeName(item.operationId, "Query")};`,
      );
    }
    if (item.hasPath) {
      entries.unshift(
        `export type ${toTypeName(item.operationId, "PathParams")} = ${toTypeName(item.operationId, "Path")};`,
      );
    }
    if (item.hasBody) {
      entries.unshift(`export type ${toTypeName(item.operationId, "Body")} = ${bodyType};`);
    }
    return entries;
  });

  const modelImports = modelTypeNames.map((typeName) => {
    const alias = modelTypeAliases.get(typeName);
    return alias === typeName ? typeName : `${typeName} as ${alias}`;
  });

  const modelsImport = modelImports.length
    ? `import type {
  ${modelImports.join(",\n  ")},
} from "@/shared/api/generated";
`
    : "";
  const paramsImport = paramImports.length
    ? `import type {
  ${paramImports.join(",\n  ")},
} from "@/shared/api/generated";
`
    : "";

  return `${modelsImport}${paramsImport}import { apiClient } from "@/shared/api";

${typeExports.join("\n")}

${operations.map(renderServiceFunction).join("\n\n")}
`;
}

function renderActionFunction(item) {
  // service 함수 하나를 서버 액션 하나로 감쌉니다.
  // 화면에서는 throw 대신 ApiResult 형태로 성공/실패를 다루게 됩니다.
  const responseType = toTypeName(item.operationId, "Response");
  const pathType = toTypeName(item.operationId, "PathParams");
  const queryType = toTypeName(item.operationId, "QueryParams");
  const bodyType = toTypeName(item.operationId, "Body");
  const params = [];
  const callArgs = [];

  if (item.hasPath) {
    params.push(`params: ${pathType}`);
    callArgs.push("params");
  }

  if (item.hasQuery) {
    const queryDefault = item.hasRequiredQuery ? "" : " = {}";
    if (item.hasPath) {
      params.push(`query: ${queryType}${queryDefault}`);
      callArgs.push("query");
    } else {
      params.push(`params: ${queryType}${queryDefault}`);
      callArgs.push("params");
    }
  }

  if (item.hasBody) {
    params.push(`body: ${bodyType}`);
    callArgs.push("body");
  }

  return `export async function ${item.operationId}Action(${params.join(", ")}): Promise<ApiResult<${responseType}>> {
  try {
    return apiSuccess(await ${item.operationId}(${callArgs.join(", ")}));
  } catch (error) {
    return apiFailure(error);
  }
}`;
}

function renderAction(outputName, operations) {
  // action은 service 결과를 ApiResult로 감싸는 서버 액션 레이어입니다.
  // 파일명은 outputName을 따르므로 user API를 mypage feature에 붙여도 ./mypage.service를 참조합니다.
  const serviceImports = operations.flatMap((item) => {
    const imports = [item.operationId, `type ${toTypeName(item.operationId, "Response")}`];
    if (item.hasQuery) {
      imports.push(`type ${toTypeName(item.operationId, "QueryParams")}`);
    }
    if (item.hasPath) {
      imports.push(`type ${toTypeName(item.operationId, "PathParams")}`);
    }
    if (item.hasBody) {
      imports.push(`type ${toTypeName(item.operationId, "Body")}`);
    }
    return imports;
  });

  return `"use server";

import { type ApiResult, apiFailure, apiSuccess } from "@/shared/api";
import {
  ${serviceImports.join(",\n  ")},
} from "./${outputName}.service";

${operations.map(renderActionFunction).join("\n\n")}
`;
}

function renderQueryHook(item, outputName) {
  // GET은 useQuery, 나머지 method는 useMutation 초안으로 만듭니다.
  // 여기서 만든 훅은 기본형이므로 화면 요구사항에 맞춰 수동 수정해도 됩니다.
  const actionName = `${item.operationId}Action`;
  if (item.method === "get") {
    const params = [];
    const callArgs = [];
    const pathType = toTypeName(item.operationId, "PathParams");
    const queryType = toTypeName(item.operationId, "QueryParams");

    if (item.hasPath) {
      params.push(`params: ${pathType}`);
      callArgs.push("params");
    }
    if (item.hasQuery) {
      const queryDefault = item.hasRequiredQuery ? "" : " = {}";
      if (item.hasPath) {
        params.push(`query: ${queryType}${queryDefault}`);
        callArgs.push("query");
      } else {
        params.push(`params: ${queryType}${queryDefault}`);
        callArgs.push("params");
      }
    }

    const signature = params.join(", ");
    const key =
      item.hasPath && item.hasQuery
        ? `${outputName}QueryKeys.list(params, query)`
        : item.hasPath
          ? `${outputName}QueryKeys.detail(Object.values(params).join(":"))`
          : `${outputName}QueryKeys.list(${item.hasQuery ? "params" : "{}"})`;
    const enabled = item.hasPath ? "\n    enabled: Object.values(params).every(Boolean)," : "";

    return `export function ${toQueryHookName(item.operationId)}(${signature}) {
  return useQuery({
    queryKey: ${key},
    queryFn: () => ${actionName}(${callArgs.join(", ")}).then(unwrapApiResult),${enabled}
  });
}`;
  }

  const params = [];
  const callArgs = [];
  if (item.hasPath) {
    params.push(`params: ${toTypeName(item.operationId, "PathParams")}`);
    callArgs.push("params");
  }
  if (item.hasBody) {
    params.push(`body: ${toTypeName(item.operationId, "Body")}`);
    callArgs.push("body");
  }
  const mutationArg =
    params.length > 0 ? `{ ${params.map((param) => param.split(":")[0]).join(", ")} }: { ${params.join("; ")} }` : "";

  return `export function ${toMutationHookName(item.operationId)}() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (${mutationArg}) => ${actionName}(${callArgs.join(", ")}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ${outputName}QueryKeys.all });
    },
  });
}`;
}

function renderQuery({ controllerName, outputName, operations }) {
  // query는 자동 생성 가능한 기본 훅만 만듭니다.
  // 실제 화면에서는 enabled, invalidate, optimistic update, infinite query 등을 손으로 조정할 수 있습니다.
  // query key의 도메인 문자열은 백엔드 리소스(controllerName)를 따르고, 변수/파일명은 feature 이름(outputName)을 따릅니다.
  const actionImports = operations.map((item) => `${item.operationId}Action`);
  const hasQueryHooks = operations.some((item) => item.method === "get");
  const hasMutationHooks = operations.some((item) => item.method !== "get");
  const reactQueryImports = [
    ...(hasMutationHooks ? ["useMutation"] : []),
    ...(hasQueryHooks ? ["useQuery"] : []),
    ...(hasMutationHooks ? ["useQueryClient"] : []),
  ];
  const sharedApiImports = ["createDomainQueryKeys", ...(hasQueryHooks ? ["unwrapApiResult"] : [])];
  const typeImports = operations.flatMap((item) => {
    const imports = [];
    if (item.hasQuery) {
      imports.push(toTypeName(item.operationId, "QueryParams"));
    }
    if (item.hasPath) {
      imports.push(toTypeName(item.operationId, "PathParams"));
    }
    if (item.hasBody) {
      imports.push(toTypeName(item.operationId, "Body"));
    }
    return imports;
  });

  const typeImportBlock = typeImports.length
    ? `import type {
  ${typeImports.join(",\n  ")},
} from "./${outputName}.service";
`
    : "";

  return `"use client";

import { ${reactQueryImports.join(", ")} } from "@tanstack/react-query";
import { ${sharedApiImports.join(", ")} } from "@/shared/api";
import {
  ${actionImports.join(",\n  ")},
} from "./${outputName}.action";
${typeImportBlock}

const ${outputName}QueryKeys = createDomainQueryKeys("${toResourceSegment(controllerName)}");

${operations.map((item) => renderQueryHook(item, outputName)).join("\n\n")}
`;
}

function renderIndex(outputName, includeQuery) {
  const exports = [`export * from "./${outputName}.action";`, `export * from "./${outputName}.service";`];
  if (includeQuery) {
    exports.push(`export * from "./${outputName}.query";`);
  }
  return `${exports.join("\n")}\n`;
}

export function generateControllerFiles({ controllerName, outputName = controllerName, includeQuery = true, spec }) {
  // 이 함수는 테스트하기 쉽도록 파일 시스템을 직접 만지지 않습니다.
  // 실제 파일 쓰기는 index.mjs가 담당하고, 여기서는 { 파일명: 내용 }만 반환합니다.
  const operations = getOperationsForController(spec, controllerName);
  if (operations.length === 0) {
    throw new Error(`No OpenAPI operations found for controller: ${controllerName}`);
  }

  const files = {
    [`${outputName}.service.ts`]: renderService(operations),
    [`${outputName}.action.ts`]: renderAction(outputName, operations),
    "index.ts": renderIndex(outputName, includeQuery),
  };

  if (includeQuery) {
    files[`${outputName}.query.ts`] = renderQuery({ controllerName, outputName, operations });
  }

  return files;
}
