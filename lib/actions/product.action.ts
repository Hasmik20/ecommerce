"use server";
import { prisma } from "@/db/prisma";
import { convertToPlainObject, formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { insertProductsSchema, updateProductSchema } from "../validators";
import { Prisma } from "@prisma/client";

// get latest products

export const getLatestProducts = async () => {
  const data = await prisma.product.findMany({
    take: 6,
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

// Get all products
export async function getAllProducts({
  query,
  limit = 3,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  category: string;
  limit?: number;
  page: number;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  // Filter by query
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== "all"
      ? {
          name: {
            contains: query,
            mode: "insensitive",
          } as Prisma.StringFilter,
        }
      : {};

  // Filter by category
  const categoryFilter = category && category !== "all" ? { category } : {};

  // Filter by price
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== "all"
      ? {
          price: {
            gte: Number(price.split("-")[0]),
            lte: Number(price.split("-")[1]),
          },
        }
      : {};

  // Filter by rating
  const ratingFilter =
    rating && rating !== "all" ? { rating: { gte: Number(rating) } } : {};

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    orderBy:
      sort === "lowest"
        ? { price: "asc" }
        : sort === "highest"
          ? { price: "desc" }
          : sort === "rating"
            ? { rating: "desc" }
            : { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete Product
export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) throw new Error("Product not found");

    await prisma.product.delete({ where: { id } });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//create product action

export const createProduct = async (
  data: z.infer<typeof insertProductsSchema>
) => {
  try {
    // Validate and create product
    const product = insertProductsSchema.parse(data);
    await prisma.product.create({
      data: product,
    });
    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

//update product

export const updateProduct = async (
  data: z.infer<typeof updateProductSchema>
) => {
  try {
    // Validate and find product
    const product = updateProductSchema.parse(data);
    const existingProduct = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!existingProduct) throw new Error("Product not found");

    // Update product
    await prisma.product.update({
      where: { id: product.id },
      data: product,
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

// Get single product by id
export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: { id: productId },
  });

  return convertToPlainObject(data);
}

// Get product categories
export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ["category"],
    _count: true,
  });

  return data;
}
