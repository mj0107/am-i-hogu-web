import type { HoguLevel } from "@/features/mypage/profile/model";

export const HOGU_LEVEL_LABEL: Record<HoguLevel, string> = {
  SAFE: "안전형",
  CAUTIOUS: "주의형",
  WARNING: "경고형",
  RISKY: "양보 과다형",
  CRITICAL: "위험형",
  NONE: "집계 대기",
};
