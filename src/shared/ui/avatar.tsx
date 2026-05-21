import Image from "next/image";
import type { ComponentProps } from "react";
import { cn } from "@/shared/utils";

export type AvatarProps = Omit<ComponentProps<"div">, "children"> & {
  name: string;
  src?: string | null;
  size?: number;
  alt?: string;
  imageClassName?: string;
  fallbackClassName?: string;
};

export function Avatar(props: AvatarProps) {
  const { name, src, size = 40, alt, className, imageClassName, fallbackClassName, style, ...rest } = props;
  const fallbackInitial = name.trim().charAt(0) || "?";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-primary-default",
        className,
      )}
      style={{ width: size, height: size, ...style }}
      {...rest}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? `${name} 프로필 이미지`}
          width={size}
          height={size}
          className={cn("size-full object-cover", imageClassName)}
        />
      ) : (
        <span aria-hidden className={fallbackClassName}>
          {fallbackInitial}
        </span>
      )}
    </div>
  );
}
