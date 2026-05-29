import { notFound } from "next/navigation";
import { createPostFormInitialValues, POST_DETAIL_RESPONSE_MOCKS } from "@/features/post/model";
import PostWritePageClient from "../../write/_components/post-write-page.client";

function resolvePost(postId: string) {
  const numericPostId = Number(postId);
  if (!Number.isFinite(numericPostId)) {
    return null;
  }

  return POST_DETAIL_RESPONSE_MOCKS.find((item) => item.postId === numericPostId) ?? null;
}

export default async function PostEditPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const post = resolvePost(postId);
  if (!post?.isMine) {
    notFound();
  }

  return (
    <PostWritePageClient
      mode="edit"
      headerTitle="게시글 수정"
      submitLabel="수정하기"
      submitAriaLabel="게시글 수정"
      initialValues={createPostFormInitialValues(post)}
    />
  );
}
