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
