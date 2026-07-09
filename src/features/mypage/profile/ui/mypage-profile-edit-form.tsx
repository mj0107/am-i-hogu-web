"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CameraIcon from "@/assets/icons/camera-fill.svg";
import { checkNicknameWithAuth, useUpdateProfileMutation } from "@/features/mypage/api";
import {
  MYPAGE_PROFILE_DUPLICATE_NICKNAME_ERROR_MESSAGE,
  MYPAGE_PROFILE_NICKNAME_FIELD_ERROR_MESSAGES,
  MYPAGE_PROFILE_NICKNAME_HELPER_TEXT,
  MYPAGE_PROFILE_NICKNAME_MAX_LENGTH,
  MYPAGE_PROFILE_SAVE_ERROR_MESSAGE,
  MYPAGE_PROFILE_SAVE_SUCCESS_MESSAGE,
} from "@/features/mypage/profile/constants";
import {
  type MypageProfileEditFormData,
  type MypageProfileEditFormProps,
  mypageProfileEditSchema,
} from "@/features/mypage/profile/model";
import { toApiError } from "@/shared/api";
import type { ErrorResponse } from "@/shared/api/generated";
import { useToastStore } from "@/shared/model";
import { Button, EditableAvatar, FooterActionBar, Textfield } from "@/shared/ui";

function getProfileNicknameErrorMessage(errorResponse?: ErrorResponse) {
  if (!errorResponse) {
    return undefined;
  }

  if (errorResponse.code === "DUPLICATE_NICKNAME") {
    return MYPAGE_PROFILE_DUPLICATE_NICKNAME_ERROR_MESSAGE;
  }

  const nicknameErrorCode = errorResponse.errors?.find((error) => error.field === "nickname")?.code;

  return nicknameErrorCode ? MYPAGE_PROFILE_NICKNAME_FIELD_ERROR_MESSAGES[nicknameErrorCode] : undefined;
}

export function MypageProfileEditForm({ profile }: MypageProfileEditFormProps) {
  const router = useRouter();
  const updateProfileMutation = useUpdateProfileMutation();
  const showToast = useToastStore((state) => state.showToast);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<MypageProfileEditFormData>({
    resolver: zodResolver(mypageProfileEditSchema),
    defaultValues: {
      nickname: profile.nickname,
    },
    mode: "onChange",
  });

  const nicknameValue = watch("nickname");
  const normalizedNickname = nicknameValue.trim();
  const originalNickname = profile.nickname.trim();
  const isNicknameChanged = normalizedNickname !== originalNickname;
  const nicknameErrorMessage = errors.nickname?.message;
  const nicknameHelperText =
    nicknameErrorMessage ?? (isNicknameChanged && !isValid ? MYPAGE_PROFILE_NICKNAME_HELPER_TEXT : undefined);
  const isSavePending = isSubmitting || updateProfileMutation.isPending;
  const isSubmitDisabled = !isNicknameChanged || !isValid || isSavePending;

  const handleProfileSubmit = async (data: MypageProfileEditFormData) => {
    const nextNickname = data.nickname.trim();

    if (nextNickname === originalNickname) {
      return;
    }

    setSubmitErrorMessage(null);

    try {
      const { isAvailable } = await checkNicknameWithAuth({ nickname: nextNickname });

      if (!isAvailable) {
        setError("nickname", {
          type: "server",
          message: MYPAGE_PROFILE_DUPLICATE_NICKNAME_ERROR_MESSAGE,
        });
        return;
      }

      await updateProfileMutation.mutateAsync({
        body: {
          nickname: nextNickname,
        },
      });

      showToast({ message: MYPAGE_PROFILE_SAVE_SUCCESS_MESSAGE });
      router.replace("/mypage");
    } catch (error) {
      const apiError = toApiError(error);
      const nicknameApiErrorMessage = getProfileNicknameErrorMessage(apiError.data);

      if (nicknameApiErrorMessage) {
        setError("nickname", {
          type: "server",
          message: nicknameApiErrorMessage,
        });
        return;
      }

      setSubmitErrorMessage(MYPAGE_PROFILE_SAVE_ERROR_MESSAGE);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleProfileSubmit)} className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
      <section
        className="flex min-w-0 flex-1 flex-col gap-14 px-common-padding pb-28 pt-8"
        aria-labelledby="profile-edit-heading"
      >
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

        <Controller
          name="nickname"
          control={control}
          render={({ field }) => (
            <Textfield
              id="nickname"
              title="닉네임"
              value={field.value}
              maxLength={MYPAGE_PROFILE_NICKNAME_MAX_LENGTH}
              showCount
              showClearButton
              helperText={nicknameHelperText}
              tone={nicknameErrorMessage ? "danger" : "default"}
              onChange={field.onChange}
              disabled={isSavePending}
            />
          )}
        />
      </section>

      <FooterActionBar mode="fixed" className="flex flex-col gap-3">
        {submitErrorMessage ? (
          <p className="text-center text-small-m text-danger" role="alert">
            {submitErrorMessage}
          </p>
        ) : null}
        <Button type="submit" disabled={isSubmitDisabled} variant={isSubmitDisabled ? "disabled" : "primary"} fullWidth>
          {isSavePending ? "저장 중" : "저장하기"}
        </Button>
      </FooterActionBar>
    </form>
  );
}
