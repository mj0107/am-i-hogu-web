import type { MenuListItem } from "@/shared/ui";

export type MypageAccountModalId = "terms" | "version" | "logout";

export type MypageAccountAction = MenuListItem & {
  modalId: MypageAccountModalId;
};

export const MYPAGE_ACCOUNT_ACTIONS: MypageAccountAction[] = [
  { id: "terms", label: "약관 및 개인정보 처리 방침", modalId: "terms" },
  { id: "version", label: "앱 버전", modalId: "version" },
  { id: "logout", label: "로그아웃", modalId: "logout" },
];

export const MYPAGE_ACCOUNT_TERMS_DESCRIPTION = `본 서비스는 이용자의 원활한 서비스 제공을 위해 최소한의 개인정보를 수집하며, 수집되는 정보에는 회원 가입 시 입력한 식별 정보, 서비스 이용 기록, 접속 로그 등이 포함될 수 있습니다. 수집된 개인정보는 회원 관리, 서비스 제공 및 개선, 문의 대응, 부정 이용 방지 등의 목적으로 활용되며, 관련 법령에 따라 안전하게 관리됩니다. 이용자는 언제든지 개인정보의 열람, 수정, 삭제를 요청할 수 있으며, 서비스 내 설정 또는 고객센터를 통해 권리를 행사할 수 있습니다.

회사는 이용자의 개인정보를 보호하기 위해 기술적, 관리적 보호 조치를 적용하고 있으며, 법령에 근거하지 않는 한 제3자에게 개인정보를 제공하지 않습니다. 단, 서비스 제공에 필요한 경우 최소한의 범위 내에서 일부 업무를 외부에 위탁할 수 있으며, 이 경우에도 관련 법령에 따라 안전하게 관리됩니다. 또한 이용자는 서비스 이용 시 타인의 권리를 침해하거나 관련 법령을 위반해서는 안 되며, 이를 위반할 경우 서비스 이용이 제한될 수 있습니다.

본 약관은 서비스 운영에 필요한 사항을 규정하며, 회사는 관련 법령의 변경이나 서비스 정책에 따라 내용을 수정할 수 있습니다. 변경 사항은 사전에 공지되며, 이용자가 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴를 요청할 수 있습니다. 계속해서 서비스를 이용하는 경우 변경된 약관에 동의한 것으로 간주됩니다. 기타 상세한 내용은 별도의 정책 및 안내를 따릅니다.`;
