"use client";

import { type ComponentProps, type PointerEvent, useEffect, useRef } from "react";
import { useHorizontalDragScroll } from "@/shared/hooks/use-horizontal-drag-scroll";
import { usePostImageCarouselOrder } from "@/shared/hooks/use-post-image-carousel-order";
import { PostImageTile, type PostImageTileProps } from "@/shared/ui/post-image-tile";
import { cn } from "@/shared/utils";

export type PostImageCarouselItem = Omit<PostImageTileProps, "isRepresentative" | "onPromoteToRepresentative"> & {
  id: string;
  isThumbnail?: boolean;
  onPromoteToRepresentative?: () => void;
};

export type PostImageCarouselProps = {
  title?: string;
  description?: string;
  items: PostImageCarouselItem[];
  titleClassName?: string;
  descriptionClassName?: string;
  viewportClassName?: string;
} & Omit<ComponentProps<"section">, "children">;

export function PostImageCarousel(props: PostImageCarouselProps) {
  const {
    title = "게시물 이미지",
    description = "추천 비율 - 0:0 / 최대 5장, 5MB이하",
    items,
    className,
    titleClassName,
    descriptionClassName,
    viewportClassName,
    ...restProps
  } = props;
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragScroll = useHorizontalDragScroll({
    preventDefaultOnPointerDown: false,
  });
  const { orderedItems, moveToRepresentative, remove } = usePostImageCarouselOrder(items);
  const thumbnailItemId = orderedItems.find((item) => item.isThumbnail)?.id;

  useEffect(() => {
    if (!thumbnailItemId) {
      return;
    }

    viewportRef.current?.scrollTo({ left: 0 });
  }, [thumbnailItemId]);

  const onViewportPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragScroll.handlePointerDown(event, viewportRef.current);
  };

  const onViewportPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    dragScroll.handlePointerUp(event, viewportRef.current);
  };

  return (
    <section className={cn("flex w-full flex-col items-start gap-2", className)} {...restProps}>
      <header className="flex w-full flex-col items-start gap-0.5">
        <h3 className={cn("text-body-m text-text-04", titleClassName)}>{title}</h3>
        <p className={cn("text-caption-m text-text-03", descriptionClassName)}>{description}</p>
      </header>
      <div
        data-drag-scroll="x"
        ref={viewportRef}
        onPointerDown={onViewportPointerDown}
        onPointerMove={(event) => dragScroll.handlePointerMove(event, viewportRef.current)}
        onPointerUp={onViewportPointerEnd}
        onPointerCancel={onViewportPointerEnd}
        onPointerLeave={onViewportPointerEnd}
        onClickCapture={dragScroll.guardClickWhenDragged}
        className={cn(
          "w-full overflow-x-auto overflow-y-hidden no-scrollbar",
          "cursor-grab active:cursor-grabbing",
          viewportClassName,
        )}
        style={{ touchAction: "pan-x" }}
      >
        <div className="flex min-w-max items-center gap-4">
          {orderedItems.map(({ id, isThumbnail, onPromoteToRepresentative, onRemove, ...item }) => (
            <PostImageTile
              key={id}
              {...item}
              isRepresentative={isThumbnail}
              onPromoteToRepresentative={() => {
                onPromoteToRepresentative?.();
                moveToRepresentative(id);
              }}
              onRemove={() => {
                onRemove?.();
                remove(id);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
