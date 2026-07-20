import { prisma } from "@/lib/prisma";

export async function getSalesReport(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate },
      status: "COMPLETED" // Only count actual revenue
    },
    include: {
      items: {
        include: {
           product: true
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Group by day for charts
  const salesByDay = orders.reduce((acc: any, order) => {
    const day = order.createdAt.toISOString().split('T')[0];
    acc[day] = (acc[day] || 0) + order.total;
    return acc;
  }, {});

  // Top Selling Products
  const productSales: any = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      productSales[item.product.name] = (productSales[item.product.name] || 0) + item.total;
    });
  });

  const topProducts = Object.entries(productSales)
    .map(([name, total]) => ({ name, total: total as number }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return {
    totalRevenue,
    totalOrders,
    avgOrderValue,
    salesByDay: Object.entries(salesByDay).map(([date, total]) => ({ date, total: total as number })),
    topProducts,
    recentOrders: orders.slice(-10).reverse()
  };
}
