import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const options = await db.connectorOption.findMany({
      where: {
        categoryId: params.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return NextResponse.json({
      success: true,
      options,
    })
  } catch (error) {
    console.error("Error fetching connector options:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch connector options",
      },
      { status: 500 },
    )
  }
}
