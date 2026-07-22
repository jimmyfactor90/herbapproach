import { ProductRepository } from "../repositories/product.repository";

export class ProductService {
  private repo = new ProductRepository();

  async getFeaturedProducts(limit: number = 4) {
    return this.repo.findFeatured(limit);
  }

  async getLatestProducts(limit: number = 8) {
    return this.repo.findLatest(limit);
  }

  async getProductDetails(slug: string) {
    return this.repo.findBySlug(slug);
  }

  async searchProducts(query: string, limit: number = 20) {
    return this.repo.findAll({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
        ],
        isActive: true,
      },
      take: limit,
    });
  }

  async getShopProducts(params: {
    category?: string;
    strainType?: string;
    potency?: string;
    minPrice?: number;
    maxPrice?: number;
    weight?: number;
    inStock?: boolean;
    onSale?: boolean;
    page?: number;
    pageSize?: number;
    sort?: "price_asc" | "price_desc" | "newest";
  }) {
    const { page = 1, pageSize = 12 } = params;
    const skip = (page - 1) * pageSize;

    const where: any = { isActive: true };

    if (params.category) {
      where.category = {
        OR: [{ slug: params.category }, { parent: { slug: params.category } }],
      };
    }
    if (params.strainType) where.strainType = params.strainType;
    if (params.potency) where.potency = params.potency;
    if (params.weight !== undefined) where.weight = params.weight;
    if (params.inStock) where.inventory = { quantity: { gt: 0 } };
    // comparePrice is only ever set by the admin when a product is actually discounted,
    // so its presence is used as the "on sale" signal (see calculateDiscount in lib/utils.ts).
    if (params.onSale) where.comparePrice = { gt: 0 };

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      where.price = {};
      if (params.minPrice !== undefined) where.price.gte = params.minPrice;
      if (params.maxPrice !== undefined) where.price.lte = params.maxPrice;
    }

    let orderBy: any = { createdAt: "desc" };
    if (params.sort === "price_asc") orderBy = { price: "asc" };
    if (params.sort === "price_desc") orderBy = { price: "desc" };

    const [products, total] = await Promise.all([
      this.repo.findAll({ where, orderBy, take: pageSize, skip }),
      this.repo.count(where),
    ]);

    return {
      products,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async createProduct(data: any) {
    return this.repo.create(data);
  }

  async updateProduct(id: string, data: any) {
    return this.repo.update(id, data);
  }

  async deleteProduct(id: string) {
    return this.repo.delete(id);
  }
}
