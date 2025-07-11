import { NextResponse } from "next/server"
import { getConnectorCategories, getWireCategories } from "@/lib/api/connectors/get-connector-categories"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // 'connectors' or 'wires'

    let result
    if (type === "wires") {
      result = await getWireCategories()
    } else {
      result = await getConnectorCategories()
    }

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
