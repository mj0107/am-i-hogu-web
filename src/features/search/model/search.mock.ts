import { HOME_POSTS_MOCK } from "@/features/post/model/post.mock";
import type { CategoryLabel, CategoryParam, SearchPostItem, SearchPostsResponse, SortValue } from "./search.types";

export const CATEGORY_TO_PARAM: Record<CategoryLabel, CategoryParam> = {
  중고거래: "TRADE",
  직장: "WORK",
  소비: "SPEND",
  연애: "RELATIONSHIP",
  계약: "CONTRACT",
  기타: "ETC",
};

export const PARAM_TO_CATEGORY: Record<CategoryParam, CategoryLabel> = {
  TRADE: "중고거래",
  WORK: "직장",
  SPEND: "소비",
  RELATIONSHIP: "연애",
  CONTRACT: "계약",
  ETC: "기타",
};

export const SEARCH_POSTS_MOCK: SearchPostItem[] = HOME_POSTS_MOCK.map((post) => ({
  postId: post.id,
  isBookmarked: post.isBookmarked,
  categories: CATEGORY_TO_PARAM[post.category as CategoryLabel] ?? "TRADE",
  title: post.title,
  createdAt: post.createdAt,
  viewCount: post.viewCount,
  contentPreview: post.description,
  thumbnailUrl: post.images[0] ?? "from-slate-100 via-zinc-100 to-neutral-200",
  totalVoteCount: post.votes,
  commentCount: post.comments,
  writer: {
    nickname: post.author,
    profileImageUrl: "",
  },
}));

export function parseSortValue(value: string | null): SortValue {
  if (value === "views" || value === "comments" || value === "votes") {
    return value;
  }
  return "latest";
}

export function parsePageSize(value: string | null) {
  const pageSize = Number(value);
  if (!Number.isFinite(pageSize) || pageSize <= 0) {
    return 10;
  }
  return Math.min(pageSize, 30);
}

export function parseCursor(value: string | null) {
  const cursor = Number(value);
  if (!Number.isFinite(cursor) || cursor < 0) {
    return 0;
  }
  return cursor;
}

export function parseCategoryParams(value: string | null): CategoryParam[] {
  if (!value) {
    return [];
  }
  const raw = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return raw.filter((item): item is CategoryParam => item in PARAM_TO_CATEGORY);
}

export function mockSearchPosts(params: {
  keyword: string;
  categories: CategoryParam[];
  sortBy: SortValue;
  pageSize: number;
  cursor: number;
}): SearchPostsResponse {
  const { keyword, categories, sortBy, pageSize, cursor } = params;
  const normalizedKeyword = keyword.trim().toLowerCase();

  const filtered = SEARCH_POSTS_MOCK.filter((post) => {
    const matchesKeyword =
      normalizedKeyword.length === 0 ||
      post.title.toLowerCase().includes(normalizedKeyword) ||
      post.contentPreview.toLowerCase().includes(normalizedKeyword) ||
      post.writer.nickname.toLowerCase().includes(normalizedKeyword);
    const matchesCategory = categories.length === 0 || categories.includes(post.categories);
    return matchesKeyword && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "views") return b.viewCount - a.viewCount;
    if (sortBy === "comments") return b.commentCount - a.commentCount;
    if (sortBy === "votes") return b.totalVoteCount - a.totalVoteCount;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const pagePosts = sorted.slice(cursor, cursor + pageSize);
  const nextCursorValue = cursor + pagePosts.length;

  return {
    totalPostCount: sorted.length,
    posts: pagePosts,
    hasNext: nextCursorValue < sorted.length,
    nextCursor: nextCursorValue < sorted.length ? String(nextCursorValue) : null,
  };
}
