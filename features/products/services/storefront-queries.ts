import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ProductService } from "./product.service";
import { CategoryService } from "./category.service";

const productService = new ProductService();
const categoryService = new CategoryService();

// Cached read paths for the public storefront only. Admin pages call
// ProductService/CategoryService directly so edits show up immediately there;
// these wrappers exist so the storefront doesn't re-hit Postgres on every
// request, and are invalidated via revalidateTag("products"/"categories")
// from the admin mutation actions.

export const getCachedFeaturedProducts = unstable_cache(
  (limit: number = 8) => productService.getFeaturedProducts(limit),
  ["storefront-featured-products"],
  { tags: ["products"], revalidate: 3600 }
);

export const getCachedShopProducts = unstable_cache(
  (params: Parameters<ProductService["getShopProducts"]>[0]) => productService.getShopProducts(params),
  ["storefront-shop-products"],
  { tags: ["products"], revalidate: 3600 }
);

export const getCachedProductBySlug = unstable_cache(
  (slug: string) => productService.getProductDetails(slug),
  ["storefront-product-by-slug"],
  { tags: ["products"], revalidate: 3600 }
);

export const getCachedCategories = unstable_cache(
  () => categoryService.getAllCategories(),
  ["storefront-categories"],
  { tags: ["categories"], revalidate: 3600 }
);

export const getCachedCategoryBySlug = unstable_cache(
  (slug: string) => categoryService.getCategoryBySlug(slug),
  ["storefront-category-by-slug"],
  { tags: ["categories"], revalidate: 3600 }
);

export const getCachedHeroSlides = unstable_cache(
  () => prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  }),
  ["storefront-hero-slides"],
  { tags: ["hero"], revalidate: 3600 }
);
