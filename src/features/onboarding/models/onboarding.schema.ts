import { z } from "zod";

export const onboardingSchema = z.object({
  nickname: z
    .string()
    .refine((val) => val.trim().length > 0, {
      message: "닉네임을 입력해주세요.",
    })
    .min(2, "2자 이상 20자 이하의 한글, 영문, 숫자만 사용해주세요.")
    .max(20, "2자 이상 20자 이하의 한글, 영문, 숫자만 사용해주세요.")
    .regex(/^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]+$/, "특수문자는 입력할 수 없습니다.")
    .regex(/^[a-zA-Z0-9가-힣]+$/, "단어 또는 문장 형태로 입력해주세요."),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
