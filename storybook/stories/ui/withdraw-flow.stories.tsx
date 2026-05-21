import type { Meta, StoryObj } from "@storybook/react";

import {
  UserDeleteCompleteModal,
  UserDeleteConfirmModal,
  UserDeleteFailedModal,
  UserDeleteModal,
  UserDeleteReasonModal,
} from "@/features/mypage/withdrawal/ui";

const baseArgs = {
  open: true,
  onClose: () => {},
  onConfirmDelete: () => true,
};

const meta = {
  title: "UI/WithdrawFlow",
  component: UserDeleteModal,
  tags: ["autodocs"],
  args: baseArgs,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-screen items-center justify-center bg-bg-02 p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Step1Confirm: Story = {
  render: () => <UserDeleteConfirmModal open onClose={() => {}} onConfirmDelete={() => {}} />,
  parameters: {
    docs: {
      description: {
        story: "탈퇴 확인(취소/탈퇴하기) 모달",
      },
    },
  },
};

export const Step2ReasonSelected: Story = {
  render: () => <UserDeleteReasonModal open onClose={() => {}} onConfirmDelete={() => {}} initialReason="not_useful" />,
  parameters: {
    docs: {
      description: {
        story: "탈퇴 사유 선택(콘텐츠가 부족해요 선택) 모달",
      },
    },
  },
};

export const Step3ReasonOther: Story = {
  render: () => (
    <UserDeleteReasonModal
      open
      onClose={() => {}}
      onConfirmDelete={() => {}}
      initialReason="other"
      initialReasonDetail=""
    />
  ),
  parameters: {
    docs: {
      description: {
        story: "탈퇴 사유 기타 선택 + 입력 필드 노출 모달",
      },
    },
  },
};

export const Step4Success: Story = {
  render: () => <UserDeleteCompleteModal open onGoHome={() => {}} />,
  parameters: {
    docs: {
      description: {
        story: "탈퇴 완료 모달",
      },
    },
  },
};

export const Step5Failure: Story = {
  render: () => <UserDeleteFailedModal open onClose={() => {}} onRetry={() => {}} />,
  parameters: {
    docs: {
      description: {
        story: "탈퇴 실패(취소/재시도) 모달",
      },
    },
  },
};

export const FlowPlayground: Story = {
  render: () => <UserDeleteModal open onClose={() => {}} onConfirmDelete={() => true} />,
  parameters: {
    docs: {
      description: {
        story: "1→2/3→(성공4|실패5) 플로우를 UserDeleteModal 단일 진입점으로 구성한 예시입니다.",
      },
    },
  },
};
