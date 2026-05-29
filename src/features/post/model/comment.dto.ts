// AUTO-GENERATED from am-i-hogu/api Java records.
// Do not edit manually. Run `pnpm sync:api` instead.
// Domain: comment

export type CommentCreateRequestDto = {
  parentId: number | null;
  content: string;
};

export type CommentCreateResponseDto = {
  commentId: number | null;
  content: string;
  isMine: boolean;
  writer: CommentWriterResponseDto;
  createdAt: string;
  updatedAt: string;
  isHelpful: boolean;
  totalHelpfulCount: number;
  parentId: number | null;
  depth: number;
};

export type CommentHelpfulResponseDto = {
  totalHelpfulCount: number;
  isHelpful: boolean;
};

export type CommentItemResponseDto = {
  commentId: number | null;
  content: string;
  isMine: boolean;
  writer: CommentWriterResponseDto;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isHelpful: boolean;
  totalHelpfulCount: number;
  parentId: number | null;
  depth: number;
};

export type CommentReadResponseDto = {
  comments: CommentItemResponseDto[];
  hasNext: boolean;
  nextCursor: string;
};

export type CommentUpdateRequestDto = {
  content: string;
};

export type CommentUpdateResponseDto = {
  commentId: number | null;
  content: string;
  isMine: boolean;
  writer: CommentWriterResponseDto;
  createdAt: string;
  updatedAt: string;
  isHelpful: boolean;
  totalHelpfulCount: number;
  parentId: number | null;
  depth: number;
};

export type CommentWriterResponseDto = {
  nickname: string;
  profileImageUrl: string;
  isPostWriter: boolean;
};

export type CursorRequestDto = {
  sortBy: string;
  pageSize: number | null;
  cursor: string;
};
