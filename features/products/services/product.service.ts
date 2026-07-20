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
    careLevel?: string;
    sunlight?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    pageSize?: number;
    sort?: "price_asc" | "price_desc" | "newest";
  }) {
    const { page = 1, pageSize = 12 } = params;
    const skip = (page - 1) * pageSize;

    const where: any = { isActive: true };

    if (params.category) where.category = { slug: params.category };
    if (params.careLevel) where.careLevel = params.careLevel;
    if (params.sunlight) where.sunlight = params.sunlight;
    
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
