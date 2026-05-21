import BookOpenTextIcon from "@/assets/icons/book-open-text.svg";
import BookmarkSimpleIcon from "@/assets/icons/bookmark-simple.svg";
import QuestionIcon from "@/assets/icons/question.svg";
import UserIcon from "@/assets/icons/user.svg";
import type { MenuListItem } from "@/shared/ui";

export const MYPAGE_MENU_ITEMS: MenuListItem[] = [
  { id: "report", label: "호구 보고서", href: "/mypage/report", icon: BookOpenTextIcon },
  { id: "history", label: "히스토리", href: "/mypage/history", icon: BookmarkSimpleIcon },
  { id: "account", label: "계정 관리", href: "/mypage/account", icon: UserIcon, iconStrokeWidth: false },
  { id: "support", label: "이용 문의", icon: QuestionIcon },
];
