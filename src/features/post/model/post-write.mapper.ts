import { POST_CATEGORY_VALUE_BY_LABEL } from "@/features/post/constants/post-filter.constants";
import type { PostCreateRequest, PostUpdateRequest } from "@/shared/api/generated";
import type { PostFormInitialValues, PostWriteImageItem } from "./post.mapper";
import type { PostWriteSchemaType } from "./post-write.schema";

type PostWriteFormValues = Pick<PostWriteSchemaType, "content" | "selectedCategories" | "title"> & {
  images: PostWriteImageItem[];
};

type PostWriteRequestValues = Pick<PostWriteSchemaType, "content" | "selectedCategories" | "title"> & {
  images: Array<Pick<PostWriteImageItem, "imageUrl" | "isThumbnail">>;
};

function normalizePostWriteValues<T extends Pick<PostWriteFormValues, "content" | "selectedCategories" | "title">>(
  values: T,
) {
  return {
    title: values.title.trim(),
    selectedCategories: values.selectedCategories,
    content: values.content.trim(),
  };
}

function areSameCategories(
  left: PostWriteFormValues["selectedCategories"],
  right: PostWriteFormValues["selectedCategories"],
) {
  return left.length === right.length && left.every((category, index) => category === right[index]);
}

function createPostImageRequests(images: PostWriteRequestValues["images"]) {
  return images
    .filter((image): image is PostWriteRequestValues["images"][number] & { imageUrl: string } =>
      Boolean(image.imageUrl),
    )
    .map((image, index) => ({
      imageUrl: image.imageUrl,
      order: index,
      isThumbnail: image.isThumbnail,
    }));
}

function areSameImages(values: PostWriteRequestValues["images"], initialImages: PostFormInitialValues["images"] = []) {
  if (values.length !== initialImages.length) {
    return false;
  }

  return values.every((image, index) => {
    const initialImage = initialImages[index];

    return image.imageUrl === initialImage.imageUrl && image.isThumbnail === initialImage.isThumbnail;
  });
}

export function createPostCreateRequest(values: PostWriteRequestValues): PostCreateRequest {
  return {
    title: values.title.trim(),
    categories: values.selectedCategories.map((category) => POST_CATEGORY_VALUE_BY_LABEL[category]),
    content: values.content.trim(),
    images: createPostImageRequests(values.images),
  };
}

export function hasPostWriteFormChanged(values: PostWriteFormValues, initialValues?: PostFormInitialValues) {
  if (!initialValues) {
    return true;
  }

  const normalizedValues = normalizePostWriteValues(values);
  const normalizedInitialValues = normalizePostWriteValues(initialValues);

  return (
    normalizedValues.title !== normalizedInitialValues.title ||
    normalizedValues.content !== normalizedInitialValues.content ||
    !areSameCategories(normalizedValues.selectedCategories, normalizedInitialValues.selectedCategories) ||
    !areSameImages(values.images, initialValues.images)
  );
}

export function createPostUpdateRequest(
  values: PostWriteRequestValues,
  initialValues?: PostFormInitialValues,
): PostUpdateRequest {
  const request: PostUpdateRequest = {};
  const normalizedValues = normalizePostWriteValues(values);
  const normalizedInitialValues = initialValues ? normalizePostWriteValues(initialValues) : null;

  // PATCH 요청은 수정된 필드만 담아 불필요한 서버 갱신과 충돌 범위를 줄인다.
  if (!normalizedInitialValues || normalizedValues.title !== normalizedInitialValues.title) {
    request.title = normalizedValues.title;
  }

  if (
    !normalizedInitialValues ||
    !areSameCategories(normalizedValues.selectedCategories, normalizedInitialValues.selectedCategories)
  ) {
    request.categories = normalizedValues.selectedCategories.map((category) => POST_CATEGORY_VALUE_BY_LABEL[category]);
  }

  if (!normalizedInitialValues || normalizedValues.content !== normalizedInitialValues.content) {
    request.content = normalizedValues.content;
  }

  if (!initialValues || !areSameImages(values.images, initialValues.images)) {
    request.images = createPostImageRequests(values.images);
  }

  return request;
}
