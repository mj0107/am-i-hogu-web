import { parsePostIdJsonResponse } from "@/features/post/api/post-response-parser";
import { apiClient } from "@/shared/api";
import type {
  CheckNicknameQuery,
  CheckNicknameResponse as CheckNicknameResponseModel,
  GetMyBookmarksQuery,
  GetMyCommentsQuery,
  GetMyPostsQuery,
  GetMyVotesQuery,
  HoguReportResponse,
  MyBookmarkListResponse,
  MyCommentListResponse,
  MyPageResponse,
  MyPostListResponse,
  MyVoteListResponse,
  OnboardingRequest,
  OnboardingResponse,
  UpdateProfileRequest,
  UpdateProfileResponse as UpdateProfileResponseModel,
} from "@/shared/api/generated";

export type CheckNicknameQueryParams = CheckNicknameQuery;
export type CheckNicknameResponse = CheckNicknameResponseModel;
export type CreateUserBody = OnboardingRequest;
export type CreateUserResponse = OnboardingResponse;
export type DeleteUserResponse = unknown;
export type GetHoguReportResponse = HoguReportResponse;
export type GetMyBookmarksQueryParams = GetMyBookmarksQuery;
export type GetMyBookmarksResponse = MyBookmarkListResponse;
export type GetMyCommentsQueryParams = GetMyCommentsQuery;
export type GetMyCommentsResponse = MyCommentListResponse;
export type GetMyPageResponse = MyPageResponse;
export type GetMyPostsQueryParams = GetMyPostsQuery;
export type GetMyPostsResponse = MyPostListResponse;
export type GetMyVotesQueryParams = GetMyVotesQuery;
export type GetMyVotesResponse = MyVoteListResponse;
export type UpdateProfileBody = UpdateProfileRequest;
export type UpdateProfileResponse = UpdateProfileResponseModel;

export async function checkNickname(params: CheckNicknameQueryParams) {
  return apiClient<CheckNicknameResponse>("/api/users/check-nickname", {
    method: "GET",
    query: params,
  });
}

export async function createUser(body: CreateUserBody) {
  return apiClient<CreateUserResponse>("/api/users", {
    method: "POST",
    body,
  });
}

export async function deleteUser() {
  return apiClient<DeleteUserResponse>("/api/users/me", {
    method: "DELETE",
  });
}

export async function getHoguReport() {
  return apiClient<GetHoguReportResponse>("/api/users/me/report", {
    method: "GET",
  });
}

export async function getMyBookmarks(params: GetMyBookmarksQueryParams = {}) {
  return apiClient<GetMyBookmarksResponse>("/api/users/me/bookmarks", {
    method: "GET",
    parseJson: parsePostIdJsonResponse,
    query: params,
  });
}

export async function getMyComments(params: GetMyCommentsQueryParams = {}) {
  return apiClient<GetMyCommentsResponse>("/api/users/me/comments", {
    method: "GET",
    parseJson: parsePostIdJsonResponse,
    query: params,
  });
}

export async function getMyPage() {
  return apiClient<GetMyPageResponse>("/api/users/me", {
    method: "GET",
  });
}

export async function getMyPosts(params: GetMyPostsQueryParams = {}) {
  return apiClient<GetMyPostsResponse>("/api/users/me/posts", {
    method: "GET",
    parseJson: parsePostIdJsonResponse,
    query: params,
  });
}

export async function getMyVotes(params: GetMyVotesQueryParams = {}) {
  return apiClient<GetMyVotesResponse>("/api/users/me/votes", {
    method: "GET",
    parseJson: parsePostIdJsonResponse,
    query: params,
  });
}

export async function updateProfile(body: UpdateProfileBody) {
  return apiClient<UpdateProfileResponse>("/api/users/me", {
    method: "PATCH",
    body,
  });
}
