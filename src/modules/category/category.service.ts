import prisma from "../../lib/prisma.js";

const toSlug = (str: string) => str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const getCategories = async () => {
  return await prisma.category.findMany({
    where: { isActive: true },
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
};

const getCategoryById = async (id: string) => {
  return await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
};

const createCategory = async (data: any) => {
  const { name, description, image } = data;
  return await prisma.category.create({
    data: { name, slug: toSlug(name), description, image },
  });
};

const updateCategory = async (id: string, data: any) => {
  const { name, description, image, isActive } = data;
  return await prisma.category.update({
    where: { id },
    data: {
      ...(name && { name, slug: toSlug(name) }),
      ...(description !== undefined && { description }),
      ...(image !== undefined && { image }),
      ...(isActive !== undefined && { isActive }),
    },
  });
};

const deleteCategory = async (id: string) => {
  return await prisma.category.delete({ where: { id } });
};

export const categoryService = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
