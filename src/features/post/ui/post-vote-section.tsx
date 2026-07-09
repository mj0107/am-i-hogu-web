"use client";

import type { ComponentProps } from "react";
import { useState } from "react";
import { cn } from "@/shared/utils";
import { formatNumber } from "@/shared/utils/format";

type VoteId = "HOGU" | "NOT_HOGU";

export type PostVoteOption = {
  id: VoteId;
  label: string;
  emoji: string;
  percent: number;
};

export function _PostVoteSectionForDevOnly() {
  const options: PostVoteOption[] = [
    { id: "HOGU", label: "호구 맞다", emoji: "😢", percent: 70 },
    { id: "NOT_HOGU", label: "아니다", emoji: "🤔", percent: 30 },
  ];

  return <PostVoteSection options={options} totalVotes={1235} initialSelectedId="HOGU" />;
}

export type PostVoteSectionProps = ComponentProps<"section"> & {
  options: PostVoteOption[];
  totalVotes: number;
  initialSelectedId?: VoteId;
  isDisabled?: boolean;
  isVoting?: boolean;
  selectedId?: VoteId | null;
  onVoteSelect?: (id: VoteId) => void;
};

export function PostVoteSection(props: PostVoteSectionProps) {
  const {
    options,
    totalVotes,
    initialSelectedId,
    isDisabled = false,
    isVoting = false,
    selectedId,
    onVoteSelect,
    className,
    ...rest
  } = props;
  const [internalSelectedId, setInternalSelectedId] = useState<VoteId | null>(initialSelectedId ?? null);
  const currentSelectedId = selectedId !== undefined ? selectedId : internalSelectedId;

  const handleSelect = (id: VoteId) => {
    if (onVoteSelect) {
      onVoteSelect(id);
      return;
    }

    setInternalSelectedId((prev) => (prev === id ? null : id));
  };

  const renderVoteRow = (option: PostVoteOption) => {
    const tone = option.id === "HOGU" ? "yellow" : "indigo";
    const isSelected = currentSelectedId === option.id;
    const hasSelection = currentSelectedId !== null;
    const percentage = Math.max(0, Math.min(100, option.percent));
    const isOpposite = hasSelection && !isSelected;

    const overlayClassName = cn(
      tone === "yellow" ? "bg-secondary-default/10" : "bg-primary-light/10",
      isSelected && (tone === "yellow" ? "bg-secondary-default" : "bg-primary-light"),
      isOpposite && (tone === "yellow" ? "bg-secondary-default/20" : "bg-primary-light/20"),
    );
    const surfaceClassName = cn(
      tone === "yellow" ? "bg-secondary-default/3 text-secondary-strong" : "bg-primary-light/3 text-text-04",
      isSelected && (tone === "yellow" ? "bg-secondary-default/10" : "bg-primary-light/10"),
      isOpposite &&
        (tone === "yellow"
          ? "bg-secondary-default/3 text-secondary-strong"
          : "bg-primary-light/3 text-primary-default"),
    );

    return (
      <li key={option.id}>
        <button
          type="button"
          onClick={() => handleSelect(option.id)}
          aria-pressed={isSelected}
          disabled={isDisabled || isVoting}
          className={cn(
            "relative min-w-0 w-full overflow-hidden rounded-full px-[clamp(12px,4vw,16px)] py-4 text-left",
            surfaceClassName,
          )}
        >
          <div
            className={cn("absolute inset-y-0 left-0", overlayClassName)}
            style={{ width: `${percentage}%` }}
            aria-hidden
          />
          <div className="relative z-10 flex min-w-0 flex-wrap items-center justify-between gap-x-2 gap-y-1 text-body-r">
            <span className={cn("min-w-0 break-words", isSelected ? "text-body-sb" : "text-body-m")}>
              {option.label} {option.emoji}
            </span>
            <strong className="shrink-0 text-body-sb">{percentage}%</strong>
          </div>
        </button>
      </li>
    );
  };

  return (
    <section
      className={cn("min-w-0 rounded-lg bg-bg-02 px-[clamp(12px,6vw,24px)] pb-6 pt-10", className)}
      aria-label="판결"
      {...rest}
    >
      <h2 className="break-words text-center text-title2-b text-text-03">판결을 내려주세요</h2>
      <ul className="mt-6 flex flex-col gap-3">{options.map(renderVoteRow)}</ul>
      <p className="mt-6 break-words text-center text-small-m text-text-03">
        {totalVotes > 0
          ? `현재까지 ${formatNumber(totalVotes)}명이 판결에 참여했습니다.`
          : "참여한 인원이 없습니다. 판결에 참여해 주세요!"}
      </p>
    </section>
  );
}
