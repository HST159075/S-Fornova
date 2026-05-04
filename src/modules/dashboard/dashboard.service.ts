import prisma from "../../lib/prisma.js";

const getStats = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalOrders,
    totalUsers,
    totalProducts,
    totalReviews,
    revenueAgg,
    thisMonthOrders,
    lastMonthOrders,
    thisMonthRevenue,
    lastMonthRevenue,
    pendingOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.review.count(),
    prisma.order.aggregate({
      where: { isPaid: true },
      _sum: { totalPrice: true },
    }),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.count({ where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } } }),
    prisma.order.aggregate({
      where: { isPaid: true, createdAt: { gte: startOfMonth } },
      _sum: { totalPrice: true },
    }),
    prisma.order.aggregate({
      where: { isPaid: true, createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
      _sum: { totalPrice: true },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyOrders = await prisma.order.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { totalPrice: true, isPaid: true, createdAt: true },
  });

  const monthlyMap: Record<string, { label: string; revenue: number; orders: number }> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
    monthlyMap[key] = { label, revenue: 0, orders: 0 };
  }

  monthlyOrders.forEach((order) => {
    const d = new Date(order.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (monthlyMap[key]) {
      monthlyMap[key].orders += 1;
      if (order.isPaid) {
        monthlyMap[key].revenue += parseFloat(order.totalPrice.toString());
      }
    }
  });

  const monthlyRevenue = Object.values(monthlyMap);

  const statusGroups = await prisma.order.groupBy({
    by: ["status"],
    _count: { id: true },
  });
  const ordersByStatus = statusGroups.map((g) => ({
    status: g.status,
    count: g._count.id,
  }));

  const topProducts = await prisma.product.findMany({
    orderBy: { sold: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      sold: true,
      price: true,
      discountPrice: true,
      images: true,
      ratings: true,
    },
  });

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: { take: 1 },
    },
  });

  const lowStockProducts = await prisma.product.findMany({
    where: { stock: { lt: 5 }, isActive: true },
    select: { id: true, name: true, stock: true, images: true, sku: true },
    orderBy: { stock: "asc" },
    take: 10,
  });

  return {
    overview: {
      totalOrders,
      totalUsers,
      totalProducts,
      totalReviews,
      totalRevenue: parseFloat((revenueAgg._sum.totalPrice || 0).toString()),
      pendingOrders,
      thisMonthOrders,
      lastMonthOrders,
      thisMonthRevenue: parseFloat((thisMonthRevenue._sum.totalPrice || 0).toString()),
      lastMonthRevenue: parseFloat((lastMonthRevenue._sum.totalPrice || 0).toString()),
    },
    monthlyRevenue,
    ordersByStatus,
    topProducts,
    recentOrders,
    lowStockProducts,
  };
};

export const dashboardService = {
  getStats,
};
