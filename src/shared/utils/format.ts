import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.locale("ko");

const RELATIVE_TIME_FUTURE_GRACE_MS = 60_000;
const EDITED_TIMESTAMP_THRESHOLD_MS = 1_000;

function hasTimezone(date: string) {
  return /(?:Z|[+-]\d{2}:?\d{2})$/i.test(date);
}

// 1분 전, 1시간 전 ....
export function formatRelativeTime(date: string | Date) {
  const targetDate = date instanceof Date ? dayjs(date) : hasTimezone(date) ? dayjs.utc(date).local() : dayjs(date);
  const futureDiffMs = targetDate.diff(dayjs());

  if (futureDiffMs > 0 && futureDiffMs <= RELATIVE_TIME_FUTURE_GRACE_MS) {
    return "방금 전";
  }

  return targetDate.fromNow();
}

export function isEditedByTimestamp(createdAt: string | Date, updatedAt: string | Date) {
  const createdDate = createdAt instanceof Date ? dayjs(createdAt) : dayjs(createdAt);
  const updatedDate = updatedAt instanceof Date ? dayjs(updatedAt) : dayjs(updatedAt);

  return Math.abs(updatedDate.diff(createdDate)) >= EDITED_TIMESTAMP_THRESHOLD_MS;
}

// 1234 -> 1,234
export function formatNumber(value: number) {
  return value.toLocaleString("ko-KR");
}
