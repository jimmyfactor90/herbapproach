"use server";

import cloudinary, { extractPublicId } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth-server";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export async function uploadImageAction(formData: FormData): Promise<string> {
  await requireAdmin();

  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error("Unsupported image type");
  if (file.size > MAX_FILE_SIZE) throw new Error("Image must be under 8MB");

  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "herbapproach",
    resource_type: "image",
  });

  return result.secure_url;
}

export async function deleteImageAction(url: string): Promise<void> {
  await requireAdmin();
  const publicId = extractPublicId(url);
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
}
