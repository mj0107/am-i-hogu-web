import "dotenv/config";
import path from "node:path";
import process from "node:process";

/**
 * API repo 내부에서 도메인별 DTO/controller Java 파일 위치를 정의합니다.
 *
 * @description
 * 백엔드 repo 자체의 위치나 branch는 환경변수로 주입하고, 이 config에는 repo 내부의 상대 경로만 둡니다.
 * 도메인이 늘어나면 `src/features/{domain}/model`로 떨어질 DTO output과 Java source 위치를 여기서 매칭합니다.
 */
const API_SYNC_DOMAIN_CONFIGS = {
  post: {
    javaRoot: "src/main/java/com/hogu/am_i_hogu/domain/post",
    controllerFiles: ["controller/PostController.java", "controller/ImageController.java"],
    dtoDirs: ["dto/request", "dto/response"],
    output: {
      dto: "src/features/post/model/post.dto.ts",
    },
  },
  comment: {
    javaRoot: "src/main/java/com/hogu/am_i_hogu/domain/comment",
    controllerFiles: ["controller/CommentController.java"],
    dtoDirs: ["dto/request", "dto/response"],
    output: {
      dto: "src/features/post/model/comment.dto.ts",
    },
  },
};

function optionalEnv(env, key) {
  return env[key] ?? null;
}

function requiredPathEnv(env, key) {
  const value = env[key];
  if (!value) {
    throw new Error(`Missing required API sync env: ${key}`);
  }
  return path.resolve(process.cwd(), value);
}

/**
 * API sync 실행에 필요한 외부 repo 설정을 환경변수에서 읽어옵니다.
 *
 * @description
 * `API_SYNC_CHECKOUT_DIR`은 DTO/controller를 실제로 읽을 API repo checkout 경로라 항상 필요합니다.
 * `API_SYNC_REPOSITORY_URL`과 `API_SYNC_BRANCH`는 clone/fetch 모드에서만 필요하므로 여기서는 optional로 보관하고,
 * 실행 단계에서 `--skip-fetch`가 아닐 때 required로 검증합니다.
 *
 * @param env - API sync 환경변수 객체입니다. 기본값은 `process.env`입니다.
 *
 * @returns repositoryUrl - clone/fetch에 사용할 API repo URL입니다.
 * @returns defaultBranch - clone/fetch에 사용할 기본 API branch입니다.
 * @returns checkoutDir - Java source를 읽을 API repo checkout 절대 경로입니다.
 * @returns domains - 도메인별 Java source와 DTO output 매핑입니다.
 */
export function createApiSyncConfig(env = process.env) {
  return {
    repositoryUrl: optionalEnv(env, "API_SYNC_REPOSITORY_URL"),
    defaultBranch: optionalEnv(env, "API_SYNC_BRANCH"),
    checkoutDir: requiredPathEnv(env, "API_SYNC_CHECKOUT_DIR"),
    domains: API_SYNC_DOMAIN_CONFIGS,
  };
}
