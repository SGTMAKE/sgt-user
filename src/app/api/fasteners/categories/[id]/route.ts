import { type NextRequest, NextResponse } from "next/server"
import { getFastenerCategory } from "@/lib/api/fasteners/get-fastener-categories"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await getFastenerCategory(params.id)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.category === null ? 404 : 500 })
    }

    return NextResponse.json({
      success: true,
      category: result.category,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
