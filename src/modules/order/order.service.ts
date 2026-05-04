import { OrderStatus } from "@prisma/client";
import prisma from "../../lib/prisma.js";

const createOrder = async (userId: string, data: any) => {
  const { items, paymentMethod = "CARD", shippingAddress, notes } = data;

  const productIds = items.map((i: any) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });

  if (products.length !== productIds.length) {
    throw new Error("One or more products not found or unavailable");
  }

  for (const item of items) {
    const product = products.find((p: any) => p.id === item.productId);
    if (product!.stock < item.quantity) {
      throw new Error(`Insufficient stock for: ${product!.name}`);
    }
  }

  const itemsPrice = items.reduce((acc: number, item: any) => {
    const product = products.find((p: any) => p.id === item.productId);
    const price = product!.discountPrice
      ? parseFloat(product!.discountPrice.toString())
      : parseFloat(product!.price.toString());
    return acc + price * item.quantity;
  }, 0);

  const shippingPrice = itemsPrice >= 5000 ? 0 : 150;
  const taxPrice = Math.round(itemsPrice * 0.05 * 100) / 100;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        notes,
        shippingName: shippingAddress?.name,
        shippingStreet: shippingAddress?.street,
        shippingCity: shippingAddress?.city,
        shippingState: shippingAddress?.state,
        shippingZip: shippingAddress?.zip,
        shippingCountry: shippingAddress?.country || "Bangladesh",
        shippingPhone: shippingAddress?.phone,
        items: {
          create: items.map((item: any) => {
            const product = products.find((p: any) => p.id === item.productId);
            return {
              productId: item.productId,
              name: product!.name,
              image: product!.images?.[0] || null,
              price: product!.discountPrice
                ? parseFloat(product!.discountPrice.toString())
                : parseFloat(product!.price.toString()),
              quantity: item.quantity,
            };
          }),
        },
      },
      include: { items: true },
    });

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
          sold: { increment: item.quantity },
        },
      });
    }

    return newOrder;
  });
};

const getMyOrders = async (userId: string) => {
  return await prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: { select: { id: true, name: true, images: true } } } } },
    orderBy: { createdAt: "desc" },
  });
};

const getAllOrders = async (query: any) => {
  const { page = "1", limit = "20", status } = query;
  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);

  const where = status ? { status: status as OrderStatus } : {};
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } }, items: true },
      orderBy: { createdAt: "desc" },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, pageNum, limitNum };
};

const getOrderById = async (id: string) => {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      items: { include: { product: { select: { id: true, name: true, images: true } } } },
    },
  });
};

const updateOrderStatus = async (id: string, data: any) => {
  const { status, trackingNumber } = data;
  const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  const updateData = {
    status,
    ...(trackingNumber && { trackingNumber }),
    ...(status === "DELIVERED" && { isDelivered: true, deliveredAt: new Date() }),
  };

  return await prisma.order.update({
    where: { id },
    data: updateData,
  });
};

const markAsPaid = async (id: string, stripePaymentId: string) => {
  return await prisma.order.update({
    where: { id },
    data: { isPaid: true, paidAt: new Date(), stripePaymentId },
  });
};

export const orderService = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  markAsPaid,
};
