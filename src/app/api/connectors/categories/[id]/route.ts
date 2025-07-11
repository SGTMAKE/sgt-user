import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const category = await db.connectorCategory.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "Connector category not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      category,
    })
  } catch (error) {
    console.error("Error fetching connector category:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch connector category",
      },
      { status: 500 },
    )
  }
}
