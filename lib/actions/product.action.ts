"use server";
import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";

// get latest products

export const getLatestProducts = async () => {
  const data = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return convertToPlainObject(data);
};

//get product details

export const getProductDetails = async (slug: string) => {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
};
