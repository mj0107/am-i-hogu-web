import { notFound } from "next/navigation";
import { isValidPostId } from "@/features/post/api";
import PostEditPageClient from "./_components/post-edit-page.client";

export default async function PostEditPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;

  if (!isValidPostId(postId)) {
    notFound();
  }

  return <PostEditPageClient postId={postId} />;
}
