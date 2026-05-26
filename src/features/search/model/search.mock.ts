import { POST_CATEGORY_LABEL_BY_VALUE, POST_CATEGORY_VALUES } from "@/features/post/constants";
import { HOME_POSTS_MOCK, isPostCategoryValue } from "@/features/post/model";
import type { CategoryParam, SearchPostItem, SearchPostsResponse, SortValue } from "./search.types";

export const SEARCH_POSTS_MOCK: SearchPostItem[] = HOME_POSTS_MOCK;

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
  return raw.filter((item): item is CategoryParam => POST_CATEGORY_VALUES.includes(item as CategoryParam));
}

export const PARAM_TO_CATEGORY_LABEL = POST_CATEGORY_LABEL_BY_VALUE;

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
    const matchesCategory =
      categories.length === 0 ||
      post.categories.some((category) => isPostCategoryValue(category) && categories.includes(category));
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
    nextCursor: nextCursorValue < sorted.length ? String(nextCursorValue) : "",
  };
}
