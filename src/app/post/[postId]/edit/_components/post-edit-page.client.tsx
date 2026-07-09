"use client";

import SmileyXEyesIcon from "@/assets/icons/smiley-x-eyes.svg";
import { usePostDetailQuery } from "@/features/post/api";
import { createPostFormInitialValues } from "@/features/post/model";
import { Button, EmptyState, LoadingState } from "@/shared/ui";
import PostWritePageClient from "../../../write/_components/post-write-page.client";

type PostEditPageClientProps = {
  postId: string;
};

function PostEditErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[calc(100dvh-60px)] flex-col justify-center px-common-padding">
      <EmptyState
        layout="inline"
        icon={<SmileyXEyesIcon aria-hidden className="size-20 text-text-03" />}
        title={"게시글 정보를 불러오지 못했습니다.\n잠시 후 다시 시도해주세요."}
        action={
          <Button type="button" fullWidth onClick={onRetry}>
            다시 시도
          </Button>
        }
      />
    </div>
  );
}

function PostEditNotFoundState() {
  return (
    <div className="flex min-h-[calc(100dvh-60px)] flex-col justify-center px-common-padding">
      <EmptyState
        layout="inline"
        icon={<SmileyXEyesIcon aria-hidden className="size-20 text-text-03" />}
        title={"수정할 수 없는 게시글입니다.\n삭제되었거나 작성 권한이 없습니다."}
      />
    </div>
  );
}

export default function PostEditPageClient({ postId }: PostEditPageClientProps) {
  const postDetailQuery = usePostDetailQuery(postId);
  const post = postDetailQuery.data;

  if (postDetailQuery.isPending) {
    return (
      <div className="flex min-h-full flex-col">
        <LoadingState />
      </div>
    );
  }

  if (postDetailQuery.isError) {
    return (
      <div className="flex min-h-full flex-col">
        <PostEditErrorState onRetry={() => postDetailQuery.refetch()} />
      </div>
    );
  }

  if (!post?.isMine) {
    return (
      <div className="flex min-h-full flex-col">
        <PostEditNotFoundState />
      </div>
    );
  }

  return (
    <PostWritePageClient
      mode="edit"
      postId={postId}
      submitLabel="수정하기"
      submitAriaLabel="게시글 수정"
      initialValues={createPostFormInitialValues(post)}
    />
  );
}
