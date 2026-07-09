import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/shared/utils";

type AppFixedSurfaceProps = ComponentProps<"div"> & {
  position?: "top" | "bottom" | "inset";
};

type AppOverlayProps = ComponentProps<"div"> & {
  children: ReactNode;
  align?: "center" | "bottom";
};

type FooterActionBarProps = ComponentProps<"footer"> & {
  children: ReactNode;
  mode?: "fixed" | "sticky";
};

const appFrameClassName = "left-1/2 w-full max-w-common-width -translate-x-1/2";

export function AppFixedSurface({ className, position = "bottom", ...props }: AppFixedSurfaceProps) {
  return (
    <div
      data-slot="app-fixed-surface"
      className={cn(
        "fixed z-50",
        appFrameClassName,
        position === "top" && "top-0",
        position === "bottom" && "bottom-0",
        position === "inset" && "inset-y-0",
        className,
      )}
      {...props}
    />
  );
}

export function AppOverlay({ className, children, align = "center", ...props }: AppOverlayProps) {
  return (
    <div
      data-slot="app-overlay"
      className={cn(
        "fixed inset-0 z-50 flex justify-center bg-filter-bg",
        align === "center" ? "items-center px-common-padding" : "items-end",
        className,
      )}
      {...props}
    >
      <div className="w-full max-w-common-width">{children}</div>
    </div>
  );
}

export function FooterActionBar({ className, children, mode = "sticky", ...props }: FooterActionBarProps) {
  return (
    <footer
      data-slot="footer-action-bar"
      className={cn(
        "z-20 w-full bg-bg-01 px-common-padding pb-6 pt-3",
        mode === "fixed" && "fixed bottom-0 left-1/2 max-w-common-width -translate-x-1/2",
        mode === "sticky" && "sticky bottom-0 left-0",
        className,
      )}
      {...props}
    >
      {children}
    </footer>
  );
}
