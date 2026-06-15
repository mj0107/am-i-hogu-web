import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { checkNickname } from "@/features/onboarding/api";
import { type OnboardingFormData, onboardingSchema } from "@/features/onboarding/models";
import { getNicknameCheckErrorMessage } from "@/features/onboarding/utils";
import { toApiError } from "@/shared/api";

const NICKNAME_CHECK_DELAY_MS = 500;

export function useOnboardingForm() {
  const [isNicknameCheckPending, setIsNicknameCheckPending] = useState(false);
  const latestCheckIdRef = useRef(0);
  const {
    clearErrors,
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      nickname: "",
    },
    mode: "onChange",
  });

  const nicknameValue = watch("nickname");
  const nicknameError = errors.nickname;
  const errorMessage = nicknameError?.message;
  const hasNicknameFormatError = Boolean(nicknameError && nicknameError.type !== "server");

  useEffect(() => {
    if (!nicknameValue || hasNicknameFormatError) {
      latestCheckIdRef.current += 1;
      setIsNicknameCheckPending(false);
      return;
    }

    const checkId = latestCheckIdRef.current + 1;
    latestCheckIdRef.current = checkId;
    setIsNicknameCheckPending(true);

    // Debouncing을 위한 timer
    const timeoutId = window.setTimeout(async () => {
      try {
        const result = await checkNickname(nicknameValue);

        // 마지막 요청이 아닐 경우 중지한다.
        if (latestCheckIdRef.current !== checkId) {
          return;
        }

        if (!result.isAvailable) {
          setError("nickname", {
            type: "server",
            message: "중복된 닉네임입니다.",
          });
          return;
        }

        clearErrors("nickname");
      } catch (error) {
        if (latestCheckIdRef.current !== checkId) {
          return;
        }

        const apiError = toApiError(error);

        setError("nickname", {
          type: "server",
          message: getNicknameCheckErrorMessage(apiError.data),
        });
      } finally {
        if (latestCheckIdRef.current === checkId) {
          setIsNicknameCheckPending(false);
        }
      }
    }, NICKNAME_CHECK_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [clearErrors, hasNicknameFormatError, nicknameValue, setError]);

  const getHelperState = () => {
    if (!nicknameValue) {
      return {
        helperText: "한글 및 영문, 숫자 최대 20자까지 입력할 수 있어요.",
        tone: "default" as const,
      };
    }

    if (isNicknameCheckPending) {
      return {
        helperText: "닉네임 중복 확인 중입니다.",
        tone: "default" as const,
      };
    }

    if (errorMessage) {
      if (errorMessage === "중복된 닉네임입니다.") {
        return {
          helperText: errorMessage,
          tone: "warning" as const,
        };
      }
      return {
        helperText: errorMessage,
        tone: "danger" as const,
      };
    }

    return {
      helperText: "사용 가능한 닉네임입니다.",
      tone: "success" as const,
    };
  };

  return {
    control,
    handleSubmit,
    isNicknameCheckPending,
    isSubmitting,
    isValid,
    setError,
    ...getHelperState(),
  };
}
