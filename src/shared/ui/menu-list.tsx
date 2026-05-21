import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import CaretRightIcon from "@/assets/icons/caret-right.svg";
import { cn } from "@/shared/utils";

export type MenuListItem = {
  id: string;
  label: string;
  href?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  iconStrokeWidth?: SVGProps<SVGSVGElement>["strokeWidth"] | false;
  disabled?: boolean;
  danger?: boolean;
};

export type MenuListVariant = "divided" | "plain";

export type MenuListProps<TItem extends MenuListItem = MenuListItem> = {
  items: TItem[];
  ariaLabel: string;
  onItemSelect?: (item: TItem) => void;
  variant?: MenuListVariant;
  className?: string;
};

const menuListVariantClassNames: Record<
  MenuListVariant,
  {
    list: string;
    trigger: string;
    label: string;
    caret: string;
  }
> = {
  divided: {
    list: "flex flex-col",
    trigger: "py-3",
    label: "text-body-sb",
    caret: "text-primary-strong",
  },
  plain: {
    list: "flex flex-col gap-6",
    trigger: "",
    label: "text-body-m",
    caret: "text-text-03",
  },
};

function MenuListItemContent({ item, variant }: { item: MenuListItem; variant: MenuListVariant }) {
  const Icon = item.icon;
  const variantClassNames = menuListVariantClassNames[variant];
  const iconProps = item.iconStrokeWidth === false ? {} : { strokeWidth: item.iconStrokeWidth ?? 20 };

  return (
    <>
      <span className="inline-flex min-w-0 items-center gap-4">
        {Icon ? (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[12px] bg-indigo-50 text-text-03">
            <Icon aria-hidden className="size-5" {...iconProps} />
          </span>
        ) : null}
        <span className={cn("truncate", variantClassNames.label, item.danger ? "text-danger" : "text-text-04")}>
          {item.label}
        </span>
      </span>
      <CaretRightIcon aria-hidden className={cn("size-4 shrink-0", variantClassNames.caret)} strokeWidth={20} />
    </>
  );
}

export function MenuList<TItem extends MenuListItem = MenuListItem>(props: MenuListProps<TItem>) {
  const { items, ariaLabel, onItemSelect, variant = "divided", className } = props;
  const variantClassNames = menuListVariantClassNames[variant];

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul className={variantClassNames.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const itemClassName = cn(
            "flex w-full items-center justify-between text-left",
            variantClassNames.trigger,
            item.disabled && "pointer-events-none opacity-40",
          );

          return (
            <li key={item.id} className={variant === "divided" && !isLast ? "border-b border-line-01" : undefined}>
              {item.href ? (
                <Link href={item.href} aria-disabled={item.disabled || undefined} className={itemClassName}>
                  <MenuListItemContent item={item} variant={variant} />
                </Link>
              ) : (
                <button
                  type="button"
                  disabled={item.disabled}
                  className={itemClassName}
                  onClick={() => onItemSelect?.(item)}
                >
                  <MenuListItemContent item={item} variant={variant} />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
