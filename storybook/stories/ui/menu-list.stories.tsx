import type { Meta, StoryObj } from "@storybook/react";
import BookOpenTextIcon from "@/assets/icons/book-open-text.svg";
import QuestionIcon from "@/assets/icons/question.svg";
import UserIcon from "@/assets/icons/user.svg";
import { MenuList } from "@/shared/ui";

const meta = {
  title: "UI/MenuList",
  component: MenuList,
  tags: ["autodocs"],
  args: {
    ariaLabel: "메뉴",
    items: [
      { id: "terms", label: "약관 및 개인정보 처리 방침", href: "#", icon: BookOpenTextIcon },
      { id: "account", label: "계정 관리", href: "#", icon: UserIcon, iconStrokeWidth: false },
      { id: "support", label: "이용 문의", icon: QuestionIcon },
    ],
  },
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[343px] bg-bg-01 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MenuList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <MenuList
      ariaLabel="설정 메뉴"
      items={[
        { id: "terms", label: "약관 및 개인정보 처리 방침", href: "#", icon: BookOpenTextIcon },
        { id: "account", label: "계정 관리", href: "#", icon: UserIcon, iconStrokeWidth: false },
        { id: "support", label: "이용 문의", icon: QuestionIcon },
      ]}
    />
  ),
};

export const ButtonItems: Story = {
  render: () => (
    <MenuList
      ariaLabel="액션 메뉴"
      items={[
        { id: "profile", label: "프로필 수정", icon: UserIcon, iconStrokeWidth: false },
        { id: "support", label: "이용 문의", icon: QuestionIcon },
      ]}
      onItemSelect={() => undefined}
    />
  ),
};

export const Plain: Story = {
  render: () => (
    <MenuList
      ariaLabel="계정 관리 메뉴"
      variant="plain"
      items={[
        { id: "terms", label: "약관 및 개인정보 처리 방침" },
        { id: "version", label: "앱 버전" },
        { id: "logout", label: "로그아웃" },
      ]}
      onItemSelect={() => undefined}
    />
  ),
};

export const States: Story = {
  render: () => (
    <MenuList
      ariaLabel="상태 메뉴"
      items={[
        { id: "normal", label: "일반 항목", href: "#", icon: BookOpenTextIcon },
        { id: "disabled", label: "비활성 항목", href: "#", icon: QuestionIcon, disabled: true },
        { id: "danger", label: "위험 항목", icon: UserIcon, iconStrokeWidth: false, danger: true },
      ]}
      onItemSelect={() => undefined}
    />
  ),
};
