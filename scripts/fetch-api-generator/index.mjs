import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";
import { downloadOpenApiSpec } from "./download-openapi.mjs";
import { generateDtoModels } from "./generate-models.mjs";
import { generateApiParams } from "./generate-params.mjs";
import { createOpenApiSyncConfig } from "./openapi-config.mjs";

// pnpm sync:api
// 백엔드 /v3/api-docs에서 OpenAPI 문서를 받아온 뒤 프론트에서 쓸 타입 파일을 생성합니다.
//
// 생성되는 파일
// - src/shared/api/generated/models/*.ts : request/response body DTO
// - src/shared/api/generated/params/*.ts : query/path parameter DTO
// - src/shared/api/generated/index.ts : generated 타입을 한 번에 가져오기 위한 barrel
//
// 실행 예시
// - pnpm sync:api       : 서버에서 최신 OpenAPI 문서를 받아온 뒤 타입 생성
// - pnpm sync:api:local : 이미 받아둔 scripts/fetch-api-generator/openapi.json만 보고 타입 생성
//
// 주의
// - .env에는 API_BASE_URL={api 주소}처럼 실제 백엔드 주소를 넣어야 합니다.
// - sync:api는 서버를 한 번 호출합니다. 서버 호출 없이 재생성만 확인하려면 sync:api:local을 사용합니다.
// - generated 폴더는 자동 생성 산출물이므로 직접 수정하지 않습니다.

/**
 * CLI argument를 API sync 실행 옵션으로 변환합니다.
 *
 * @description
 * 기본 실행은 백엔드 `/v3/api-docs`를 다시 받아온 뒤 타입을 생성합니다.
 * `--skip-fetch`를 넘기면 이미 저장된 `scripts/fetch-api-generator/openapi.json`만 사용하므로,
 * 서버를 다시 호출하지 않고 생성 형태를 로컬에서 확인할 수 있습니다.
 *
 * @param argv - `process.argv.slice(2)` 형태의 CLI argument 목록입니다.
 * @returns API sync 실행 옵션입니다.
 */
function parseArgs(argv) {
  return {
    skipFetch: argv.includes("--skip-fetch"),
  };
}

/**
 * 백엔드 OpenAPI 문서에서 프론트 타입 스키마를 생성합니다.
 *
 * @description
 * 1. `.env` 설정을 읽어 원본 OpenAPI 문서 위치를 결정합니다.
 * 2. 기본 실행에서는 원격 `/v3/api-docs` 또는 로컬 JSON 파일을 `scripts/fetch-api-generator/openapi.json`으로 정규화합니다.
 *    `--skip-fetch` 실행에서는 이미 저장된 `scripts/fetch-api-generator/openapi.json`을 그대로 사용합니다.
 * 3. `components.schemas` 기준으로 `src/shared/api/generated/models/*.ts` DTO interface 파일을 다시 만듭니다.
 * 4. `paths.*.parameters` 기준으로 `src/shared/api/generated/params/*.ts` parameter interface 파일을 다시 만듭니다.
 * 5. `src/shared/api/generated/index.ts`에서 models/params 타입을 다시 export합니다.
 */
async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = createOpenApiSyncConfig();

  console.log(args.skipFetch ? "⏳ 로컬 OpenAPI 문서로 타입 생성 중..." : "⏳ 백엔드 OpenAPI 문서 가져오는 중...");

  if (!args.skipFetch) {
    await downloadOpenApiSpec(config);
    console.log("📄 OpenAPI 문서 저장:", config.specFile);
  }

  console.log("⏳ DTO/parameter 타입 생성 중...");

  const models = await generateDtoModels({
    specFile: config.specFile,
    modelsDir: config.modelsDir,
  });
  console.log(`📁 models 디렉토리 생성: ${models.dir} (${models.count}개)`);

  const params = await generateApiParams({
    specFile: config.specFile,
    paramsDir: config.paramsDir,
  });
  console.log(`📁 params 디렉토리 생성: ${params.dir} (${params.count}개)`);

  const generatedDir = path.dirname(models.dir);
  await fs.writeFile(
    path.join(generatedDir, "index.ts"),
    'export type * from "./models";\nexport type * from "./params";\n',
  );
  console.log("📄 generated index 생성:", path.join(generatedDir, "index.ts"));
  console.log("✅ API 타입 생성 완료");
}

main().catch((error) => {
  console.error("❌ API 타입 생성 실패");
  console.error(error);
  process.exitCode = 1;
});
