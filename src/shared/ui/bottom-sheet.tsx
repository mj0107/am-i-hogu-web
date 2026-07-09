"use client";

import type { ComponentProps, ReactNode } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import XIcon from "@/assets/icons/x.svg";
import { cn } from "@/shared/utils";

export type BottomSheetProps = {
  className?: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type BottomSheetTitleRowProps = {
  className?: string;
  title: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
};

export function BottomSheet(props: BottomSheetProps) {
  const { className, children, open = false, onOpenChange } = props;
  return (
    <DrawerPrimitive.Root direction="bottom" open={open} onOpenChange={onOpenChange}>
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in" />
        <DrawerPrimitive.Content
          data-slot="bottom-sheet"
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-common-width flex-col rounded-t-[16px] bg-bg-01 outline-none duration-200 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom",
            className,
          )}
        >
          {children}
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  );
}

export function BottomSheetHandle({ className }: { className?: string }) {
  return (
    <DrawerPrimitive.Handle
      data-slot="bottom-sheet-handle"
      className={cn("mx-auto my-2 h-[5px] w-[134px] rounded-full bg-text-04", className)}
    />
  );
}

export function BottomSheetHeader({ className, ...props }: ComponentProps<"header">) {
  return (
    <header data-slot="bottom-sheet-header" className={cn("flex flex-col gap-1 px-4 pt-4", className)} {...props} />
  );
}

export function BottomSheetTitleRow({ className, title, onClose, closeLabel = "닫기" }: BottomSheetTitleRowProps) {
  return (
    <div className={cn("flex w-full items-center justify-between gap-2", className)}>
      <DrawerPrimitive.Title asChild>
        <h2 className="text-title2-m text-text-04">{title}</h2>
      </DrawerPrimitive.Title>
      <button
        type="button"
        aria-label={closeLabel}
        className="inline-flex size-5 items-center justify-center rounded-full text-text-03"
        onClick={onClose}
      >
        <XIcon strokeWidth={20} />
      </button>
    </div>
  );
}

export function BottomSheetDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <DrawerPrimitive.Description asChild>
      <p data-slot="bottom-sheet-description" className={cn("text-body-r text-text-03", className)} {...props} />
    </DrawerPrimitive.Description>
  );
}

export function BottomSheetBody({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="bottom-sheet-body" className={cn("w-full px-4 py-4", className)} {...props} />;
}

export function BottomSheetFooter({ className, ...props }: ComponentProps<"footer">) {
  return <footer data-slot="bottom-sheet-footer" className={cn("w-full px-4 pb-4", className)} {...props} />;
}
