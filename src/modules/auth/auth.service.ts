import prisma from "../../lib/prisma.js";

const getProfile = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: { address: true },
  });
};

const updateProfile = async (userId: string, data: any) => {
  const { name, phone, image } = data;
  return await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name && { name }),
      ...(phone !== undefined && { phone }),
      ...(image !== undefined && { image }),
    },
  });
};

const updateAddress = async (userId: string, data: any) => {
  const { street, city, state, zip, country } = data;
  return await prisma.address.upsert({
    where: { userId },
    update: { street, city, state, zip, country },
    create: { userId, street, city, state, zip, country },
  });
};

export const authService = {
  getProfile,
  updateProfile,
  updateAddress,
};
