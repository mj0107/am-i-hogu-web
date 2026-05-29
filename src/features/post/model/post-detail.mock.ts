import { HOME_POSTS_MOCK } from "@/features/post/model/post.mock";
import type {
  CommentCreateRequestDto,
  CommentCreateResponseDto,
  CommentReadResponseDto,
  CommentUpdateRequestDto,
  CommentUpdateResponseDto,
  CursorRequestDto,
} from "./comment.dto";
import type { PostDetailResponseDto, PostVoteResponseDto } from "./post.dto";

export const HOGU_VOTE_IDS = ["HOGU", "NOT_HOGU"] as const;
export type HoguVoteId = (typeof HOGU_VOTE_IDS)[number];

export const DETAIL_VOTE_MOCK = {
  totalVotes: 100,
  yesVotes: 70,
  noVotes: 30,
  myVote: "HOGU" as HoguVoteId,
} satisfies PostVoteResponseDto;

export function createDetailVoteOptions() {
  return [
    {
      id: "HOGU" as const,
      label: "호구 맞다",
      emoji: "😢",
      percent: Math.round((DETAIL_VOTE_MOCK.yesVotes / DETAIL_VOTE_MOCK.totalVotes) * 100),
    },
    {
      id: "NOT_HOGU" as const,
      label: "아니다",
      emoji: "🤔",
      percent: Math.round((DETAIL_VOTE_MOCK.noVotes / DETAIL_VOTE_MOCK.totalVotes) * 100),
    },
  ];
}

export const DETAIL_COMMENTS_MOCK = {
  comments: [
    {
      commentId: 1234,
      content: "진짜 대박 호구시네요... 당장 환불하세요. 지금 쿠X에서도 새제품 110만원대면 삽니다.",
      isMine: false,
      writer: {
        nickname: "팩트폭격기",
        profileImageUrl: "https://~~~",
        isPostWriter: false,
      },
      createdAt: "2026-05-03T12:10:00.000Z",
      updatedAt: "2026-05-03T12:10:00.000Z",
      isDeleted: false,
      isHelpful: true,
      totalHelpfulCount: 12,
      parentId: null,
      depth: 1,
    },
    {
      commentId: 1235,
      content:
        "헉 그런가요 ㅠㅠㅠ!!!! 이미 사버렸는데... 어떡하면 좋을까요 ㅠㅠ 저 엄마가 알면 큰일난단 말이에요 ㅠㅠㅠㅠㅠㅠ",
      isMine: true,
      writer: {
        nickname: "김호구",
        profileImageUrl: "https://~~~",
        isPostWriter: true,
      },
      createdAt: "2026-05-03T13:07:00.000Z",
      updatedAt: "2026-05-03T13:07:00.000Z",
      isDeleted: false,
      isHelpful: true,
      totalHelpfulCount: 1,
      parentId: 1234,
      depth: 2,
    },
  ],
  hasNext: false,
  nextCursor: "SDLE1J3787",
} satisfies CommentReadResponseDto;

export const COMMENT_CURSOR_REQUEST_MOCK = {
  sortBy: "latest",
  pageSize: 10,
  cursor: "0",
} satisfies CursorRequestDto;

export const COMMENT_CREATE_REQUEST_MOCK = {
  parentId: null,
  content: "진짜 대박 호구시네요... 당장 환불하세요. 지금 쿠X에서도 새제품 110만원대면 삽니다.",
} satisfies CommentCreateRequestDto;

export const REPLY_CREATE_REQUEST_MOCK = {
  parentId: 1234,
  content:
    "헉 그런가요 ㅠㅠㅠ!!!! 이미 사버렸는데... 어떡하면 좋을까요 ㅠㅠ 저 엄마가 알면 큰일난단 말이에요 ㅠㅠㅠㅠㅠㅠ",
} satisfies CommentCreateRequestDto;

export const COMMENT_UPDATE_REQUEST_MOCK = {
  content: "판매처를 다시 확인해보니 새제품 가격이 더 낮네요. 환불 가능하면 바로 진행하는 게 좋아 보여요.",
} satisfies CommentUpdateRequestDto;

export const COMMENT_CREATE_RESPONSE_MOCK = {
  commentId: 1236,
  content: COMMENT_CREATE_REQUEST_MOCK.content,
  isMine: true,
  writer: {
    nickname: "김호구",
    profileImageUrl: "https://~~~",
    isPostWriter: true,
  },
  createdAt: "2026-05-03T13:20:00.000Z",
  updatedAt: "2026-05-03T13:20:00.000Z",
  isHelpful: false,
  totalHelpfulCount: 0,
  parentId: COMMENT_CREATE_REQUEST_MOCK.parentId,
  depth: 1,
} satisfies CommentCreateResponseDto;

export const REPLY_CREATE_RESPONSE_MOCK = {
  commentId: 1237,
  content: REPLY_CREATE_REQUEST_MOCK.content,
  isMine: true,
  writer: {
    nickname: "김호구",
    profileImageUrl: "https://~~~",
    isPostWriter: true,
  },
  createdAt: "2026-05-03T13:25:00.000Z",
  updatedAt: "2026-05-03T13:25:00.000Z",
  isHelpful: false,
  totalHelpfulCount: 0,
  parentId: REPLY_CREATE_REQUEST_MOCK.parentId,
  depth: 2,
} satisfies CommentCreateResponseDto;

export const COMMENT_UPDATE_RESPONSE_MOCK = {
  commentId: 1234,
  content: COMMENT_UPDATE_REQUEST_MOCK.content,
  isMine: true,
  writer: {
    nickname: "팩트폭격기",
    profileImageUrl: "https://~~~",
    isPostWriter: false,
  },
  createdAt: "2026-05-03T12:10:00.000Z",
  updatedAt: "2026-05-03T13:30:00.000Z",
  isHelpful: true,
  totalHelpfulCount: 12,
  parentId: null,
  depth: 1,
} satisfies CommentUpdateResponseDto;

export const POST_DETAIL_RESPONSE_MOCKS: PostDetailResponseDto[] = HOME_POSTS_MOCK.map((post) => ({
  postId: post.postId,
  isMine: post.postId === 1,
  categories: post.categories,
  title: post.title,
  createdAt: post.createdAt,
  updatedAt: post.createdAt,
  viewCount: post.viewCount,
  content: post.contentPreview,
  images: [post.thumbnailUrl],
  vote: DETAIL_VOTE_MOCK,
  writer: {
    nickname: post.writer.nickname,
    profileImageUrl: post.writer.profileImageUrl,
  },
}));
