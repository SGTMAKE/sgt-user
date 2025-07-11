import { db } from "@/lib/prisma"

export async function getFastenerCategories() {
  try {
    const categories = await db.fastenerCategory.findMany({
      where: {
        isActive: true,
      },
      include: {
        options: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return {
      success: true,
      categories,
    }
  } catch (error) {
    console.error('Error fetching fastener categories:', error)
    return {
      success: false,
      categories: [],
      error: 'Failed to fetch fastener categories',
    }
  }
}

export async function getFastenerCategory(id: string) {
  try {
    const category = await db.fastenerCategory.findUnique({
      where: {
        id,
        isActive: true,
      },
      include: {
        options: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!category) {
      return {
        success: false,
        category: null,
        error: 'Category not found',
      }
    }

    return {
      success: true,
      category,
    }
  } catch (error) {
    console.error('Error fetching fastener category:', error)
    return {
      success: false,
      category: null,
      error: 'Failed to fetch fastener category',
    }
  }
}
