import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import HouseIcon from "@/assets/icons/house.svg";
import HouseFillIcon from "@/assets/icons/house-fill.svg";
import MagnifyingGlassIcon from "@/assets/icons/magnifying-glass.svg";
import UserIcon from "@/assets/icons/user.svg";
import { cn } from "@/shared/utils";

type FooterTab = "home" | "search" | "mypage";

type FooterTabItem = {
  key: FooterTab;
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
  activeTab?: FooterTab;
};

function getFooterTabButtonToneClass(isActive: boolean) {
  return isActive
    ? "bg-primary-default text-text-01 hover:bg-primary-default hover:text-text-01"
    : "bg-transparent text-primary-light hover:bg-primary-light/20 hover:text-primary-default";
}

function getFooterTabIconProps(key: FooterTab, isActive: boolean) {
  return {
    ...(key === "search" || (key === "home" && !isActive) ? { strokeWidth: 25 } : {}),
    ...(key === "search" ? { fill: isActive ? "currentColor" : "none" } : {}),
  };
}

type FooterTabButtonProps = {
  tabKey: FooterTab;
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
        "flex h-auto w-[68px] flex-col items-center justify-center gap-1 rounded-[16px] px-3 py-3",
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
    <footer className="rounded-t-[24px] bg-bg-01 px-10 py-3">
      <ul className="flex items-center justify-between">
        {footerTabs.map(({ key, label, href, icon: Icon }) => {
          const isActive = key === activeTab;

          return (
            <li key={key}>
              <FooterTabButton tabKey={key} label={label} href={href} isActive={isActive} Icon={Icon} />
            </li>
          );
        })}
      </ul>
    </footer>
  );
}
