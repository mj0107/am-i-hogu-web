export const POST_CATEGORY_VALUES = ["USED_TRADE", "WORK", "PURCHASE", "CONTRACT", "DATING", "ETC"] as const;
export const POST_FILTER_OPTIONS = ["중고거래", "직장", "소비", "연애", "계약", "기타"] as const;

export type PostCategoryValue = (typeof POST_CATEGORY_VALUES)[number];
export type PostCategoryLabel = (typeof POST_FILTER_OPTIONS)[number];

export const POST_CATEGORY_LABEL_BY_VALUE: Record<PostCategoryValue, PostCategoryLabel> = {
  USED_TRADE: "중고거래",
  WORK: "직장",
  PURCHASE: "소비",
  CONTRACT: "계약",
  DATING: "연애",
  ETC: "기타",
};

export const POST_CATEGORY_VALUE_BY_LABEL: Record<PostCategoryLabel, PostCategoryValue> = {
  중고거래: "USED_TRADE",
  직장: "WORK",
  소비: "PURCHASE",
  연애: "DATING",
  계약: "CONTRACT",
  기타: "ETC",
};

export function toPostCategoryLabel(value: PostCategoryValue): PostCategoryLabel {
  return POST_CATEGORY_LABEL_BY_VALUE[value];
}

export const POST_SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "views", label: "조회순" },
  { value: "comments", label: "댓글순" },
  { value: "votes", label: "투표 참여순" },
] as const;

export const POST_LIST_PAGE_SIZE = 10;

export type PostSortValue = (typeof POST_SORT_OPTIONS)[number]["value"];
export type PostSortQueryValue = "LATEST" | "MOST_VIEWED" | "MOST_COMMENTED" | "MOST_PARTICIPATED";

export const POST_SORT_QUERY_BY_VALUE = {
  latest: "LATEST",
  views: "MOST_VIEWED",
  comments: "MOST_COMMENTED",
  votes: "MOST_PARTICIPATED",
} satisfies Record<PostSortValue, PostSortQueryValue>;

export type PostCommentSortValue = "latest" | "helpful";

export const COMMENT_PAGE_SIZE = 15;

export const COMMENT_SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "helpful", label: "유익해요순" },
] as const satisfies readonly { value: PostCommentSortValue; label: string }[];

export const COMMENT_SORT_QUERY_BY_VALUE = {
  latest: "LATEST",
  helpful: "HELPFUL",
} satisfies Record<PostCommentSortValue, "LATEST" | "HELPFUL">;
