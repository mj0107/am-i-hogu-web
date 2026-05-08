import type { Metadata } from "next";
import localFont from "next/font/local";
import { GlobalFloatingControls } from "@/features/home/ui";
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
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className={`${pretendard.className} min-h-full flex`}>
        <div className="flex w-full grow flex-row justify-center">
          <div id="app-layout" className="max-w-common-width flex w-full flex-col shadow-2xl">
            {children}
            <GlobalFloatingControls />
          </div>
        </div>
      </body>
    </html>
  );
}
