import type { PostCategoryLabel, PostCategoryValue } from "@/features/post/constants";
import type { HomePostItemResponse, HomePostListResponse } from "@/shared/api/generated";
import type { SubHeadingWidgetProps } from "@/widgets/sub-heading/ui/sub-heading.widget";

export type SortValue = NonNullable<SubHeadingWidgetProps["sortValue"]>;
export type CategoryLabel = PostCategoryLabel;
export type CategoryParam = PostCategoryValue;

export type SearchPostItem = HomePostItemResponse;

export type SearchPostsResponse = HomePostListResponse;
