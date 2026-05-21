import { HISTORY_RESULT_BY_MY_VOTE, HISTORY_RESULT_BY_VOTE_SUMMARY } from "@/features/mypage/history/constants";
import type {
  MypageHistoryCommentResponse,
  MypageHistoryItem,
  MypageHistoryPostResponse,
  MypageHistoryVoteResponse,
} from "@/features/mypage/history/model/mypage-history.types";
import { formatNumber, formatRelativeTime } from "@/shared/utils/format";

export function toPostHistoryItem(post: MypageHistoryPostResponse): MypageHistoryItem {
  return {
    id: `post-${post.postId}`,
    category: "",
    title: post.title,
    createdAtLabel: formatRelativeTime(post.createdAt),
    result: HISTORY_RESULT_BY_VOTE_SUMMARY[post.voteSummary],
    commentCountLabel: formatNumber(post.commentCount),
  };
}

export function toCommentHistoryItem(comment: MypageHistoryCommentResponse): MypageHistoryItem {
  return {
    id: `comment-${comment.commentId}`,
    category: "",
    title: comment.post.title,
    sourceTitle: comment.post.title,
    comment: comment.content,
    createdAtLabel: formatRelativeTime(comment.createdAt),
    result: "none",
    commentCountLabel: "0",
    isSourceDeleted: comment.post.isDeleted,
  };
}

export function toVoteHistoryItem(vote: MypageHistoryVoteResponse): MypageHistoryItem {
  return {
    id: `vote-${vote.post.postId}-${vote.createdAt}`,
    category: "",
    title: vote.post.title,
    createdAtLabel: formatRelativeTime(vote.createdAt),
    result: HISTORY_RESULT_BY_MY_VOTE[vote.myVote],
    commentCountLabel: "0",
    isSourceDeleted: vote.post.isDeleted,
  };
}
