import { redirect } from "next/navigation";
import { getOAuthCallbackRedirectPath } from "@/features/auth/utils/oauth-callback-redirect.utils";

type OAuthCallbackPageProps = {
  searchParams: Promise<{
    status?: string;
    code?: string;
  }>;
};

export default async function OAuthCallbackPage({ searchParams }: OAuthCallbackPageProps) {
  const params = await searchParams;

  redirect(getOAuthCallbackRedirectPath(params.status, params.code));
}
