import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export class ProductRepository {
  async findAll(params: {
    where?: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
    take?: number;
    skip?: number;
    include?: Prisma.ProductInclude;
  }) {
    return prisma.product.findMany({
      where: params.where,
      orderBy: params.orderBy || { createdAt: "desc" },
      take: params.take,
      skip: params.skip,
      include: params.include || {
        category: true,
        images: true,
        inventory: true,
        reviews: { where: { isApproved: true }, select: { rating: true } },
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true,
        inventory: true,
        variants: { orderBy: { weight: "asc" } },
        reviews: {
          include: { user: true },
          where: { isApproved: true },
        },
      },
    });
  }

  async count(where?: Prisma.ProductWhereInput) {
    return prisma.product.count({ where });
  }

  async findFeatured(limit: number = 8) {
    return this.findAll({
      where: { featured: true, isActive: true },
      take: limit,
    });
  }

  async findLatest(limit: number = 8) {
    return this.findAll({
      where: { isActive: true },
      take: limit,
    });
  }

  async findByCategories(categorySlugs: string[], limit: number = 10) {
    return this.findAll({
      where: {
        category: { slug: { in: categorySlugs } },
        isActive: true,
      },
      take: limit,
    });
  }

  async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({
      data,
      include: { category: true, images: true, inventory: true },
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
      include: { category: true, images: true, inventory: true },
    });
  }

  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }
}
