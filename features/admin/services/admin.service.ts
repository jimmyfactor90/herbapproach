import { prisma } from "@/lib/prisma";

export class AdminService {
  async getDashboardStats() {
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      totalSales,
      pendingOrders,
      lowStockProducts
    ] = await Promise.all([
      prisma.order.count(),
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { payment: { status: "COMPLETED" } }
      }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.inventory.count({
        where: {
          quantity: { lte: 5 } // Hardcoded threshold for simplicity
        }
      })
    ]);

    // Simplified monthly sales chart data
    const salesData = [
      { month: "Jan", sales: 4500 },
      { month: "Feb", sales: 5200 },
      { month: "Mar", sales: 4800 },
      { month: "Apr", sales: 6100 },
      { month: "May", sales: 5900 },
      { month: "Jun", sales: 7400 },
    ];

    return {
      stats: {
        totalOrders,
        totalUsers,
        totalProducts,
        totalSales: totalSales._sum.total || 0,
        pendingOrders,
        lowStockProducts,
      },
      salesData
    };
  }

  async getRecentOrders(limit: number = 5) {
    return prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        payment: true
      }
    });
  }

  async getAllOrders() {
    return prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        payment: true,
        items: { include: { product: true } },
      },
    });
  }

  async getAllUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async updateUserRole(userId: string, role: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  async deleteUser(userId: string) {
    return prisma.user.delete({
      where: { id: userId },
    });
  }

  async updateOrderStatus(orderId: string, status: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }
}
