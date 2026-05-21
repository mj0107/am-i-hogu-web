import type { Meta, StoryObj } from "@storybook/react";
import CameraIcon from "@/assets/icons/camera-fill.svg";
import { Avatar, EditableAvatar } from "@/shared/ui";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  args: {
    name: "김호구",
    size: 100,
    fallbackClassName: "text-title1-b",
  },
  argTypes: {
    size: {
      control: { type: "number", min: 24, max: 160, step: 4 },
      description: "아바타의 너비와 높이를 px 단위로 지정합니다.",
    },
    src: {
      control: "text",
      description: "프로필 이미지 URL입니다. 값이 없으면 이름 첫 글자를 표시합니다.",
    },
    name: {
      control: "text",
      description: "대체 텍스트와 fallback initial에 사용할 이름입니다.",
    },
  },
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="bg-bg-01 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fallback: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar name="김호구" size={40} fallbackClassName="text-caption-sb" />
      <Avatar name="김호구" size={80} fallbackClassName="text-title2-b" />
      <Avatar name="김호구" size={120} fallbackClassName="text-title1-b" />
    </div>
  ),
};

export const Editable: Story = {
  render: () => (
    <EditableAvatar
      name="김호구"
      size={120}
      fallbackClassName="text-title1-b"
      actionLabel="수정"
      actionIcon={<CameraIcon aria-hidden className="size-4" />}
    />
  ),
};
