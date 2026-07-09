import type { MypageUserResponse } from "@/features/mypage/profile/model";
import { HOGU_LEVEL_LABEL } from "@/features/mypage/report/constants";
import type {
  HoguCategoryBreakdown,
  HoguIndex,
  MypageReportResponse,
  MypageStats,
} from "@/features/mypage/report/model/mypage-report.types";
import { toPostCategoryLabel } from "@/features/post/constants";

const PENDING_HOGU_INDEX_SCORE = 0;

export function toHoguIndex(
  response: Pick<MypageUserResponse, "hoguIndex" | "hoguLevel" | "hoguShortDescription">,
): HoguIndex {
  // 백엔드 정책상 투표가 포함된 게시물이 5개 미만이면 hoguLevel이 NONE이며, 점수는 노출하지 않는다.
  const isPendingAggregation = response.hoguLevel === "NONE";

  return {
    score: isPendingAggregation ? PENDING_HOGU_INDEX_SCORE : response.hoguIndex,
    label: HOGU_LEVEL_LABEL[response.hoguLevel],
    summary: response.hoguShortDescription,
    isPendingAggregation,
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
