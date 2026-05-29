import { z } from "zod";
import { POST_FILTER_OPTIONS, POST_WRITE_TITLE_LIMIT } from "@/features/post/constants";

export const postWriteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "제목을 입력해주세요.")
    .max(POST_WRITE_TITLE_LIMIT, `제목은 ${POST_WRITE_TITLE_LIMIT}자 이하로 입력해주세요.`),
  content: z.string().trim().min(1, "내용을 입력해주세요."),
  selectedCategories: z.array(z.enum(POST_FILTER_OPTIONS)).min(1, "카테고리를 선택해주세요."),
});

export type PostWriteSchemaType = z.infer<typeof postWriteSchema>;
