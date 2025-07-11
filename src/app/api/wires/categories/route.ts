import { NextResponse } from "next/server"
import { db } from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await db.wireCategory.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json({
      success: true,
      categories,
    })
  } catch (error) {
    console.error("Error fetching wire categories:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch wire categories",
      },
      { status: 500 },
    )
  }
}
