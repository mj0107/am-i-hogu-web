import fs from "node:fs/promises";
import path from "node:path";

/**
 * 입력값이 원격 URL인지 확인합니다.
 *
 * @param value - OpenAPI 원본 위치입니다.
 * @returns URL로 파싱 가능하면 `true`, 로컬 파일 경로라면 `false`입니다.
 */
function isUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * 백엔드 OpenAPI 문서를 프론트 생성기에 맞게 가볍게 정규화합니다.
 *
 * @description
 * 서버 URL은 실행 환경마다 달라질 수 있으므로 생성 타입에는 고정하지 않습니다.
 * 설명 필드는 일부 generator/formatter에서 undefined 취급 차이가 생기지 않도록 빈 문자열로 맞춥니다.
 *
 * @param document - 백엔드에서 받은 OpenAPI JSON 객체입니다.
 * @returns 타입 생성에 사용할 OpenAPI JSON 객체입니다.
 */
function normalizeOpenApiDocument(document) {
  return {
    ...document,
    info: {
      ...document.info,
      description: document.info?.description ?? "",
    },
    servers: [{ url: "" }],
  };
}

/**
 * 원격 또는 로컬 OpenAPI 문서를 읽어 spec cache 파일로 저장합니다.
 *
 * @description
 * `inputSpec`이 URL이면 fetch로 `/v3/api-docs` 같은 원격 문서를 받습니다.
 * URL이 아니면 백엔드에서 별도로 제공받은 OpenAPI JSON 파일로 간주합니다.
 * 두 경우 모두 같은 정규화 과정을 거쳐 `specFile`에 덮어씁니다.
 *
 * 이 함수가 실행되는 것은 `pnpm sync:api`일 때입니다.
 * `pnpm sync:api:local`은 이 함수를 건너뛰고 이미 저장된 `scripts/fetch-api-generator/openapi.json`만 사용합니다.
 *
 * @param params.inputSpec - 원격 URL 또는 로컬 OpenAPI JSON 파일 경로입니다.
 * @param params.specFile - 정규화된 OpenAPI JSON을 저장할 경로입니다.
 * @param params.fetchApi - 테스트에서 주입할 fetch 구현입니다.
 * @returns 저장된 spec 파일 경로입니다.
 */
export async function downloadOpenApiSpec({ inputSpec, specFile, fetchApi = fetch }) {
  if (!isUrl(inputSpec)) {
    const document = normalizeOpenApiDocument(JSON.parse(await fs.readFile(inputSpec, "utf8")));
    await fs.mkdir(path.dirname(specFile), { recursive: true });
    await fs.writeFile(specFile, `${JSON.stringify(document, null, 2)}\n`, "utf8");

    return specFile;
  }

  const response = await fetchApi(inputSpec, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch OpenAPI spec: ${response.status} ${response.statusText}`);
  }

  const document = normalizeOpenApiDocument(await response.json());
  await fs.mkdir(path.dirname(specFile), { recursive: true });
  await fs.writeFile(specFile, `${JSON.stringify(document, null, 2)}\n`, "utf8");

  return specFile;
}
