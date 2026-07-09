"use server";

import { type ApiResult, apiFailure, apiSuccess } from "@/shared/api";
import {
  type CheckNicknameQueryParams,
  type CheckNicknameResponse,
  type CreateUserBody,
  type CreateUserResponse,
  checkNickname,
  createUser,
  type DeleteUserResponse,
  deleteUser,
  type GetHoguReportResponse,
  type GetMyBookmarksQueryParams,
  type GetMyBookmarksResponse,
  type GetMyCommentsQueryParams,
  type GetMyCommentsResponse,
  type GetMyPageResponse,
  type GetMyPostsQueryParams,
  type GetMyPostsResponse,
  type GetMyVotesQueryParams,
  type GetMyVotesResponse,
  getHoguReport,
  getMyBookmarks,
  getMyComments,
  getMyPage,
  getMyPosts,
  getMyVotes,
  type UpdateProfileBody,
  type UpdateProfileResponse,
  updateProfile,
} from "./mypage.service";

export async function checkNicknameAction(params: CheckNicknameQueryParams): Promise<ApiResult<CheckNicknameResponse>> {
  try {
    return apiSuccess(await checkNickname(params));
  } catch (error) {
    return apiFailure(error);
  }
}

export async function createUserAction(body: CreateUserBody): Promise<ApiResult<CreateUserResponse>> {
  try {
    return apiSuccess(await createUser(body));
  } catch (error) {
    return apiFailure(error);
  }
}

export async function deleteUserAction(): Promise<ApiResult<DeleteUserResponse>> {
  try {
    return apiSuccess(await deleteUser());
  } catch (error) {
    return apiFailure(error);
  }
}

export async function getHoguReportAction(): Promise<ApiResult<GetHoguReportResponse>> {
  try {
    return apiSuccess(await getHoguReport());
  } catch (error) {
    return apiFailure(error);
  }
}

export async function getMyBookmarksAction(
  params: GetMyBookmarksQueryParams = {},
): Promise<ApiResult<GetMyBookmarksResponse>> {
  try {
    return apiSuccess(await getMyBookmarks(params));
  } catch (error) {
    return apiFailure(error);
  }
}

export async function getMyCommentsAction(
  params: GetMyCommentsQueryParams = {},
): Promise<ApiResult<GetMyCommentsResponse>> {
  try {
    return apiSuccess(await getMyComments(params));
  } catch (error) {
    return apiFailure(error);
  }
}

export async function getMyPageAction(): Promise<ApiResult<GetMyPageResponse>> {
  try {
    return apiSuccess(await getMyPage());
  } catch (error) {
    return apiFailure(error);
  }
}

export async function getMyPostsAction(params: GetMyPostsQueryParams = {}): Promise<ApiResult<GetMyPostsResponse>> {
  try {
    return apiSuccess(await getMyPosts(params));
  } catch (error) {
    return apiFailure(error);
  }
}

export async function getMyVotesAction(params: GetMyVotesQueryParams = {}): Promise<ApiResult<GetMyVotesResponse>> {
  try {
    return apiSuccess(await getMyVotes(params));
  } catch (error) {
    return apiFailure(error);
  }
}

export async function updateProfileAction(body: UpdateProfileBody): Promise<ApiResult<UpdateProfileResponse>> {
  try {
    return apiSuccess(await updateProfile(body));
  } catch (error) {
    return apiFailure(error);
  }
}
