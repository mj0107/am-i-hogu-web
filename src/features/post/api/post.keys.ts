import { createDomainQueryKeys } from "@/shared/api";
import type { GetCommentsParams } from "./post.service";

const basePostQueryKeys = createDomainQueryKeys("posts");

export const postQueryKeys = {
  ...basePostQueryKeys,
  commentsRoot: (postId: string | number) => [...basePostQueryKeys.detail(postId), "comments"] as const,
  comments: (postId: string | number, params: GetCommentsParams = {}) =>
    [...basePostQueryKeys.detail(postId), "comments", params] as const,
  commentsInfinite: (postId: string | number, params: Omit<GetCommentsParams, "cursor"> = {}) =>
    [...basePostQueryKeys.detail(postId), "comments", "infinite", params] as const,
};
