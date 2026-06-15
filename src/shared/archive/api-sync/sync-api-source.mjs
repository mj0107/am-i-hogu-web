import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

/**
 * git command를 현재 프로세스 stdio에 연결해 실행합니다.
 *
 * @param args - `git`에 전달할 argument 목록입니다.
 * @param options - `execFileSync`에 전달할 추가 실행 옵션입니다.
 */
function runGit(args, options = {}) {
  execFileSync("git", args, {
    stdio: "inherit",
    ...options,
  });
}

/**
 * DTO 생성에 사용할 API repo checkout을 준비합니다.
 *
 * @description
 * `checkoutDir`에 API repo가 없으면 shallow clone하고, 이미 있으면 지정 branch의 origin 상태로 맞춥니다.
 * generated DTO는 이 로컬 checkout의 Java source를 기준으로 만들어집니다.
 *
 * @param params.repositoryUrl - clone/fetch에 사용할 API repo URL입니다.
 * @param params.branch - checkout할 API repo branch 이름입니다.
 * @param params.checkoutDir - API repo를 준비할 로컬 checkout 경로입니다.
 */
export function syncApiSource({ repositoryUrl, branch, checkoutDir }) {
  if (!existsSync(`${checkoutDir}/.git`)) {
    runGit(["clone", "--depth", "1", "--branch", branch, repositoryUrl, checkoutDir]);
    return;
  }

  runGit(["fetch", "--depth", "1", "origin", branch], { cwd: checkoutDir });
  runGit(["checkout", branch], { cwd: checkoutDir });
  runGit(["reset", "--hard", `origin/${branch}`], { cwd: checkoutDir });
}
