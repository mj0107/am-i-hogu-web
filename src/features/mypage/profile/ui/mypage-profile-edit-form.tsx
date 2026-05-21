"use client";

import { useState } from "react";
import CameraIcon from "@/assets/icons/camera-fill.svg";
import type { MypageProfileEditFormProps } from "@/features/mypage/profile/model";
import { Button, EditableAvatar, Textfield } from "@/shared/ui";

const MAX_NICKNAME_LENGTH = 20;

export function MypageProfileEditForm({ profile }: MypageProfileEditFormProps) {
  const [nickname, setNickname] = useState(profile.nickname);

  return (
    <form className="flex min-h-[calc(100dvh-108px)] flex-col px-common-padding py-8">
      <section className="flex flex-1 flex-col gap-14" aria-labelledby="profile-edit-heading">
        <h1 id="profile-edit-heading" className="sr-only">
          프로필 편집
        </h1>
        <div className="flex justify-center">
          <EditableAvatar
            name={profile.nickname}
            src={profile.avatarUrl}
            size={120}
            fallbackClassName="text-title1-b"
            actionLabel="수정"
            actionIcon={<CameraIcon aria-hidden className="size-4" />}
          />
        </div>

        <Textfield
          id="nickname"
          title="닉네임"
          value={nickname}
          maxLength={MAX_NICKNAME_LENGTH}
          showCount
          helperText="한글 및 영문, 숫자 최대 20자까지 입력할 수 있어요."
          onChange={(event) => setNickname(event.target.value)}
        />
      </section>

      <Button type="submit" fullWidth>
        저장하기
      </Button>
    </form>
  );
}
