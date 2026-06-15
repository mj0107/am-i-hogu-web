import fs from "node:fs";
import path from "node:path";
import { generateControllerFiles } from "./generator.mjs";

// pnpm controller post --d src/features
// 기본적으로 query 파일 생성, 생성을 원하지 않을 경우 --no-query 옵션을 추가합니다.
// 예시) pnpm controller post --d src/features --no-query
// API 리소스명과 feature명이 다르면 --as 옵션으로 출력 이름을 바꿉니다.
// 예시) pnpm controller user --d src/features --as mypage

const args = process.argv.slice(2);
const baseDirIndex = args.indexOf("--d");
const outputNameIndex = args.indexOf("--as");
const controllerName = args.find((arg) => !arg.startsWith("--"));
const baseDir = baseDirIndex !== -1 ? args[baseDirIndex + 1] : "src/features";
const outputName = outputNameIndex !== -1 ? args[outputNameIndex + 1] : controllerName;
const includeQuery = !args.includes("--no-query");
const specFile = "scripts/fetch-api-generator/openapi.json";

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log("📁 디렉토리 생성:", path.relative(process.cwd(), dirPath));
  }
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content);
  console.log("📄 파일 생성:", path.relative(process.cwd(), filePath));
}

function main() {
  if (!controllerName) {
    console.error("❌ Error: controller 이름은 필수입니다.");
    console.error("예시) pnpm controller post --d src/features");
    process.exit(1);
  }

  if (!baseDir) {
    console.error("❌ Error: --d 디렉토리 경로는 필수입니다.");
    process.exit(1);
  }

  const spec = JSON.parse(fs.readFileSync(path.resolve(specFile), "utf8"));
  const targetDir = path.resolve(baseDir.replace("apps/web/", ""), outputName, "api");
  const files = generateControllerFiles({
    controllerName,
    outputName,
    includeQuery,
    spec,
  });

  ensureDir(targetDir);

  for (const [fileName, content] of Object.entries(files)) {
    writeFile(path.join(targetDir, fileName), content);
  }

  console.log("✅ controller 생성 완료:", path.relative(process.cwd(), targetDir));
}

main();
