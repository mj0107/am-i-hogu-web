import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * UTF-8 텍스트 파일을 읽습니다.
 *
 * @param filePath - 읽을 파일 경로입니다.
 *
 * @returns 파일의 문자열 내용입니다.
 */
export async function readTextFile(filePath) {
  return readFile(filePath, "utf8");
}

/**
 * UTF-8 텍스트 파일을 쓰고, 필요한 상위 디렉터리를 함께 생성합니다.
 *
 * @param filePath - 쓸 파일 경로입니다.
 * @param content - 파일에 기록할 문자열 내용입니다.
 */
export async function writeTextFile(filePath, content) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
}

/**
 * 특정 디렉터리 아래의 Java 파일 경로를 재귀적으로 수집합니다.
 *
 * @description
 * API repo의 DTO directory처럼 하위 폴더가 추가될 수 있는 구조를 그대로 읽기 위해 재귀 탐색합니다.
 * 생성 결과가 흔들리지 않도록 파일 경로는 정렬해서 반환합니다.
 *
 * @param dirPath - Java 파일을 찾을 시작 디렉터리 경로입니다.
 *
 * @returns 정렬된 Java 파일 절대/상대 경로 목록입니다.
 */
export async function readJavaFilesFromDir(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await readJavaFilesFromDir(fullPath)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".java")) {
      files.push(fullPath);
    }
  }

  return files.sort();
}
