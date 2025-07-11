import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const category = await db.wireCategory.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "Wire category not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      category,
    })
  } catch (error) {
    console.error("Error fetching wire category:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch wire category",
      },
      { status: 500 },
    )
  }
}
