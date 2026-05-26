import path from "node:path";
import { createApiSyncConfig } from "./api-source.config.mjs";
import { readJavaFilesFromDir, readTextFile, writeTextFile } from "./file-system.mjs";
import { generateTypeScriptDto } from "./generate-ts-dto.mjs";
import { parseJavaRecords } from "./parse-java-records.mjs";
import { parseSpringController } from "./parse-spring-controllers.mjs";
import { syncApiSource } from "./sync-api-source.mjs";

// 사용법:
// - npm run sync:api
//   API_SYNC_REPOSITORY_URL/API_SYNC_BRANCH 기준으로 API repo를 갱신한 뒤 모든 DTO target을 생성합니다.
// - npm run sync:api -- post
//   API repo를 갱신한 뒤 post DTO target만 생성합니다.
// - npm run sync:api -- --skip-fetch
//   API_SYNC_CHECKOUT_DIR로 지정한 로컬 API repo의 현재 브랜치 기준으로 모든 DTO target을 생성합니다.
// - npm run sync:api -- post --skip-fetch
//   API_SYNC_CHECKOUT_DIR로 지정한 로컬 API repo의 현재 브랜치 기준으로 post DTO만 생성합니다.
// - npm run sync:api -- comment --skip-fetch --audit
//   comment DTO를 생성하고, 컨트롤러/import 누락 여부를 점검합니다.
// - npm run sync:api -- post --branch feat/post-crud-api
//   필요한 경우에만 특정 API branch를 가져온 뒤 post DTO target을 생성합니다.
//
// 환경변수:
// - API_SYNC_CHECKOUT_DIR: DTO를 읽을 API repo checkout 경로입니다. 항상 필요합니다.
// - API_SYNC_REPOSITORY_URL: fetch/clone이 필요할 때 사용할 API repo URL입니다.
// - API_SYNC_BRANCH: fetch/clone이 필요할 때 사용할 기본 API branch입니다.

/**
 * CLI argument를 API sync 실행 옵션으로 변환합니다.
 *
 * @description
 * 첫 번째 positional argument는 domain 이름으로 처리합니다.
 * `--domain`, `--branch`, `--skip-fetch`, `--audit` 옵션을 함께 지원합니다.
 *
 * @param argv - `process.argv.slice(2)` 형태의 CLI argument 목록입니다.
 *
 * @returns API sync 실행에 필요한 domain, branch, fetch, audit 옵션입니다.
 */
function parseArgs(argv) {
  const apiSyncConfig = createApiSyncConfig();
  const result = {
    domain: null,
    branch: null,
    skipFetch: false,
    audit: false,
    config: apiSyncConfig,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--") && result.domain === null) {
      result.domain = arg;
      continue;
    }
    if (arg === "--domain") {
      result.domain = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--branch") {
      result.branch = argv[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--skip-fetch") {
      result.skipFetch = true;
      continue;
    }
    if (arg === "--audit") {
      result.audit = true;
    }
  }

  return result;
}

/**
 * fetch/clone 모드에서만 필요한 환경변수를 검증합니다.
 *
 * @description
 * `--skip-fetch` 모드에서는 이미 준비된 `API_SYNC_CHECKOUT_DIR`만 읽으면 되므로 repo URL/branch를 강제하지 않습니다.
 * fetch/clone이 필요한 실행 경로에서만 이 helper를 호출해 필요한 값을 좁혀 검증합니다.
 *
 * @param value - 환경변수에서 읽은 값입니다.
 * @param key - 오류 메시지에 표시할 환경변수 이름입니다.
 *
 * @returns 검증된 환경변수 값입니다.
 */
function requireFetchEnv(value, key) {
  if (!value) {
    throw new Error(`Missing required API sync env for fetch mode: ${key}`);
  }
  return value;
}

/**
 * 도메인 설정에 맞는 DTO와 controller Java 파일을 API repo checkout에서 읽습니다.
 *
 * @description
 * domain config의 `javaRoot`, `dtoDirs`, `controllerFiles`는 모두 checkoutDir 기준 상대 경로입니다.
 * 이후 parser에서 source path를 보여줄 수 있도록 반환 path도 checkoutDir 기준 상대 경로로 맞춥니다.
 *
 * @param domainConfig - 도메인별 Java source 위치와 DTO output 설정입니다.
 * @param checkoutDir - Java source를 읽을 API repo checkout 경로입니다.
 *
 * @returns DTO Java 파일 목록과 controller Java 파일 목록입니다.
 */
async function collectDomainFiles(domainConfig, checkoutDir) {
  const javaRoot = path.join(checkoutDir, domainConfig.javaRoot);
  const dtoPaths = (
    await Promise.all(domainConfig.dtoDirs.map((dtoDir) => readJavaFilesFromDir(path.join(javaRoot, dtoDir))))
  ).flat();

  const dtoFiles = await Promise.all(
    dtoPaths.map(async (filePath) => ({
      path: path.relative(checkoutDir, filePath),
      source: await readTextFile(filePath),
    })),
  );

  const controllerFiles = await Promise.all(
    domainConfig.controllerFiles.map(async (controllerFile) => {
      const filePath = path.join(javaRoot, controllerFile);
      return {
        path: path.relative(checkoutDir, filePath),
        source: await readTextFile(filePath),
      };
    }),
  );

  return { dtoFiles, controllerFiles };
}

/**
 * endpoint root 타입 비교를 위해 Java wrapper 타입을 벗겨냅니다.
 *
 * @description
 * controller return/request 타입이 `List<T>`, `JsonNullable<T>`처럼 감싸진 경우 실제 DTO record 이름만 비교합니다.
 *
 * @param javaType - Java 타입 문자열입니다.
 *
 * @returns wrapper를 제거한 Java 타입 문자열입니다.
 */
function unwrapJavaType(javaType) {
  const cleanType = javaType.trim();
  const genericMatch = cleanType.match(/^(?:List|ArrayList|Set|JsonNullable)<(.+)>$/);
  return genericMatch ? unwrapJavaType(genericMatch[1]) : cleanType;
}

/**
 * controller endpoint에서 실제로 참조되는 DTO record만 선별합니다.
 *
 * @description
 * endpoint의 request/response root DTO에서 시작해 field reference를 따라가며 필요한 record를 재귀적으로 선택합니다.
 * controller에 노출되지 않은 내부 record는 generated DTO에 포함하지 않습니다.
 *
 * @param records - API repo에서 파싱한 전체 DTO record 목록입니다.
 * @param endpoints - controller에서 파싱한 endpoint 목록입니다.
 *
 * @returns endpoint에서 도달 가능한 DTO record 목록입니다.
 */
function filterRecordsByEndpointTypes(records, endpoints) {
  const recordByName = new Map(records.map((record) => [record.name, record]));
  const selectedNames = new Set();
  const queue = endpoints.flatMap((endpoint) => [endpoint.requestType, endpoint.responseType]).filter(Boolean);

  while (queue.length > 0) {
    const javaType = unwrapJavaType(queue.shift());
    const record = recordByName.get(javaType);
    if (!record || selectedNames.has(record.name)) {
      continue;
    }

    selectedNames.add(record.name);
    for (const field of record.fields) {
      queue.push(field.javaType);
    }
  }

  return records.filter((record) => selectedNames.has(record.name));
}

/**
 * controller import문에서 request/response DTO 이름을 수집합니다.
 *
 * @description
 * audit 모드에서 controller가 import하는 DTO와 실제 generated DTO가 어긋나는지 확인하기 위해 사용합니다.
 *
 * @param controllerFiles - `{ path, source }` 형태의 controller Java 파일 목록입니다.
 *
 * @returns DTO 이름과 해당 DTO를 import한 controller path 목록입니다.
 */
function collectControllerDtoImports(controllerFiles) {
  const dtoImportPattern = /import\s+[\w.]+\.dto\.(?:request|response)\.([A-Za-z_$][\w$]*)\s*;/g;
  const imports = new Map();

  for (const file of controllerFiles) {
    let match = dtoImportPattern.exec(file.source);
    while (match !== null) {
      const dtoName = match[1];
      if (!imports.has(dtoName)) {
        imports.set(dtoName, []);
      }
      imports.get(dtoName).push(file.path);
      match = dtoImportPattern.exec(file.source);
    }
  }

  return imports;
}

/**
 * API sync audit 결과를 사람이 읽기 쉬운 문자열로 렌더링합니다.
 *
 * @description
 * controller import, endpoint root type, generated record를 비교해 누락되거나 도달하지 못한 DTO를 보여줍니다.
 *
 * @param params.domain - audit 대상 domain 이름입니다.
 * @param params.allRecords - API repo에서 파싱한 전체 DTO record 목록입니다.
 * @param params.controllerDtoImports - controller import문에서 수집한 DTO 목록입니다.
 * @param params.endpoints - controller에서 파싱한 endpoint 목록입니다.
 * @param params.records - generated DTO로 선별된 record 목록입니다.
 *
 * @returns CLI에 출력할 audit report 문자열입니다.
 */
function renderAuditReport({ domain, allRecords, controllerDtoImports, endpoints, records }) {
  const availableRecordNames = new Set(allRecords.map((record) => record.name));
  const selectedRecordNames = new Set(records.map((record) => record.name));
  const endpointTypeNames = new Set(
    endpoints
      .flatMap((endpoint) => [endpoint.requestType, endpoint.responseType])
      .filter(Boolean)
      .map(unwrapJavaType),
  );
  const missingImportedDtos = [...controllerDtoImports.keys()].filter((dtoName) => !selectedRecordNames.has(dtoName));
  const missingEndpointDtos = [...endpointTypeNames].filter(
    (dtoName) => dtoName !== "Void" && !availableRecordNames.has(dtoName),
  );
  const availableButNotSelected = allRecords
    .map((record) => record.name)
    .filter((recordName) => !selectedRecordNames.has(recordName));

  const lines = [
    `\nAPI sync audit for domain "${domain}"`,
    `- Controller DTO imports: ${[...controllerDtoImports.keys()].sort().join(", ") || "(none)"}`,
    `- Endpoint DTO roots: ${[...endpointTypeNames].sort().join(", ") || "(none)"}`,
    `- Generated DTO records: ${[...selectedRecordNames].sort().join(", ") || "(none)"}`,
    `- Imported controller DTOs not generated: ${missingImportedDtos.join(", ") || "(none)"}`,
    `- Endpoint root types without matching record: ${missingEndpointDtos.join(", ") || "(none)"}`,
    `- DTO records available but not endpoint-reachable: ${availableButNotSelected.join(", ") || "(none)"}`,
    "- Parsed endpoints:",
    ...endpoints.map(
      (endpoint) =>
        `  ${endpoint.method} ${endpoint.path} -> request=${endpoint.requestType ?? "(none)"}, response=${
          endpoint.responseType ?? "(none)"
        }`,
    ),
  ];

  return lines.join("\n");
}

/**
 * 한 domain의 API DTO를 생성합니다.
 *
 * @description
 * API repo checkout에서 Java DTO/controller를 읽고, endpoint에서 도달 가능한 DTO record만 TypeScript로 출력합니다.
 * audit 옵션이 켜져 있으면 controller/import 기준의 누락 여부를 함께 출력합니다.
 *
 * @param params.domain - 생성 대상 domain 이름입니다.
 * @param params.domainConfig - 도메인별 Java source 위치와 DTO output 설정입니다.
 * @param params.checkoutDir - Java source를 읽을 API repo checkout 경로입니다.
 * @param params.audit - audit report 출력 여부입니다.
 *
 * @returns 생성된 DTO record 수와 파싱된 endpoint 수를 계산할 수 있는 결과입니다.
 */
async function syncDomain({ domain, domainConfig, checkoutDir, audit = false }) {
  const { dtoFiles, controllerFiles } = await collectDomainFiles(domainConfig, checkoutDir);
  const endpoints = controllerFiles.flatMap(parseSpringController);
  const allRecords = parseJavaRecords(dtoFiles);
  const records = filterRecordsByEndpointTypes(allRecords, endpoints);

  await writeTextFile(domainConfig.output.dto, generateTypeScriptDto(records, { domain }));

  if (audit) {
    console.log(
      renderAuditReport({
        domain,
        allRecords,
        controllerDtoImports: collectControllerDtoImports(controllerFiles),
        endpoints,
        records,
      }),
    );
  }

  return { records, endpoints };
}

/**
 * API sync CLI를 실행합니다.
 *
 * @description
 * fetch 모드에서는 env로 받은 API repo URL/branch를 checkoutDir에 맞춘 뒤 DTO를 생성합니다.
 * `--skip-fetch` 모드에서는 checkoutDir에 이미 준비된 API repo의 현재 상태를 그대로 읽습니다.
 */
async function main() {
  const args = parseArgs(process.argv.slice(2));
  const domainNames = args.domain === null ? Object.keys(args.config.domains) : [args.domain];

  if (!args.skipFetch) {
    const branch = args.branch ?? requireFetchEnv(args.config.defaultBranch, "API_SYNC_BRANCH");

    syncApiSource({
      repositoryUrl: requireFetchEnv(args.config.repositoryUrl, "API_SYNC_REPOSITORY_URL"),
      branch,
      checkoutDir: args.config.checkoutDir,
    });
  }

  for (const domain of domainNames) {
    const domainConfig = args.config.domains[domain];
    if (!domainConfig) {
      throw new Error(`Unknown API sync domain: ${domain}`);
    }

    const { records, endpoints } = await syncDomain({
      domain,
      domainConfig,
      checkoutDir: args.config.checkoutDir,
      audit: args.audit,
    });
    console.log(`Synced ${records.length} DTO records and ${endpoints.length} endpoints for domain "${domain}".`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
