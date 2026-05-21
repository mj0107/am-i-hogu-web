import EqualsIcon from "@/assets/icons/equals.svg";
import QuestionIcon from "@/assets/icons/question.svg";
import ThumbsUpIcon from "@/assets/icons/thumbs-up.svg";
import XIcon from "@/assets/icons/x.svg";
import type {
  HistoryResult,
  MypageHistoryTab,
  MyVote,
  VoteSummary,
} from "@/features/mypage/history/model/mypage-history.types";

export const HISTORY_RESULT_BY_VOTE_SUMMARY: Record<VoteSummary, HistoryResult> = {
  HOGU: "hogu",
  NOT_HOGU: "notHogu",
  TIE: "tie",
  NONE: "none",
};

export const HISTORY_RESULT_BY_MY_VOTE: Record<MyVote, HistoryResult> = {
  HOGU: "hogu",
  NOT_HOGU: "notHogu",
};

export const MYPAGE_HISTORY_TABS: { value: MypageHistoryTab; label: string }[] = [
  { value: "posts", label: "내가 쓴 글" },
  { value: "comments", label: "댓글" },
  { value: "bookmarks", label: "북마크" },
  { value: "votes", label: "투표" },
];

export const MYPAGE_HISTORY_RESULT_COPY: Record<
  HistoryResult,
  { label: string; className: string; icon: typeof ThumbsUpIcon }
> = {
  hogu: { label: "호구 맞음", className: "text-secondary-strong", icon: ThumbsUpIcon },
  notHogu: { label: "호구아님", className: "text-primary-light", icon: XIcon },
  tie: { label: "동률", className: "text-text-03", icon: EqualsIcon },
  none: { label: "투표 없음", className: "text-text-02", icon: QuestionIcon },
};
