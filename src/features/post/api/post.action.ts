"use server";

import { type ApiResult, apiFailure, apiSuccess } from "@/shared/api";
import type { CommentReadResponse, HomePostListResponse, PostDetailResponse } from "@/shared/api/generated";
import {
  type GetCommentsParams,
  type GetHomePostsParams,
  getComments,
  getHomePosts,
  getPostDetail,
  type PostId,
} from "./post.service";

export async function getHomePostsAction(params: GetHomePostsParams = {}): Promise<ApiResult<HomePostListResponse>> {
  try {
    return apiSuccess(await getHomePosts(params));
  } catch (error) {
    return apiFailure(error);
  }
}

export async function getCommentsAction(
  postId: PostId,
  params: GetCommentsParams = {},
): Promise<ApiResult<CommentReadResponse>> {
  try {
    return apiSuccess(await getComments(postId, params));
  } catch (error) {
    return apiFailure(error);
  }
}

export async function getPostDetailAction(postId: PostId): Promise<ApiResult<PostDetailResponse>> {
  try {
    return apiSuccess(await getPostDetail(postId));
  } catch (error) {
    return apiFailure(error);
  }
}
