import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/shared/utils";

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
  };

export const buttonVariants = cva("", {
  variants: {
    variant: {
      primary: "bg-primary-default text-text-01 hover:bg-primary-strong",
      disabled: "border-bg-02 bg-bg-02 text-text-02",
      inactive: "border-bg-02 bg-bg-02 text-text-04",
      danger: "bg-danger text-text-01 hover:bg-red-600",
      kakao: "bg-social-kakao text-social-label-strong hover:brightness-95",
      google: "border bg-bg-01 text-social-label-strong hover:bg-bg-02",
      chip: "bg-bg-02 text-text-03",
    },
    size: {
      default: "h-12 px-5",
      modal: "h-11 px-4 py-2",
      chip: "h-9 px-4 text-caption-m [--button-radius:var(--radius-round)]",
      iconSm: "size-7 p-0 [--button-radius:var(--radius-round)]",
      iconLg: "size-14 p-0 [--button-radius:var(--radius-round)] [&_svg:not([class*='size-'])]:size-6",
    },
    fullWidth: {
      true: "w-full",
      false: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
    fullWidth: false,
  },
});

export function Button(inputProps: ButtonProps) {
  const {
    className,
    variant = "primary",
    size = "default",
    fullWidth,
    asChild = false,
    leftIcon,
    rightIcon,
    children,
    ...props
  } = inputProps;
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
    >
      {leftIcon ? <span data-slot="button-left-icon">{leftIcon}</span> : null}
      <Slot.Slottable>{children}</Slot.Slottable>
      {rightIcon ? <span data-slot="button-right-icon">{rightIcon}</span> : null}
    </Comp>
  );
}
