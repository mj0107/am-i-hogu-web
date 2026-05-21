import type {
  MypageCommentHistoryResponse,
  MypageHistoryItem,
  MypageHistoryTab,
  MypagePostHistoryResponse,
  MypageVoteHistoryResponse,
} from "@/features/mypage/history/model/mypage-history.types";
import { toCommentHistoryItem, toPostHistoryItem, toVoteHistoryItem } from "@/features/mypage/history/utils";

const MYPAGE_HISTORY_DESIGN_OVERRIDES: Pick<MypageHistoryItem, "category" | "createdAtLabel" | "commentCountLabel">[] =
  [
    { category: "중고거래", createdAtLabel: "1시간 전", commentCountLabel: "24" },
    { category: "중고거래", createdAtLabel: "23시간 전", commentCountLabel: "89" },
    { category: "계약", createdAtLabel: "4일 전", commentCountLabel: "120" },
    { category: "연애", createdAtLabel: "1달 전", commentCountLabel: "999+" },
  ];

export const MYPAGE_POSTS_RESPONSE_MOCK: MypagePostHistoryResponse = {
  posts: [
    {
      postId: 1,
      title: "이거 150달러면 호구 딜인가요?",
      createdAt: "2026-05-20T11:00:00",
      voteSummary: "HOGU",
      commentCount: 24,
    },
    {
      postId: 2,
      title: "우녹스 샵프로 150이면 비싼가요?",
      createdAt: "2026-05-19T13:00:00",
      voteSummary: "NOT_HOGU",
      commentCount: 89,
    },
    {
      postId: 3,
      title: "상가 관련 서류 이렇게 했는데 호구잡힌걸까요?",
      createdAt: "2026-05-16T12:00:00",
      voteSummary: "TIE",
      commentCount: 120,
    },
    {
      postId: 4,
      title: "애인이랑 데이트 비용 9:1... 저 호구인가요?",
      createdAt: "2026-04-20T12:00:00",
      voteSummary: "NONE",
      commentCount: 999,
    },
  ],
  hasNext: false,
  nextCursor: null,
};

export const MYPAGE_COMMENTS_RESPONSE_MOCK: MypageCommentHistoryResponse = {
  comments: [
    {
      commentId: 1,
      content: "저도 궁금해요!!",
      createdAt: "2026-05-20T04:00:00",
      post: {
        postId: 1,
        title: "이거 150달러면 호구 딜인가요?",
        isDeleted: true,
      },
    },
    {
      commentId: 2,
      content: "저도 그정도 주고 샀던거 같은데... 다른분들은 어떠세요?",
      createdAt: "2026-05-20T04:00:00",
      post: {
        postId: 2,
        title: "우녹스 샵프로 150이면 비싼가요?",
        isDeleted: true,
      },
    },
  ],
  hasNext: false,
  nextCursor: null,
};

export const MYPAGE_VOTES_RESPONSE_MOCK: MypageVoteHistoryResponse = {
  votes: MYPAGE_POSTS_RESPONSE_MOCK.posts.map((post) => ({
    myVote: post.voteSummary === "NOT_HOGU" ? "NOT_HOGU" : "HOGU",
    createdAt: post.createdAt,
    post: {
      postId: post.postId,
      title: post.title,
      isDeleted: false,
    },
  })),
  hasNext: false,
  nextCursor: null,
};

export const MYPAGE_HISTORY_ITEMS_MOCK = MYPAGE_POSTS_RESPONSE_MOCK.posts.map((post, index) => ({
  ...toPostHistoryItem(post),
  ...MYPAGE_HISTORY_DESIGN_OVERRIDES[index],
}));

export const MYPAGE_HISTORY_ITEMS_BY_TAB_MOCK: Record<MypageHistoryTab, MypageHistoryItem[]> = {
  posts: MYPAGE_HISTORY_ITEMS_MOCK,
  comments: MYPAGE_COMMENTS_RESPONSE_MOCK.comments.map((comment) => ({
    ...toCommentHistoryItem(comment),
    category: "중고거래",
    createdAtLabel: "8시간 전",
    commentCountLabel: "234",
  })),
  bookmarks: MYPAGE_HISTORY_ITEMS_MOCK,
  votes: MYPAGE_VOTES_RESPONSE_MOCK.votes.map((vote, index) => ({
    ...toVoteHistoryItem(vote),
    ...MYPAGE_HISTORY_DESIGN_OVERRIDES[index],
  })),
};
