import type { Metadata } from "next";
import localFont from "next/font/local";
import { QueryProvider } from "@/shared/providers/query-provider";
import { ToastProvider } from "@/shared/providers/toast-provider";
import { AppShell } from "@/widgets/app-shell/ui";
import "./globals.css";

// 폰트 설정
const pretendard = localFont({
  src: "../assets/fonts/pretendard.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-pretendard",
});

// metadata(기본 정보 입력)
export const metadata: Metadata = {
  title: "나는 호구인가요?",
  description: "일상생활에서 손해 보거나 부당한 대우를 받지 않으려는 사용자들을 위한 정보 공유 플랫폼입니다.",
};

// layout(레이아웃 설정-앱 기본 레이아웃 설정)
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full overflow-x-hidden antialiased`}>
      <body className={`${pretendard.className} flex min-h-full min-w-0 overflow-x-hidden`}>
        <QueryProvider>
          <div className="flex min-w-0 w-full grow flex-row justify-center">
            <div id="app-layout" className="max-w-common-width flex min-w-0 w-full flex-col shadow-2xl">
              <AppShell>{children}</AppShell>
            </div>
          </div>
          <ToastProvider />
        </QueryProvider>
      </body>
    </html>
  );
}
