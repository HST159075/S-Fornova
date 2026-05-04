import prisma from "../../lib/prisma.js";

const getAllUsers = async (query: any) => {
  const { page = "1", limit = "20", search, role } = query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: "insensitive" } },
      { email: { contains: search as string, mode: "insensitive" } },
    ];
  }
  if (role) where.role = role as any;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        phone: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        _count: { select: { orders: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, pageNum, limitNum };
};

const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      address: true,
      orders: { take: 5, orderBy: { createdAt: "desc" } },
      _count: { select: { orders: true, reviews: true } },
    },
  });
};

const updateUserRole = async (id: string, role: string) => {
  if (!["USER", "MANAGER", "ADMIN"].includes(role)) {
    throw new Error("Invalid role");
  }
  return await prisma.user.update({
    where: { id },
    data: { role: role as any },
  });
};

const updateUserStatus = async (id: string, isActive: boolean) => {
  return await prisma.user.update({
    where: { id },
    data: { isActive },
  });
};

export const userService = {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
};
