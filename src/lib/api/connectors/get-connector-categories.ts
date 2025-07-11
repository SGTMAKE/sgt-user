import { db } from "@/lib/prisma"

export async function getConnectorCategories() {
  try {
    const categories = await db.connectorCategory.findMany({
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
    console.error('Error fetching connector categories:', error)
    return {
      success: false,
      categories: [],
      error: 'Failed to fetch connector categories',
    }
  }
}

export async function getWireCategories() {
  try {
    const categories = await db.wireCategory.findMany({
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
    console.error('Error fetching wire categories:', error)
    return {
      success: false,
      categories: [],
      error: 'Failed to fetch wire categories',
    }
  }
}
