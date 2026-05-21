import { MYPAGE_USER_RESPONSE_MOCK } from "@/features/mypage/profile/model";
import type { MypageReportResponse } from "@/features/mypage/report/model/mypage-report.types";
import { toHoguCategoryBreakdown, toHoguIndex, toMypageStats, toReportHoguIndex } from "@/features/mypage/report/utils";

export const MYPAGE_REPORT_RESPONSE_MOCK: MypageReportResponse = {
  ...MYPAGE_USER_RESPONSE_MOCK,
  hoguDescription:
    "상대를 배려하다가 본인의 시간, 돈, 감정을 뒤로 미루는 패턴이 보입니다. 좋은 의도와 별개로 반복되면 손해가 커질 수 있으니 조건을 명확히 말하는 연습이 필요해요.",
  categoryAnalysis: [
    { category: "DATING", hoguIndex: 80 },
    { category: "USED_TRADE", hoguIndex: 40 },
  ],
  totalPostCount: 4,
  hoguPostCount: 8,
  notHoguPostCount: 4,
};

export const HOGU_INDEX_MOCK = toHoguIndex(MYPAGE_USER_RESPONSE_MOCK);
export const HOGU_INDEX_DETAIL_MOCK = toReportHoguIndex(MYPAGE_REPORT_RESPONSE_MOCK);
export const HOGU_CATEGORY_BREAKDOWN_MOCK = toHoguCategoryBreakdown(MYPAGE_REPORT_RESPONSE_MOCK);
export const MYPAGE_STATS_MOCK = toMypageStats(MYPAGE_REPORT_RESPONSE_MOCK);
