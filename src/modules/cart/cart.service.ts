import prisma from "../../lib/prisma.js";

const getCart = async (userId: string) => {
  return await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          discountPrice: true,
          images: true,
          stock: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const addToCart = async (userId: string, productId: string, quantity: number = 1) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found");
  if (product.stock < quantity) throw new Error("Not enough stock");

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    return await prisma.cartItem.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity: existing.quantity + quantity },
      include: { product: { select: { id: true, name: true, price: true, images: true } } },
    });
  } else {
    return await prisma.cartItem.create({
      data: { userId, productId, quantity },
      include: { product: { select: { id: true, name: true, price: true, images: true } } },
    });
  }
};

const updateQuantity = async (userId: string, productId: string, quantity: number) => {
  if (quantity < 1) {
    await prisma.cartItem.delete({
      where: { userId_productId: { userId, productId } },
    });
    return { message: "Item removed from cart" };
  }
  return await prisma.cartItem.update({
    where: { userId_productId: { userId, productId } },
    data: { quantity },
  });
};

const removeFromCart = async (userId: string, productId: string) => {
  return await prisma.cartItem.delete({
    where: { userId_productId: { userId, productId } },
  });
};

const clearCart = async (userId: string) => {
  return await prisma.cartItem.deleteMany({ where: { userId } });
};

export const cartService = {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
};
