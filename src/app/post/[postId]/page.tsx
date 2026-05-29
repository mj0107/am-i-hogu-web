import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { POST_DETAIL_RESPONSE_MOCKS } from "@/features/post/model";
import PostDetailPageClient from "./_components/post-detail.client";

function resolvePost(postId: string) {
  const numericPostId = Number(postId);
  if (!Number.isFinite(numericPostId)) {
    return null;
  }

  return POST_DETAIL_RESPONSE_MOCKS.find((item) => item.postId === numericPostId) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<{ postId: string }> }): Promise<Metadata> {
  const { postId } = await params;
  const post = resolvePost(postId);
  if (!post) {
    notFound();
  }

  // TODO: Cypress 도입 시 /post/[postId] 메타 회귀 테스트 추가 필요
  // - 각 값이 title/description/openGraph 게시글 데이터와 일치하는지 +
  //  링크 미리보기(언펄)에서 의도한대로 제목/설명 제대로 노출되는지 크로스체크할 것
  return {
    title: post.title,
    description: post.content,
    openGraph: {
      title: post.title,
      description: post.content,
      type: "article",
    },
  };
}

export default async function PostDetailPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const post = resolvePost(postId);
  if (!post) {
    notFound();
  }

  return <PostDetailPageClient postId={post.postId} />;
}
