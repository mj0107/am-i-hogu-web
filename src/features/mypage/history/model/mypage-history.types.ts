import type { PostCategoryValue } from "@/features/post/constants";
import type { PostId } from "@/features/post/model";

export type VoteSummary = "HOGU" | "NOT_HOGU" | "TIE" | "NONE";
export type MyVote = "HOGU" | "NOT_HOGU";

export type HistoryResult = "hogu" | "notHogu" | "tie" | "none";
export type MypageHistoryTab = "posts" | "comments" | "bookmarks" | "votes";

export type MypagePostHistoryResponse = {
  posts: MypageHistoryPostResponse[];
  hasNext: boolean;
  nextCursor: string | null;
};

export type MypageHistoryPostResponse = {
  postId: PostId;
  title: string;
  category: PostCategoryValue;
  createdAt: string;
  voteSummary: VoteSummary;
  commentCount: number;
};

export type MypageCommentHistoryResponse = {
  comments: MypageHistoryCommentResponse[];
  hasNext: boolean;
  nextCursor: string | null;
};

export type MypageHistoryCommentResponse = {
  commentId: number;
  content: string;
  createdAt: string;
  post: {
    postId: PostId;
    title: string;
    category: PostCategoryValue;
    commentCount: number;
    isDeleted: boolean;
  };
};

export type MypageVoteHistoryResponse = {
  votes: MypageHistoryVoteResponse[];
  hasNext: boolean;
  nextCursor: string | null;
};

export type MypageHistoryVoteResponse = {
  myVote: MyVote;
  createdAt: string;
  post: {
    postId: PostId;
    title: string;
    category: PostCategoryValue;
    commentCount: number;
    isDeleted: boolean;
  };
};

export type MypageHistoryItem = {
  id: string;
  postId: PostId;
  category: string;
  title: string;
  createdAtLabel: string;
  result: HistoryResult;
  commentCountLabel: string;
  comment?: string;
  sourceTitle?: string;
  isSourceDeleted?: boolean;
};
