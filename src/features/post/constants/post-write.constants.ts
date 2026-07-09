export const POST_WRITE_TITLE_LIMIT = 50;

export const POST_WRITE_IMAGE_LIMIT = 5;
export const POST_WRITE_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;
export const POST_WRITE_IMAGE_ACCEPT = "image/jpeg,image/jpg,image/png,image/webp";
export const POST_WRITE_IMAGE_SUPPORTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"] as const;

const POST_WRITE_IMAGE_SLOT_COUNT = POST_WRITE_IMAGE_LIMIT;
const POST_WRITE_IMAGE_SLOT_IDS = Array.from(
  { length: POST_WRITE_IMAGE_SLOT_COUNT },
  (_, order) => `post-image-slot-${order + 1}`,
);

export const POST_WRITE_IMAGE_SLOT_ITEMS = POST_WRITE_IMAGE_SLOT_IDS.map((slotId, index) => ({
  id: slotId,
  "aria-label": `이미지 추가 ${index + 1}`,
}));
