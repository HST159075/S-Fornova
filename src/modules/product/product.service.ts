import prisma from "../../lib/prisma.js";

const toSlug = (str: string) => str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const getProducts = async (query: any) => {
  const { page = "1", limit = "12", search, category, minPrice, maxPrice, sort = "createdAt_desc", featured, inStock } = query;
  const pageNum = Math.max(1, parseInt(page as string));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
  const skip = (pageNum - 1) * limitNum;

  const where: any = { isActive: true };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { tags: { has: search } },
    ];
  }
  if (category) where.categoryId = category;
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice as string);
    if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
  }
  if (featured === "true") where.isFeatured = true;
  if (inStock === "true") where.stock = { gt: 0 };

  const sortMap: Record<string, any> = {
    createdAt_desc: { createdAt: "desc" },
    createdAt_asc: { createdAt: "asc" },
    price_asc: { price: "asc" },
    price_desc: { price: "desc" },
    ratings_desc: { ratings: "desc" },
    sold_desc: { sold: "desc" },
  };
  const orderBy = sortMap[sort as string] || { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where, orderBy, skip, take: limitNum,
      include: { category: { select: { id: true, name: true, slug: true } } },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, pageNum, limitNum };
};

const getFeaturedProducts = async () => {
  return await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: { category: { select: { id: true, name: true, slug: true } } },
    take: 8,
    orderBy: { sold: "desc" },
  });
};

const getProductById = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
    include: { category: { select: { id: true, name: true, slug: true } } },
  });
};

const createProduct = async (data: any) => {
  return await prisma.product.create({
    data: {
      ...data,
      slug: toSlug(data.name),
      price: parseFloat(data.price),
      discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : null,
      stock: parseInt(data.stock),
      images: data.images || [],
      material: data.material || [],
      colors: data.colors || [],
      tags: data.tags || [],
      isFeatured: data.isFeatured || false,
      dimensionUnit: data.dimensionUnit || "cm",
    },
    include: { category: { select: { id: true, name: true, slug: true } } },
  });
};

const updateProduct = async (id: string, data: any) => {
  if (data.price) data.price = parseFloat(data.price);
  if (data.discountPrice) data.discountPrice = parseFloat(data.discountPrice);
  if (data.stock !== undefined) data.stock = parseInt(data.stock);
  if (data.name) data.slug = toSlug(data.name);

  return await prisma.product.update({
    where: { id },
    data,
    include: { category: { select: { id: true, name: true } } },
  });
};

const deleteProduct = async (id: string) => {
  return await prisma.product.delete({ where: { id } });
};

export const productService = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
