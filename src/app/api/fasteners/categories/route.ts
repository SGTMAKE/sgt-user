import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

// GET all categories or a single category by ID (via query param)
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')

  try {
    if (id) {
      // Fetch single category
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
        return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 })
      }

      return NextResponse.json({ success: true, category })
    } else {
      // Fetch all categories
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

      return NextResponse.json({ success: true, categories })
    }
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
