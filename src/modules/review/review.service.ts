import prisma from "../../lib/prisma.js";

interface CreateReviewData {
  productId: string;
  rating: number;
  title?: string;
  comment: string;
}

const getReviewsByProduct = async (productId: string) => {
  return await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });
};

const createReview = async (userId: string, data: CreateReviewData) => {
  const { productId, rating, title, comment } = data;

  const review = await prisma.review.create({
    data: { userId, productId, rating, title, comment },
    include: { user: { select: { id: true, name: true, image: true } } },
  });

  // Recalculate product ratings
  const agg = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { id: true },
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      ratings: Math.round((Number(agg._avg.rating) || 0) * 10) / 10,
      numReviews: agg._count.id,
    },
  });

  return review;
};

const deleteReview = async (id: string, userId: string, role: string) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new Error("Review not found");

  if (review.userId !== userId && role !== "ADMIN") {
    throw new Error("Not authorized");
  }

  await prisma.review.delete({ where: { id } });

  // Recalculate ratings
  const agg = await prisma.review.aggregate({
    where: { productId: review.productId },
    _avg: { rating: true },
    _count: { id: true },
  });

  await prisma.product.update({
    where: { id: review.productId },
    data: {
      ratings: Math.round((Number(agg._avg.rating) || 0) * 10) / 10,
      numReviews: agg._count.id,
    },
  });
  return { message: "Review deleted" };
};

export const reviewService = {
  getReviewsByProduct,
  createReview,
  deleteReview,
};
