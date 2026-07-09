"use client";

import { authenticatedApiClient, getOptionalAccessToken } from "@/features/auth/api";
import { type ApiClientOptions, apiClient, isApiError } from "@/shared/api";
import type {
  CancelPostVotePath,
  CommentCreateRequest,
  CommentCreateResponse,
  CommentHelpfulResponse,
  CommentReadResponse,
  CommentUpdateRequest,
  CommentUpdateResponse,
  CreateBookmarkPath,
  CreateCommentHelpfulPath,
  CreateCommentPath,
  DeleteBookmarkPath,
  DeleteCommentHelpfulPath,
  DeleteCommentPath,
  DeletePostPath,
  GetCommentsQuery,
  GetHomePostsQuery,
  HomePostListResponse,
  ImageUploadResponse,
  PostBookmarkResponse,
  PostCreateRequest,
  PostCreateResponse,
  PostDetailResponse,
  PostUpdateRequest,
  PostVoteRequest,
  PostVoteResponse,
  UpdateCommentPath,
  UpdatePostPath,
  UpdatePostVotePath,
} from "@/shared/api/generated";
import type { CommentId, PostId } from "../model/post.types";
import { parsePostIdJsonResponse } from "./post-response-parser";

type GetHomePostsParams = Omit<GetHomePostsQuery, "categories"> & {
  /** 쉼표로 구분된 카테고리 코드들 */
  categories?: string | null;
};
type GetCommentsParams = GetCommentsQuery;
type PostWriteResponse = Omit<PostCreateResponse, "postId"> & {
  postId: PostId;
};
type PostIdPath = {
  postId: PostId;
};
type CreateBookmarkParams = Omit<CreateBookmarkPath, "postId"> & PostIdPath;
type DeleteBookmarkParams = Omit<DeleteBookmarkPath, "postId"> & PostIdPath;
type DeletePostParams = Omit<DeletePostPath, "postId"> & PostIdPath;
type UpdatePostParams = Omit<UpdatePostPath, "postId"> & PostIdPath;
type UpdatePostVoteParams = Omit<UpdatePostVotePath, "postId"> & PostIdPath;
type CancelPostVoteParams = Omit<CancelPostVotePath, "postId"> & PostIdPath;
type CreateCommentParams = Omit<CreateCommentPath, "postId"> & PostIdPath;
type CommentIdPath = {
  commentId: CommentId;
};
type CommentCreatePayload = Omit<CommentCreateRequest, "parentId"> & {
  parentId: CommentId | null;
};
type UpdateCommentParams = Omit<UpdateCommentPath, "commentId" | "postId"> & PostIdPath & CommentIdPath;
type DeleteCommentParams = Omit<DeleteCommentPath, "commentId" | "postId"> & PostIdPath & CommentIdPath;
type CreateCommentHelpfulParams = Omit<CreateCommentHelpfulPath, "commentId" | "postId"> & PostIdPath & CommentIdPath;
type DeleteCommentHelpfulParams = Omit<DeleteCommentHelpfulPath, "commentId" | "postId"> & PostIdPath & CommentIdPath;

function createHeadersWithOptionalToken(headers: ApiClientOptions["headers"], accessToken: string | null) {
  const nextHeaders = new Headers(headers);

  if (accessToken) {
    nextHeaders.set("Authorization", `Bearer ${accessToken}`);
  } else {
    nextHeaders.delete("Authorization");
  }

  return Object.fromEntries(nextHeaders.entries());
}

async function createOptionalAuthHeaders(headers?: ApiClientOptions["headers"], forceRefresh = false) {
  // 공개 조회 API도 로그인 상태에서는 isMine/isHelpful/isBookmarked 같은 사용자별 필드를 내려준다.
  // 새로고침 직후 병렬 요청에서 refresh가 중복 호출되지 않도록 auth 공통 레이어의 optional token 흐름을 사용한다.
  const accessToken = await getOptionalAccessToken({ forceRefresh });

  return createHeadersWithOptionalToken(headers, accessToken);
}

async function optionalAuthApiClient<T>(path: string, options: ApiClientOptions = {}) {
  try {
    return await apiClient<T>(path, {
      ...options,
      headers: await createOptionalAuthHeaders(options.headers),
    });
  } catch (error) {
    if (!isApiError(error) || error.status !== 401) {
      throw error;
    }

    // public 조회 API에 stale access token이 붙어 401이 난 경우 refresh 후 한 번 더 시도한다.
    // refresh token도 만료되었으면 Authorization 없이 public 응답으로 fallback한다.
    return await apiClient<T>(path, {
      ...options,
      headers: await createOptionalAuthHeaders(options.headers, true),
    });
  }
}

export async function getHomePostsWithOptionalAuth(params: GetHomePostsParams = {}) {
  return optionalAuthApiClient<HomePostListResponse>("/api/posts", {
    method: "GET",
    // 사용자별 필드가 포함된 응답이 브라우저 캐시에 남지 않도록 React Query 캐시만 사용한다.
    cache: "no-store",
    parseJson: parsePostIdJsonResponse<HomePostListResponse>,
    query: params,
  });
}

export async function getPostDetailWithOptionalAuth(postId: string | number) {
  return optionalAuthApiClient<PostDetailResponse>(`/api/posts/${postId}`, {
    method: "GET",
    // 상세 응답의 isMine/vote/bookmark 상태는 로그인 사용자 기준으로 달라질 수 있다.
    cache: "no-store",
    parseJson: parsePostIdJsonResponse<PostDetailResponse>,
  });
}

export async function getCommentsWithOptionalAuth(postId: string | number, params: GetCommentsParams = {}) {
  return optionalAuthApiClient<CommentReadResponse>(`/api/posts/${postId}/comments`, {
    method: "GET",
    // 댓글 응답의 isMine/isHelpful은 Authorization 유무에 따라 달라져 stale public 응답을 피해야 한다.
    cache: "no-store",
    parseJson: parsePostIdJsonResponse<CommentReadResponse>,
    query: params,
  });
}

export async function createPostWithAuth(request: PostCreateRequest) {
  return authenticatedApiClient<PostWriteResponse>("/api/posts", {
    method: "POST",
    body: request,
    parseJson: parsePostIdJsonResponse<PostWriteResponse>,
  });
}

export async function updatePostWithAuth({ postId }: UpdatePostParams, request: PostUpdateRequest) {
  return authenticatedApiClient<PostWriteResponse>(`/api/posts/${postId}`, {
    method: "PATCH",
    body: request,
    parseJson: parsePostIdJsonResponse<PostWriteResponse>,
  });
}

export async function uploadPostImageWithAuth(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  // 이미지 파일 업로드는 별도 POST endpoint를 사용하고, 게시글 create/update에는 반환된 imageUrl만 전달한다.
  return authenticatedApiClient<ImageUploadResponse>("/api/images", {
    method: "POST",
    body: formData,
  });
}

export async function createBookmarkWithAuth({ postId }: CreateBookmarkParams) {
  return authenticatedApiClient<PostBookmarkResponse>(`/api/posts/${postId}/bookmarks`, {
    method: "POST",
    parseJson: parsePostIdJsonResponse<PostBookmarkResponse>,
  });
}

export async function deleteBookmarkWithAuth({ postId }: DeleteBookmarkParams) {
  return authenticatedApiClient<PostBookmarkResponse>(`/api/posts/${postId}/bookmarks`, {
    method: "DELETE",
    parseJson: parsePostIdJsonResponse<PostBookmarkResponse>,
  });
}

export async function deletePostWithAuth({ postId }: DeletePostParams) {
  return authenticatedApiClient<void>(`/api/posts/${postId}`, {
    method: "DELETE",
  });
}

export async function updatePostVoteWithAuth({ postId }: UpdatePostVoteParams, request: PostVoteRequest) {
  return authenticatedApiClient<PostVoteResponse>(`/api/posts/${postId}/votes`, {
    method: "PUT",
    body: request,
  });
}

export async function cancelPostVoteWithAuth({ postId }: CancelPostVoteParams) {
  return authenticatedApiClient<PostVoteResponse>(`/api/posts/${postId}/votes`, {
    method: "DELETE",
  });
}

export async function createCommentWithAuth({ postId }: CreateCommentParams, request: CommentCreatePayload) {
  return authenticatedApiClient<CommentCreateResponse>(`/api/posts/${postId}/comments`, {
    method: "POST",
    body: request,
    parseJson: parsePostIdJsonResponse<CommentCreateResponse>,
  });
}

export async function updateCommentWithAuth({ postId, commentId }: UpdateCommentParams, request: CommentUpdateRequest) {
  return authenticatedApiClient<CommentUpdateResponse>(`/api/posts/${postId}/comments/${commentId}`, {
    method: "PATCH",
    body: request,
    parseJson: parsePostIdJsonResponse<CommentUpdateResponse>,
  });
}

export async function deleteCommentWithAuth({ postId, commentId }: DeleteCommentParams) {
  return authenticatedApiClient<void>(`/api/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
  });
}

export async function createCommentHelpfulWithAuth({ postId, commentId }: CreateCommentHelpfulParams) {
  return authenticatedApiClient<CommentHelpfulResponse>(`/api/posts/${postId}/comments/${commentId}/helpful`, {
    method: "POST",
    parseJson: parsePostIdJsonResponse<CommentHelpfulResponse>,
  });
}

export async function deleteCommentHelpfulWithAuth({ postId, commentId }: DeleteCommentHelpfulParams) {
  return authenticatedApiClient<CommentHelpfulResponse>(`/api/posts/${postId}/comments/${commentId}/helpful`, {
    method: "DELETE",
    parseJson: parsePostIdJsonResponse<CommentHelpfulResponse>,
  });
}
