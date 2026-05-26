import {
  POST_CATEGORY_VALUES,
  type PostCategoryLabel,
  type PostCategoryValue,
  toPostCategoryLabel,
} from "@/features/post/constants";
import type {
  HomePostItemResponseDto,
  HomePostListResponseDto,
  HomePostSearchRequestDto,
  ImageUploadResponseDto,
  PostBookmarkResponseDto,
  PostCreateRequestDto,
  PostCreateResponseDto,
  PostDetailResponseDto,
  PostUpdateRequestDto,
  PostUpdateResponseDto,
  PostVoteRequestDto,
} from "./post.dto";

export type PostFormInitialValues = {
  title: string;
  content: string;
  selectedCategories: PostCategoryLabel[];
};

// TODO: 수정 페이지의 기존 이미지 목록 API 연동시, PostFormInitialValues에 추가해주기 (현재 목데이터 바라보는중)
type PostFormInitialValuesSource = Pick<PostDetailResponseDto, "categories" | "content" | "title">;

export function isPostCategoryValue(value: string): value is PostCategoryValue {
  return POST_CATEGORY_VALUES.includes(value as PostCategoryValue);
}

export function getPrimaryPostCategoryValue(post: Pick<HomePostItemResponseDto, "categories">): PostCategoryValue {
  return post.categories.find(isPostCategoryValue) ?? "ETC";
}

export function getPrimaryPostCategoryLabel(post: Pick<HomePostItemResponseDto, "categories">): PostCategoryLabel {
  return toPostCategoryLabel(getPrimaryPostCategoryValue(post));
}

export function createPostFormInitialValues(post: PostFormInitialValuesSource): PostFormInitialValues {
  return {
    title: post.title,
    content: post.content,
    selectedCategories: post.categories.filter(isPostCategoryValue).map(toPostCategoryLabel),
  };
}

export const HOME_POST_LIST_RESPONSE_MOCK = {
  totalPostCount: 3,
  posts: [
    {
      postId: 1,
      isBookmarked: true,
      categories: ["USED_TRADE"],
      title: "아이폰 17 프로 중고로 120만원에 샀는데... 이거 호구인가요?",
      createdAt: "2026-05-03T10:00:00.000Z",
      viewCount: 121113,
      contentPreview:
        "이번에 아이폰 17 pro 512GB 모델을 중고거래로 120만원에 구입했습니다. 상태는 거의 새거 라고 하긴 하는데, 사고 나니까 주변에서 너무 비싸게 샀다고 난리네요.",
      thumbnailUrl: "from-indigo-50 via-emerald-50 to-sky-100",
      totalVoteCount: 911111,
      commentCount: 14,
      writer: {
        nickname: "김호구",
        profileImageUrl: "",
      },
    },
    {
      postId: 2,
      isBookmarked: false,
      categories: ["WORK"],
      title: "우녹스 노랭이 20만원 어떤가요?",
      createdAt: "2026-05-02T12:00:00.000Z",
      viewCount: 123,
      contentPreview:
        "회사 주변 카페가 폐업하는데, 구형이지만 집에 오븐이 필요했던지라 냅다 예약부터 하고왔는데 괜찮을까요? 10여년전 모델이라 걱정이네요...",
      thumbnailUrl: "from-cyan-50 via-blue-50 to-indigo-100",
      totalVoteCount: 17,
      commentCount: 21,
      writer: {
        nickname: "감간판",
        profileImageUrl: "",
      },
    },
    {
      postId: 3,
      isBookmarked: true,
      categories: ["PURCHASE"],
      title: "ek43 130 어떤가요?",
      createdAt: "2026-05-01T12:00:00.000Z",
      viewCount: 123,
      contentPreview:
        "안녕하세요, 요새 커피에 미쳐사는 직장인1 인사올려봅니다!\n\n 원래 커피는 그냥 카페인 수혈용이었는데 일하다 보니 커피가 거의 생명수 수준이 되어버려서... 어느 순간 브루잉 장비 하나둘 사다 보니까 집에 홈카페가 차려졌네요;;\n\n드리퍼, 서버, 필터 이런 건 얼추 맞췄는데  뭔가 계속 맛이 애매하게 부족한 느낌이 있어서  결국 그라인더까지 눈이 가는 상황입니다...\n\n 최근 출시된 옴니아(?) 영향인지 매물이 꽤 많이 올라오던데 집 주변 당X에 올라온게 130 정도거든요. 이 가격이면 괜찮은 편인가요?\n 상태는 사진상으로는 나쁘지 않아 보이긴 하는데  중고 특성상 내부 상태나 칼날 마모 이런 건 감이 안 오기도 하고... 생각보다 작은게 아니라서 소음 관련해서도 고민이네요.\n\n 좀 조언 부탁드립니다!",
      thumbnailUrl: "from-violet-50 via-fuchsia-50 to-pink-100",
      totalVoteCount: 5,
      commentCount: 8,
      writer: {
        nickname: "김코히",
        profileImageUrl: "",
      },
    },
  ],
  hasNext: false,
  nextCursor: "",
} satisfies HomePostListResponseDto;

export const HOME_POSTS_MOCK = HOME_POST_LIST_RESPONSE_MOCK.posts;

export const HOME_POST_SEARCH_REQUEST_MOCK = {
  keyword: "아이폰",
  categories: "USED_TRADE",
  sortBy: "latest",
  pageSize: 10,
  cursor: "0",
} satisfies HomePostSearchRequestDto;

export const POST_CREATE_REQUEST_MOCK = {
  title: "아이폰 17 프로 중고로 120만원에 샀는데... 이거 호구인가요?",
  categories: ["USED_TRADE"],
  content:
    "이번에 아이폰 17 pro 512GB 모델을 중고거래로 120만원에 구입했습니다. 상태는 거의 새거 라고 하긴 하는데, 사고 나니까 주변에서 너무 비싸게 샀다고 난리네요.",
  images: [
    {
      imageUrl: "from-indigo-50 via-emerald-50 to-sky-100",
      order: 0,
      isThumbnail: true,
    },
  ],
} satisfies PostCreateRequestDto;

export const POST_CREATE_RESPONSE_MOCK = {
  postId: 1,
} satisfies PostCreateResponseDto;

export const POST_UPDATE_REQUEST_MOCK = {
  title: "아이폰 17 프로 중고로 118만원이면 괜찮은가요?",
  categories: ["USED_TRADE"],
  content:
    "판매자랑 다시 이야기해서 118만원으로 조정했습니다. 그래도 이 가격이면 괜찮은 건지 한 번 더 의견 부탁드려요.",
  images: [
    {
      imageUrl: "from-indigo-50 via-emerald-50 to-sky-100",
      order: 0,
      isThumbnail: true,
    },
  ],
} satisfies PostUpdateRequestDto;

export const POST_UPDATE_RESPONSE_MOCK = {
  postId: 1,
} satisfies PostUpdateResponseDto;

export const POST_BOOKMARK_RESPONSE_MOCK = {
  isBookmarked: true,
} satisfies PostBookmarkResponseDto;

export const POST_VOTE_REQUEST_MOCK = {
  myVote: "HOGU",
} satisfies PostVoteRequestDto;

export const IMAGE_UPLOAD_RESPONSE_MOCK = {
  imageUrl: "from-indigo-50 via-emerald-50 to-sky-100",
} satisfies ImageUploadResponseDto;
