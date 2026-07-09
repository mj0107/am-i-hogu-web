import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostDetail, isValidPostId } from "@/features/post/api";
import { isApiError } from "@/shared/api";
import PostDetailPageClient from "./_components/post-detail.client";

function parsePostId(postId: string) {
  if (!isValidPostId(postId)) {
    return null;
  }

  return postId;
}

export async function generateMetadata({ params }: { params: Promise<{ postId: string }> }): Promise<Metadata> {
  const { postId } = await params;
  const resolvedPostId = parsePostId(postId);
  if (!resolvedPostId) {
    notFound();
  }

  try {
    const post = await getPostDetail(resolvedPostId);

    // TODO: Cypress 도입 시 /post/[postId] 메타 회귀 테스트 추가 필요
    // - 각 값이 title/description/openGraph 게시글 데이터와 일치하는지 +
    //  링크 미리보기(언펄)에서 의도한대로 제목/설명 제대로 노출되는지 크로스체크할 것
    // TODO: 상세 화면 클라이언트 조회와 metadata 조회가 중복되어 호출 비용 이슈가 있을 수 있어 추후 논의 필요
    return {
      title: post.title,
      description: post.content,
      openGraph: {
        title: post.title,
        description: post.content,
        type: "article",
      },
    };
  } catch (error) {
    if (isApiError(error) && error.status === 404) {
      notFound();
    }

    throw error;
  }
}

export default async function PostDetailPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  const resolvedPostId = parsePostId(postId);
  if (!resolvedPostId) {
    notFound();
  }

  return <PostDetailPageClient key={resolvedPostId} postId={resolvedPostId} />;
}
