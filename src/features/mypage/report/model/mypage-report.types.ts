import type { ReactNode } from "react";
import type { MypageUserResponse } from "@/features/mypage/profile/model";
import type { PostCategoryValue } from "@/features/post/constants";

export type MypageReportResponse = MypageUserResponse & {
  hoguDescription: string;
  categoryAnalysis: {
    category: PostCategoryValue;
    hoguIndex: number;
  }[];
  totalPostCount: number;
  hoguPostCount: number;
  notHoguPostCount: number;
};

export type HoguIndex = {
  score: number;
  label: string;
  summary: string;
  description?: string;
};

export type HoguCategoryBreakdown = {
  id: string;
  label: string;
  percentage: number;
};

export type MypageStats = {
  postCount: number;
  hoguVoteCount: number;
  notHoguVoteCount: number;
};

export type HoguIndexCardProps = {
  index: HoguIndex;
  variant?: "compact" | "detail";
  className?: string;
};

export type HoguIndexProgressProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
  progressClassName?: string;
  className?: string;
  children: ReactNode;
};

export type MypageReportSectionProps = {
  categories: HoguCategoryBreakdown[];
  stats: MypageStats;
};
