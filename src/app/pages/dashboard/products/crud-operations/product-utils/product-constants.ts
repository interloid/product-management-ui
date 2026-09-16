import type { ImageError } from "@/types/product";

export const MAX_IMAGES = 6;
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export function validateImage(file: File): ImageError | null {
  if (
    !ALLOWED_FILE_TYPES.includes(
      file.type as (typeof ALLOWED_FILE_TYPES)[number],
    )
  ) {
    return {
      fileName: file.name,
      fileSize: file.size,
      message: `${file.name} wasn't added`,
      details: "Format not supported. Please use JPG, PNG, or WEBP.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    const formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    return {
      fileName: file.name,
      fileSize: file.size,
      message: `${file.name} wasn't added`,
      details: `${formattedSize} exceeds the 5 MB limit (413). Compress it and try again.`,
    };
  }

  return null;
}
