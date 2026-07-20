"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

export async function saveSlideAction(formData: FormData): Promise<void> {
  try {
    const id = formData.get("id") as string;
    const image = formData.get("image") as string;
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const buttonText = formData.get("buttonText") as string;
    const buttonLink = formData.get("buttonLink") as string;
    const order = parseInt(formData.get("order") as string || "0");

    if (id) {
      await prisma.heroSlide.update({
        where: { id },
        data: { image, title, subtitle, buttonText, buttonLink, order }
      });
    } else {
      await prisma.heroSlide.create({
        data: { image, title, subtitle, buttonText, buttonLink, order }
      });
    }

    revalidateTag("hero", "max");
    revalidatePath("/");
    revalidatePath("/admin/hero");
  } catch (error) {
    console.error("Slide Error:", error);
  }
}

export async function deleteSlideAction(id: string) {
  await prisma.heroSlide.delete({ where: { id } });
  revalidateTag("hero", "max");
  revalidatePath("/");
  revalidatePath("/admin/hero");
}
