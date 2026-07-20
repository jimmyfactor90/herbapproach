"use server";

import { ProductService } from "../services/product.service";
import { requireAdmin } from "@/lib/auth-server";
import { revalidatePath, revalidateTag } from "next/cache";
import { slugify } from "@/lib/utils";

export async function createProductAction(data: any) {
  await requireAdmin();
  const productService = new ProductService();
  
  const slug = slugify(data.name);
  
  const result = await productService.createProduct({
    name: data.name,
    slug,
    description: data.description,
    price: data.price,
    comparePrice: data.comparePrice,
    sku: data.sku,
    mainImage: data.mainImage,
    isActive: data.isActive,
    featured: data.featured,
    categoryId: data.categoryId,
    careLevel: data.careLevel,
    sunlight: data.sunlight,
    indoorOutdoor: data.indoorOutdoor,
    size: data.size,
    petFriendly: data.petFriendly,
    inventory: {
      create: {
        quantity: data.quantity,
      }
    },
    images: {
      create: (data.images || []).map((url: string) => ({ url })),
    },
  });

  revalidateTag("products", "max");
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");

  return result;
}

export async function updateProductAction(id: string, data: any) {
  await requireAdmin();
  const productService = new ProductService();
  
  const slug = slugify(data.name);

  const result = await productService.updateProduct(id, {
    name: data.name,
    slug,
    description: data.description,
    price: data.price,
    comparePrice: data.comparePrice,
    sku: data.sku,
    mainImage: data.mainImage,
    isActive: data.isActive,
    featured: data.featured,
    categoryId: data.categoryId,
    careLevel: data.careLevel,
    sunlight: data.sunlight,
    indoorOutdoor: data.indoorOutdoor,
    size: data.size,
    petFriendly: data.petFriendly,
    inventory: {
      update: {
        quantity: data.quantity,
      }
    },
    images: {
      deleteMany: {},
      create: (data.images || []).map((url: string) => ({ url })),
    },
  });

  revalidateTag("products", "max");
  revalidatePath("/admin/products");
  revalidatePath(`/product/${slug}`);
  revalidatePath("/shop");

  return result;
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  const productService = new ProductService();
  
  await productService.deleteProduct(id);

  revalidateTag("products", "max");
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}
