import { NextResponse } from "next/server"
import { getFastenerCategories } from "@/lib/api/fasteners/get-fastener-categories"

export async function GET() {
  try {
    const result = await getFastenerCategories()

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      categories: result.categories,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
