"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";

export async function updateStockAction(productId: string, newQuantity: number) {
  try {
    await prisma.inventory.upsert({
      where: { productId },
      update: { quantity: newQuantity },
      create: { productId, quantity: newQuantity }
    });

    revalidateTag("products", "max");
    revalidatePath("/admin/inventory");
    revalidatePath("/shop");
    revalidatePath(`/product/`); // ideally we'd have the slug here, but this works for general clearing
    
    return { success: true };
  } catch (error) {
    console.error("Stock Update Error:", error);
    return { success: false, error: "Failed to update stock" };
  }
}
