import type { PostCategoryLabel, PostCategoryValue } from "@/features/post/constants";
import type { HomePostItemResponseDto, HomePostListResponseDto } from "@/features/post/model/post.dto";
import type { SubHeadingWidgetProps } from "@/widgets/sub-heading/ui/sub-heading.widget";

export type SortValue = NonNullable<SubHeadingWidgetProps["sortValue"]>;
export type CategoryLabel = PostCategoryLabel;
export type CategoryParam = PostCategoryValue;

export type SearchPostItem = HomePostItemResponseDto;

export type SearchPostsResponse = HomePostListResponseDto;
