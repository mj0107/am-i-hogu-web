"use client";

import { authenticatedApiClient } from "@/features/auth/api";
import { parsePostIdJsonResponse } from "@/features/post/api/post-response-parser";
import type {
  CheckNicknameQueryParams,
  CheckNicknameResponse,
  GetHoguReportResponse,
  GetMyBookmarksQueryParams,
  GetMyBookmarksResponse,
  GetMyCommentsQueryParams,
  GetMyCommentsResponse,
  GetMyPageResponse,
  GetMyPostsQueryParams,
  GetMyPostsResponse,
  GetMyVotesQueryParams,
  GetMyVotesResponse,
  UpdateProfileBody,
  UpdateProfileResponse,
} from "./mypage.service";

export async function checkNicknameWithAuth(params: CheckNicknameQueryParams) {
  return authenticatedApiClient<CheckNicknameResponse>("/api/users/check-nickname", {
    method: "GET",
    query: params,
  });
}

export async function getMyPageWithAuth() {
  return authenticatedApiClient<GetMyPageResponse>("/api/users/me", {
    method: "GET",
  });
}

export async function deleteUserWithAuth() {
  return authenticatedApiClient<void>("/api/users/me", {
    method: "DELETE",
  });
}

export async function getHoguReportWithAuth() {
  return authenticatedApiClient<GetHoguReportResponse>("/api/users/me/report", {
    method: "GET",
  });
}

export async function getMyBookmarksWithAuth(params: GetMyBookmarksQueryParams = {}) {
  return authenticatedApiClient<GetMyBookmarksResponse>("/api/users/me/bookmarks", {
    method: "GET",
    parseJson: parsePostIdJsonResponse,
    query: params,
  });
}

export async function getMyCommentsWithAuth(params: GetMyCommentsQueryParams = {}) {
  return authenticatedApiClient<GetMyCommentsResponse>("/api/users/me/comments", {
    method: "GET",
    parseJson: parsePostIdJsonResponse,
    query: params,
  });
}

export async function getMyPostsWithAuth(params: GetMyPostsQueryParams = {}) {
  return authenticatedApiClient<GetMyPostsResponse>("/api/users/me/posts", {
    method: "GET",
    parseJson: parsePostIdJsonResponse,
    query: params,
  });
}

export async function getMyVotesWithAuth(params: GetMyVotesQueryParams = {}) {
  return authenticatedApiClient<GetMyVotesResponse>("/api/users/me/votes", {
    method: "GET",
    parseJson: parsePostIdJsonResponse,
    query: params,
  });
}

export async function updateProfileWithAuth(body: UpdateProfileBody) {
  return authenticatedApiClient<UpdateProfileResponse>("/api/users/me", {
    method: "PATCH",
    body,
  });
}
