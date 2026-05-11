import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/utils";

const chipVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full border border-transparent transition-colors",
  {
    variants: {
      tone: {
        active: "bg-primary-default !text-text-01",
        inactive: "bg-bg-02 text-text-03",
        highlight: "bg-secondary-default text-text-04",
      },
      size: {
        md: "h-9 px-4 text-caption-m",
        sm: "h-8 px-3 text-caption-m",
      },
    },
    defaultVariants: {
      tone: "inactive",
      size: "md",
    },
  },
);

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof chipVariants> & {
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
  };

export function Chip(props: ChipProps) {
  const { className, tone, size, leftIcon, rightIcon, children, ...rest } = props;
  const hasIcon = Boolean(leftIcon || rightIcon);

  return (
    <button type="button" className={cn(chipVariants({ tone, size }), hasIcon && "gap-2", className)} {...rest}>
      {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
      {children}
      {rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
    </button>
  );
}
