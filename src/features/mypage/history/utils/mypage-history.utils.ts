import { HISTORY_RESULT_BY_MY_VOTE, HISTORY_RESULT_BY_VOTE_SUMMARY } from "@/features/mypage/history/constants";
import type { MypageHistoryItem } from "@/features/mypage/history/model/mypage-history.types";
import { toPostCategoryLabel } from "@/features/post/constants";
import type { PostId } from "@/features/post/model";
import type {
  MyBookmarkItemResponse,
  MyCommentItemResponse,
  MyPostItemResponse,
  MyVoteItemResponse,
} from "@/shared/api/generated";
import { formatNumber, formatRelativeTime } from "@/shared/utils/format";

type MyPostItemWithSafeId = Omit<MyPostItemResponse, "postId"> & {
  postId: PostId;
};

type MyBookmarkItemWithSafeId = Omit<MyBookmarkItemResponse, "postId"> & {
  postId: PostId;
};

type MyCommentItemWithSafeId = Omit<MyCommentItemResponse, "post"> & {
  post: Omit<MyCommentItemResponse["post"], "postId"> & {
    postId: PostId;
  };
};

type MyVoteItemWithSafeId = Omit<MyVoteItemResponse, "post"> & {
  post: Omit<MyVoteItemResponse["post"], "postId"> & {
    postId: PostId;
  };
};

export function toPostHistoryItem(post: MyPostItemWithSafeId): MypageHistoryItem {
  return {
    id: `post-${post.postId}`,
    postId: post.postId,
    category: toPostCategoryLabel(post.category),
    title: post.title,
    createdAtLabel: formatRelativeTime(post.createdAt),
    result: HISTORY_RESULT_BY_VOTE_SUMMARY[post.voteSummary],
    commentCountLabel: formatNumber(post.commentCount),
  };
}

export function toBookmarkHistoryItem(post: MyBookmarkItemWithSafeId): MypageHistoryItem {
  return {
    id: `bookmark-${post.postId}`,
    postId: post.postId,
    category: toPostCategoryLabel(post.category),
    title: post.isDeleted ? "(삭제된 게시글)" : post.title,
    createdAtLabel: formatRelativeTime(post.createdAt),
    result: HISTORY_RESULT_BY_VOTE_SUMMARY[post.voteSummary],
    commentCountLabel: formatNumber(post.commentCount),
    isSourceDeleted: post.isDeleted,
  };
}

export function toCommentHistoryItem(comment: MyCommentItemWithSafeId): MypageHistoryItem {
  return {
    id: `comment-${comment.commentId}`,
    postId: comment.post.postId,
    category: toPostCategoryLabel(comment.post.category),
    title: comment.post.title,
    sourceTitle: comment.post.title,
    comment: comment.content,
    createdAtLabel: formatRelativeTime(comment.createdAt),
    result: "none",
    commentCountLabel: formatNumber(comment.post.commentCount),
    isSourceDeleted: comment.post.isDeleted,
  };
}

export function toVoteHistoryItem(vote: MyVoteItemWithSafeId): MypageHistoryItem {
  return {
    id: `vote-${vote.post.postId}-${vote.createdAt}`,
    postId: vote.post.postId,
    category: toPostCategoryLabel(vote.post.category),
    title: vote.post.title,
    createdAtLabel: formatRelativeTime(vote.createdAt),
    result: HISTORY_RESULT_BY_MY_VOTE[vote.myVote],
    commentCountLabel: formatNumber(vote.post.commentCount),
    isSourceDeleted: vote.post.isDeleted,
  };
}
