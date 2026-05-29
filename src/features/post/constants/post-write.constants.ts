export const POST_WRITE_TITLE_LIMIT = 50;

const POST_WRITE_IMAGE_SLOT_COUNT = 4;
const POST_WRITE_IMAGE_SLOT_IDS = Array.from(
  { length: POST_WRITE_IMAGE_SLOT_COUNT },
  (_, order) => `post-image-slot-${order + 1}`,
);

export const POST_WRITE_IMAGE_SLOT_ITEMS = POST_WRITE_IMAGE_SLOT_IDS.map((slotId, index) => ({
  id: slotId,
  "aria-label": `이미지 추가 ${index + 1}`,
}));
