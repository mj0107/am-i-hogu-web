const METHOD_BY_ANNOTATION = {
  GetMapping: "GET",
  PostMapping: "POST",
  PutMapping: "PUT",
  PatchMapping: "PATCH",
  DeleteMapping: "DELETE",
};

/**
 * Spring annotation에서 첫 번째 path 문자열을 추출합니다.
 *
 * @description
 * `@RequestMapping("/api/posts")`, `@GetMapping("/{postId}")`처럼 현재 API repo의 controller 패턴에 맞춰
 * annotation 인자 중 첫 번째 문자열 literal을 path로 사용합니다.
 *
 * @param source - annotation을 포함한 Java source 문자열입니다.
 * @param annotationName - path를 추출할 annotation 이름입니다.
 *
 * @returns annotation path 문자열입니다. 없으면 빈 문자열입니다.
 */
function extractAnnotationPath(source, annotationName) {
  const pattern = new RegExp(`@${annotationName}\\s*(?:\\(([^)]*)\\))?`);
  const match = source.match(pattern);
  if (!match) return "";
  const args = match[1] ?? "";
  const pathMatch = args.match(/"([^"]*)"/);
  return pathMatch?.[1] ?? "";
}

/**
 * controller prefix와 endpoint path를 API path로 합칩니다.
 *
 * @param prefix - class level `@RequestMapping` path입니다.
 * @param endpoint - method level mapping path입니다.
 *
 * @returns 중복 slash를 정리한 API path입니다.
 */
function joinPaths(prefix, endpoint) {
  const left = prefix ? `/${prefix}`.replace(/\/+/g, "/").replace(/\/$/, "") : "";
  const right = endpoint ? `/${endpoint}`.replace(/\/+/g, "/") : "";
  return `${left}${right}` || "/";
}

/**
 * controller method parameter에서 요청 DTO 타입을 추출합니다.
 *
 * @description
 * request body와 query/form DTO를 모두 잡기 위해 `@RequestBody`, `@ModelAttribute`를 확인합니다.
 *
 * @param params - controller method parameter 문자열입니다.
 *
 * @returns 요청 DTO Java 타입 이름입니다. 없으면 `null`입니다.
 */
function extractRequestType(params) {
  const requestBodyMatch = params.match(/@RequestBody(?:\([^)]*\))?\s*([A-Za-z_$][\w$<>]*)\s+[A-Za-z_$][\w$]*/);
  if (requestBodyMatch) return requestBodyMatch[1];

  const modelAttributeMatch = params.match(/@ModelAttribute(?:\([^)]*\))?\s*([A-Za-z_$][\w$<>]*)\s+[A-Za-z_$][\w$]*/);
  return modelAttributeMatch?.[1] ?? null;
}

/**
 * controller method return type에서 응답 DTO 타입을 추출합니다.
 *
 * @description
 * `ResponseEntity<T>`는 내부 DTO 타입을 사용하고, `void`는 응답 DTO가 없는 endpoint로 처리합니다.
 *
 * @param returnType - controller method return type 문자열입니다.
 *
 * @returns 응답 DTO Java 타입 이름입니다. 없으면 `null`입니다.
 */
function extractResponseType(returnType) {
  const responseEntityMatch = returnType.match(/ResponseEntity<\s*([A-Za-z_$][\w$<>]*)\s*>/);
  if (responseEntityMatch) return responseEntityMatch[1];
  return returnType === "void" ? null : returnType;
}

/**
 * Spring controller 파일에서 endpoint와 연결된 요청/응답 DTO 타입을 파싱합니다.
 *
 * @description
 * `@RequestMapping` prefix와 각 HTTP mapping annotation을 읽어 실제 API에 걸린 DTO를 찾습니다.
 * 복잡한 overload보다 현재 API repo의 Controller 패턴에 맞춘 얇은 parser입니다.
 *
 * @param file - `{ path, source }` 형태의 Java controller 파일입니다.
 *
 * @returns endpoint method/path/request/response DTO 정보 목록입니다.
 */
export function parseSpringController(file) {
  const classMatch = file.source.match(/public\s+class\s+([A-Za-z_$][\w$]*)/);
  const controller = classMatch?.[1] ?? "UnknownController";
  const prefix = extractAnnotationPath(file.source, "RequestMapping");
  const endpoints = [];
  const endpointPattern =
    /@(GetMapping|PostMapping|PutMapping|PatchMapping|DeleteMapping)\s*(?:\(([^)]*)\))?\s+public\s+([A-Za-z_$][\w$<>]*)\s+([A-Za-z_$][\w$]*)\s*\(([\s\S]*?)\)\s*\{/g;

  let match = endpointPattern.exec(file.source);
  while (match !== null) {
    const annotation = match[1];
    const annotationArgs = match[2] ?? "";
    const endpointPath = annotationArgs.match(/"([^"]*)"/)?.[1] ?? "";
    const returnType = match[3];
    const handler = match[4];
    const params = match[5].replace(/\s+/g, " ");

    endpoints.push({
      controller,
      handler,
      method: METHOD_BY_ANNOTATION[annotation],
      path: joinPaths(prefix, endpointPath),
      responseType: extractResponseType(returnType),
      requestType: extractRequestType(params),
      sourcePath: file.path,
    });
    match = endpointPattern.exec(file.source);
  }

  return endpoints;
}
