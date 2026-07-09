import { apiClient } from "@/shared/api";
import type {
  CommentReadResponse,
  GetCommentsQuery,
  GetHomePostsQuery,
  HomePostListResponse,
  PostDetailResponse,
} from "@/shared/api/generated";
import type { PostId } from "../model/post.types";
import { parsePostIdJsonResponse } from "./post-response-parser";

export type GetHomePostsParams = Omit<GetHomePostsQuery, "categories"> & {
  /** 쉼표로 구분된 카테고리 코드들 */
  categories?: string | null;
};
export type GetCommentsParams = GetCommentsQuery;
export type { PostId } from "../model/post.types";

export function isValidPostId(postId: PostId) {
  if (typeof postId === "number") {
    return Number.isFinite(postId) && postId > 0;
  }

  return /^[1-9]\d*$/.test(postId);
}

export async function getHomePosts(params: GetHomePostsParams = {}) {
  return apiClient<HomePostListResponse>("/api/posts", {
    method: "GET",
    parseJson: parsePostIdJsonResponse<HomePostListResponse>,
    query: params,
  });
}

export async function getPostDetail(postId: PostId) {
  return apiClient<PostDetailResponse>(`/api/posts/${postId}`, {
    method: "GET",
    parseJson: parsePostIdJsonResponse<PostDetailResponse>,
  });
}

export async function getComments(postId: PostId, params: GetCommentsParams = {}) {
  return apiClient<CommentReadResponse>(`/api/posts/${postId}/comments`, {
    method: "GET",
    query: params,
  });
}
