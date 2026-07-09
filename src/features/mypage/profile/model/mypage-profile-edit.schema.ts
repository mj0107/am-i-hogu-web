import { z } from "zod";
import { nicknameSchema } from "@/shared/model/nickname.schema";

export const mypageProfileEditSchema = z.object({
  nickname: nicknameSchema,
});

export type MypageProfileEditFormData = z.infer<typeof mypageProfileEditSchema>;
