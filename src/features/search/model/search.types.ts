import type { PostCategoryLabel } from "@/features/post/constants";
import type { SubHeadingWidgetProps } from "@/widgets/sub-heading/ui/sub-heading.widget";

export type SortValue = NonNullable<SubHeadingWidgetProps["sortValue"]>;
export type CategoryLabel = PostCategoryLabel;
export type CategoryParam = "TRADE" | "WORK" | "SPEND" | "RELATIONSHIP" | "CONTRACT" | "ETC";

export type SearchPostItem = {
  postId: number;
  isBookmarked: boolean;
  categories: CategoryParam;
  title: string;
  createdAt: string;
  viewCount: number;
  contentPreview: string;
  thumbnailUrl: string;
  totalVoteCount: number;
  commentCount: number;
  writer: {
    nickname: string;
    profileImageUrl: string;
  };
};

export type SearchPostsResponse = {
  totalPostCount: number;
  posts: SearchPostItem[];
  hasNext: boolean;
  nextCursor: string | null;
};
