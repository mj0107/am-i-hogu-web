import type { ReactNode } from "react";

// NOTE - 추후 '한 줄 소개' step 확장 가능성을 고려해 layout을 두었습니다.
export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return <main className="flex min-h-dvh flex-col px-4 pt-31 pb-8">{children}</main>;
}
