"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { FooterActionBar, PostWriteButton, TopScrollButton } from "@/shared/ui";
import { type FooterTabId, FooterWidget } from "@/widgets/footer/ui";
import { HeaderWidget, type HeaderWidgetProps } from "@/widgets/header/ui";

type AppShellConfig = {
  header?: {
    title?: string;
    variant?: HeaderWidgetProps["variant"];
    // 기본은 fixed이며, 화면 안에서 함께 스크롤되어야 하는 헤더만 sticky로 지정한다.
    position?: "fixed" | "sticky";
    reserveSpace?: boolean;
  };
  bottomNav?: FooterTabId;
  postWriteButton?: boolean;
  bottomOffset?: "none" | "nav" | "action";
};

type AppShellProps = {
  children: ReactNode;
};

// 앱뷰에서 반복되는 헤더, 하단 내비게이션, 플로팅 버튼 정책을 페이지별 구현에서 분리해 한 곳에서 관리한다.
function getAppShellConfig(pathname: string): AppShellConfig {
  if (pathname === "/") {
    return {
      bottomNav: "home",
      postWriteButton: true,
      bottomOffset: "nav",
    };
  }

  if (pathname === "/search") {
    return {
      bottomNav: "search",
      bottomOffset: "nav",
    };
  }

  if (pathname === "/post/write") {
    return {
      header: {
        title: "게시글 작성",
      },
      bottomOffset: "action",
    };
  }

  if (/^\/post\/[^/]+\/edit$/.test(pathname)) {
    return {
      header: {
        title: "게시글 수정",
      },
      bottomOffset: "action",
    };
  }

  if (/^\/post\/[^/]+$/.test(pathname)) {
    return {
      header: {
        title: "게시글 상세",
      },
    };
  }

  if (pathname === "/mypage/history") {
    return {
      header: {
        title: "히스토리",
      },
      bottomNav: "mypage",
      bottomOffset: "nav",
    };
  }

  if (pathname === "/mypage/account") {
    return {
      header: {
        title: "계정 관리",
      },
      bottomNav: "mypage",
      bottomOffset: "nav",
    };
  }

  if (pathname === "/mypage/report") {
    return {
      header: {
        variant: "ghost",
        position: "sticky",
      },
      bottomNav: "mypage",
      bottomOffset: "nav",
    };
  }

  if (pathname === "/mypage/profile/edit") {
    return {
      header: {
        title: "프로필 편집",
      },
      bottomOffset: "action",
    };
  }

  if (pathname.startsWith("/mypage")) {
    return {
      bottomNav: "mypage",
      bottomOffset: "nav",
    };
  }

  return {
    bottomOffset: "none",
  };
}

function getFloatingOffsetClassNames(config: AppShellConfig) {
  if (config.bottomOffset === "nav") {
    return {
      base: "bottom-[var(--spacing-app-bottom-nav-floating-offset)]",
      stacked: "bottom-[var(--spacing-app-bottom-nav-stacked-floating-offset)]",
    };
  }

  if (config.bottomOffset === "action") {
    return {
      base: "bottom-[var(--spacing-app-footer-action-floating-offset)]",
      stacked: "bottom-[var(--spacing-app-footer-action-stacked-floating-offset)]",
    };
  }

  return {
    base: undefined,
    stacked: undefined,
  };
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const config = getAppShellConfig(pathname);
  const headerConfig = config.header;
  const floatingOffsetClassNames = getFloatingOffsetClassNames(config);
  const isFixedHeader = headerConfig && headerConfig.position !== "sticky";
  const isStickyHeader = headerConfig?.position === "sticky";
  const shouldReserveHeaderSpace = isFixedHeader && headerConfig.reserveSpace !== false;

  return (
    <>
      {isFixedHeader ? (
        <div className="fixed left-1/2 top-0 z-30 w-full max-w-common-width -translate-x-1/2">
          <HeaderWidget title={headerConfig.title} variant={headerConfig.variant} />
        </div>
      ) : null}
      <div className={shouldReserveHeaderSpace ? "min-h-full pt-[60px]" : "min-h-full"}>
        {isStickyHeader ? (
          <div className="sticky top-0 z-30">
            <HeaderWidget title={headerConfig.title} variant={headerConfig.variant} />
          </div>
        ) : null}
        {children}
      </div>
      {/* 하단 고정 UI 위치에 맞춰 플로팅 버튼의 기준점을 shell에서 함께 관리한다. */}
      <TopScrollButton
        mode={config.postWriteButton ? "withPostWrite" : "single"}
        className={config.postWriteButton ? floatingOffsetClassNames.stacked : floatingOffsetClassNames.base}
      />
      {config.postWriteButton ? <PostWriteButton href="/post/write" className={floatingOffsetClassNames.base} /> : null}
      {config.bottomNav ? (
        <FooterActionBar data-slot="app-shell-bottom-nav" mode="fixed" className="px-0 py-0">
          <FooterWidget activeTab={config.bottomNav} />
        </FooterActionBar>
      ) : null}
    </>
  );
}
