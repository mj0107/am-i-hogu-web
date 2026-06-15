import path from "node:path";

const DEFAULT_SPEC_PATH = "scripts/fetch-api-generator/openapi.json";
const DEFAULT_MODELS_DIR = "src/shared/api/generated/models";
const DEFAULT_PARAMS_DIR = "src/shared/api/generated/params";
const OPENAPI_DOCS_PATH = "/v3/api-docs";

/**
 * 비어 있는 환경변수 값을 `null`로 정리합니다.
 *
 * @description
 * `.env`에 키만 있고 값이 비어 있는 경우를 실제 설정값으로 취급하지 않기 위해 사용합니다.
 *
 * @param env - 환경변수 객체입니다. 기본 실행에서는 `process.env`를 넘깁니다.
 * @param key - 읽을 환경변수 이름입니다.
 * @returns 값이 있으면 trim된 문자열, 없으면 `null`입니다.
 */
function optionalEnv(env, key) {
  const value = env[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

/**
 * 백엔드 base URL 뒤에 SpringDoc 기본 문서 경로를 붙입니다.
 *
 * @description
 * `https://api.example.com`과 `https://api.example.com/` 모두
 * `https://api.example.com/v3/api-docs`로 맞춰 trailing slash 차이를 없앱니다.
 *
 * @param baseUrl - 백엔드 API base URL입니다.
 * @returns OpenAPI JSON 문서 URL입니다.
 */
function appendDocsPath(baseUrl) {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const specUrl = `${normalizedBaseUrl}${OPENAPI_DOCS_PATH}`;

  new URL(specUrl);
  return specUrl;
}

/**
 * OpenAPI 원본 문서 위치를 환경변수 우선순위에 따라 결정합니다.
 *
 * @description
 * 기본 경로는 백엔드 서버의 SpringDoc 엔드포인트인 `/v3/api-docs`입니다.
 * AWS 서버가 닫혀 있으면 백엔드를 로컬에서 실행하고 `API_BASE_URL={로컬 백엔드 주소}`처럼 지정합니다.
 * 백엔드가 OpenAPI JSON 파일을 별도로 제공한 경우에만 `API_OPENAPI_SPEC_FILE`을 사용합니다.
 *
 * 우선순위:
 * 1. `API_OPENAPI_SPEC_FILE` - 별도로 제공받은 로컬 OpenAPI JSON 파일
 * 2. `API_OPENAPI_SPEC_URL` - `/v3/api-docs`가 아닌 완성된 원격 OpenAPI JSON URL
 * 3. `API_BASE_URL`, `NEXT_PUBLIC_API_BASE_URL`, `BACKEND_URL`, `NEXT_PUBLIC_BACKEND_URL` + `/v3/api-docs` - 기본 경로
 *
 * 일반적인 팀원 세팅에서는 `.env`에 `API_BASE_URL={api 주소}`만 넣으면 됩니다.
 * 이 값은 공개되면 안 되는 환경별 주소일 수 있으므로 문서나 커밋에 실제 값을 남기지 않습니다.
 *
 * @param env - 환경변수 객체입니다.
 * @returns 원격 URL 또는 로컬 파일 절대 경로입니다.
 */
function resolveInputSpec(env) {
  const explicitSpecFile = optionalEnv(env, "API_OPENAPI_SPEC_FILE");
  if (explicitSpecFile) {
    return resolveFromCwd(explicitSpecFile);
  }

  const explicitSpecUrl = optionalEnv(env, "API_OPENAPI_SPEC_URL");
  if (explicitSpecUrl) {
    new URL(explicitSpecUrl);
    return explicitSpecUrl;
  }

  const baseUrl =
    optionalEnv(env, "API_BASE_URL") ??
    optionalEnv(env, "NEXT_PUBLIC_API_BASE_URL") ??
    optionalEnv(env, "BACKEND_URL") ??
    optionalEnv(env, "NEXT_PUBLIC_BACKEND_URL");

  if (!baseUrl) {
    throw new Error("Missing API base URL. Set API_BASE_URL or API_OPENAPI_SPEC_URL in .env.");
  }

  return appendDocsPath(baseUrl);
}

/**
 * repo root 기준 상대 경로를 절대 경로로 변환합니다.
 *
 * @param value - 현재 작업 디렉터리 기준 파일 경로입니다.
 * @returns 절대 파일 경로입니다.
 */
function resolveFromCwd(value) {
  return path.resolve(process.cwd(), value);
}

/**
 * API 타입 생성에 필요한 경로 설정을 만듭니다.
 *
 * @description
 * 기본적으로 원본 spec 캐시는 `scripts/fetch-api-generator/openapi.json`에 두고,
 * 앱에서 사용할 타입 결과물은 `src/shared/api/generated/models`와
 * `src/shared/api/generated/params`에 생성합니다.
 *
 * `scripts/fetch-api-generator/openapi.json`은 sync:api:local에서 재사용하는 로컬 캐시입니다.
 * 서버를 다시 호출하지 않고 생성 결과만 확인하고 싶을 때 이 파일을 읽습니다.
 * 각 경로는 `API_SYNC_SPEC_FILE`, `API_SYNC_MODELS_DIR`, `API_SYNC_PARAMS_DIR`로 덮어쓸 수 있습니다.
 *
 * @param env - 테스트나 CLI에서 주입할 환경변수 객체입니다.
 * @returns sync 스크립트 실행에 필요한 정규화된 설정입니다.
 */
export function createOpenApiSyncConfig(env = process.env) {
  return {
    inputSpec: resolveInputSpec(env),
    specFile: resolveFromCwd(optionalEnv(env, "API_SYNC_SPEC_FILE") ?? DEFAULT_SPEC_PATH),
    modelsDir: resolveFromCwd(optionalEnv(env, "API_SYNC_MODELS_DIR") ?? DEFAULT_MODELS_DIR),
    paramsDir: resolveFromCwd(optionalEnv(env, "API_SYNC_PARAMS_DIR") ?? DEFAULT_PARAMS_DIR),
  };
}
