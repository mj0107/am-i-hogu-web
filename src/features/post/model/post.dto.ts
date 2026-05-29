// AUTO-GENERATED from am-i-hogu/api Java records.
// Do not edit manually. Run `pnpm sync:api` instead.
// Domain: post

export type HomePostItemResponseDto = {
  postId: number;
  isBookmarked: boolean;
  categories: string[];
  title: string;
  createdAt: string;
  viewCount: number;
  contentPreview: string;
  thumbnailUrl: string;
  totalVoteCount: number;
  commentCount: number;
  writer: PostWriterResponseDto;
};

export type HomePostListResponseDto = {
  totalPostCount: number | null;
  posts: HomePostItemResponseDto[];
  hasNext: boolean;
  nextCursor: string;
};

export type HomePostSearchRequestDto = {
  keyword: string;
  categories: string;
  sortBy: string;
  pageSize: number;
  cursor: string;
};

export type ImageUploadResponseDto = {
  imageUrl: string;
};

export type PostBookmarkResponseDto = {
  isBookmarked: boolean;
};

export type PostCreateRequestDto = {
  title: string;
  categories: string[];
  content: string;
  images: PostImageRequestDto[];
};

export type PostCreateResponseDto = {
  postId: number;
};

export type PostDetailResponseDto = {
  postId: number;
  isMine: boolean;
  categories: string[];
  title: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  content: string;
  images: string[];
  vote: PostVoteResponseDto;
  writer: PostWriterResponseDto;
};

export type PostImageRequestDto = {
  imageUrl: string;
  order: number;
  isThumbnail: boolean;
};

export type PostUpdateRequestDto = {
  title: string;
  categories: string[];
  content: string;
  images: PostImageRequestDto[];
};

export type PostUpdateResponseDto = {
  postId: number;
};

export type PostVoteRequestDto = {
  myVote: string;
};

export type PostVoteResponseDto = {
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  myVote: string;
};

export type PostWriterResponseDto = {
  nickname: string;
  profileImageUrl: string;
};
