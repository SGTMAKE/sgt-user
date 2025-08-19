import { db } from "@/lib/prisma";

async function getAllProducts(page: number) {
  return await db.product.findMany({
    where: {
      stock: { not: 0 },
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: page === 1 ? 0 : (page - 1) * 10,
    take: 10,
    include: { images: true },
  });
}

async function getProductsWithCategories(
  categories: Array<string>,
  page: number,
) {
  return await db.category
    .findMany({
      select: {
        Product: {
          where:{
            stock: { not: 0 },
            isDeleted: false,
          },
          include: {
            images: true,
          },
        },
      },
      where: {
        isDeleted: false,
        id: {
          in: categories,
        },
      },
      skip: page === 1 ? 0 : (page - 1) * 10,
      take: 10,
    })
    .then((dbProducts) =>
      dbProducts.flatMap((dbProduct) => dbProduct.Product).flat(2),
    );
}

export { getAllProducts, getProductsWithCategories };
