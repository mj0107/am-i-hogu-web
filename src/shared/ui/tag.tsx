import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/shared/utils";

const tagVariants = cva("inline-flex items-center justify-center whitespace-nowrap rounded-full", {
  variants: {
    tone: {
      default: "bg-indigo-100 text-primary-default",
      primary: "bg-indigo-100 text-primary-default",
      secondary: "bg-secondary-default text-secondary-strong",
      muted: "bg-line-02 text-text-03",
      outline: "border border-line-01 bg-bg-01 text-text-03",
      active: "bg-primary-default !text-text-01",
      categoryActive: "bg-indigo-100 !text-primary-default",
      categoryInactive: "bg-line-02 text-text-03",
    },
    size: {
      xs: "px-3 py-1 text-mini-m",
      sm: "px-3 py-1.5 text-small-m",
      md: "px-3 py-1.5 text-caption-m",
      lg: "px-6 py-2 text-caption-sb",
    },
  },
  defaultVariants: {
    tone: "default",
    size: "sm",
  },
});

export type TagProps = VariantProps<typeof tagVariants> & {
  as?: "span" | "button";
} & Omit<ComponentProps<"span">, "color"> &
  Omit<ComponentProps<"button">, "color">;

export function Tag(props: TagProps) {
  const { className, tone, size, as = "span", ...rest } = props;
  const Comp = as;
  return <Comp className={cn(tagVariants({ tone, size }), className)} {...rest} />;
}
