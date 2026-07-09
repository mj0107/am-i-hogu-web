import { z } from "zod";
import { nicknameSchema } from "@/shared/model/nickname.schema";

export const onboardingSchema = z.object({
  nickname: nicknameSchema,
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
