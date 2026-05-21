import type { MypageUserResponse } from "@/features/mypage/profile/model";
import { HOGU_LEVEL_LABEL } from "@/features/mypage/report/constants";
import type {
  HoguCategoryBreakdown,
  HoguIndex,
  MypageReportResponse,
  MypageStats,
} from "@/features/mypage/report/model/mypage-report.types";
import { toPostCategoryLabel } from "@/features/post/constants";

export function toHoguIndex(
  response: Pick<MypageUserResponse, "hoguIndex" | "hoguLevel" | "hoguShortDescription">,
): HoguIndex {
  return {
    score: response.hoguIndex,
    label: HOGU_LEVEL_LABEL[response.hoguLevel],
    summary: response.hoguShortDescription,
  };
}

export function toReportHoguIndex(response: MypageReportResponse): HoguIndex {
  return {
    ...toHoguIndex(response),
    description: response.hoguDescription,
  };
}

export function toHoguCategoryBreakdown(response: MypageReportResponse): HoguCategoryBreakdown[] {
  return response.categoryAnalysis.map((analysis) => ({
    id: analysis.category,
    label: toPostCategoryLabel(analysis.category),
    percentage: analysis.hoguIndex,
  }));
}

export function toMypageStats(response: MypageReportResponse): MypageStats {
  return {
    postCount: response.totalPostCount,
    hoguVoteCount: response.hoguPostCount,
    notHoguVoteCount: response.notHoguPostCount,
  };
}
