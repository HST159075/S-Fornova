import prisma from "../../lib/prisma.js";

const getWishlist = async (userId: string) => {
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          discountPrice: true,
          images: true,
          ratings: true,
          numReviews: true,
          stock: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return items.map((i) => i.product);
};

const toggleWishlist = async (userId: string, productId: string) => {
  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({
      where: { userId_productId: { userId, productId } },
    });
    return { action: "removed", message: "Removed from wishlist" };
  }

  await prisma.wishlistItem.create({
    data: { userId, productId },
  });
  return { action: "added", message: "Added to wishlist" };
};

const clearWishlist = async (userId: string) => {
  return await prisma.wishlistItem.deleteMany({ where: { userId } });
};

export const wishlistService = {
  getWishlist,
  toggleWishlist,
  clearWishlist,
};
