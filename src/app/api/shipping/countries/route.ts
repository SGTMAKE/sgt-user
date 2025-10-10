import { NextResponse } from "next/server"
import { db } from "@/lib/prisma"
export const dynamic = "force-dynamic"
export const revalidate = 0
export async function GET() {
  try {
    const countries = await db.shippingRate.findMany({
      select: {
        countryCode: true,
        countryName: true,
      },
      orderBy: {
        countryName: "asc",
      },
    })

    return NextResponse.json({
      success: true,
      countries,
    })
  } catch (error) {
    console.error("Error fetching available countries:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
