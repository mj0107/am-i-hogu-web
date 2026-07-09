import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import HouseIcon from "@/assets/icons/house.svg";
import HouseFillIcon from "@/assets/icons/house-fill.svg";
import MagnifyingGlassIcon from "@/assets/icons/magnifying-glass.svg";
import UserIcon from "@/assets/icons/user.svg";
import { cn } from "@/shared/utils";

export type FooterTabId = "home" | "search" | "mypage";

type FooterTabItem = {
  key: FooterTabId;
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const footerTabs: FooterTabItem[] = [
  { key: "home", label: "홈", href: "/", icon: HouseIcon },
  { key: "search", label: "검색", href: "/search", icon: MagnifyingGlassIcon },
  { key: "mypage", label: "내 정보", href: "/mypage", icon: UserIcon },
];

export type FooterWidgetProps = {
  activeTab?: FooterTabId;
};

function getFooterTabButtonToneClass(isActive: boolean) {
  return isActive
    ? "bg-primary-default text-text-01 hover:bg-primary-default hover:text-text-01"
    : "bg-transparent text-primary-light hover:bg-primary-light/20 hover:text-primary-default";
}

function getFooterTabIconProps(key: FooterTabId, isActive: boolean) {
  return {
    ...(key === "search" || (key === "home" && !isActive) ? { strokeWidth: 25 } : {}),
    ...(key === "search" ? { fill: isActive ? "currentColor" : "none" } : {}),
  };
}

type FooterTabButtonProps = {
  tabKey: FooterTabId;
  label: string;
  href: string;
  isActive: boolean;
  Icon: (typeof footerTabs)[number]["icon"];
};

function FooterTabButton(props: FooterTabButtonProps) {
  const { tabKey, label, href, isActive, Icon } = props;
  const ResolvedIcon = tabKey === "home" && isActive ? HouseFillIcon : Icon;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex h-auto w-[68px] max-w-full flex-col items-center justify-center gap-[var(--spacing-footer-tab-gap)] rounded-[16px] px-[var(--spacing-footer-tab-inline)] py-[var(--spacing-app-responsive-block-sm)]",
        getFooterTabButtonToneClass(isActive),
      )}
    >
      <ResolvedIcon aria-hidden className="size-5 text-current" {...getFooterTabIconProps(tabKey, isActive)} />
      <span className={cn("text-caption-m text-current", tabKey === "mypage" && "whitespace-nowrap")}>{label}</span>
    </Link>
  );
}

export function FooterWidget({ activeTab = "home" }: FooterWidgetProps) {
  return (
    <nav
      aria-label="주요 메뉴"
      className="rounded-t-[24px] bg-bg-01 px-[var(--spacing-app-responsive-inline)] py-[var(--spacing-app-responsive-block-sm)]"
    >
      <ul className="flex w-full items-center justify-around">
        {footerTabs.map(({ key, label, href, icon: Icon }) => {
          const isActive = key === activeTab;

          return (
            <li key={key} className="flex min-w-0 flex-1 justify-center">
              <FooterTabButton tabKey={key} label={label} href={href} isActive={isActive} Icon={Icon} />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
