import { NextResponse } from "next/server"
import { db } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { countryCode, orderTotal } = await request.json()

    if (!countryCode || typeof orderTotal !== "number") {
      return NextResponse.json({ success: false, error: "Country code and orderTotal are required" }, { status: 400 })
    }

    // Get shipping rate for the country
    const shippingRate = await db.shippingRate.findUnique({
      where: { countryCode },
    })

    if (!shippingRate) {
      return NextResponse.json({ success: false, error: "Shipping not available for this country" }, { status: 404 })
    }

    const isFreeShipping = shippingRate.freeShippingThreshold ? orderTotal >= shippingRate.freeShippingThreshold : false


    return NextResponse.json({
      success: true,
      shippingCost: isFreeShipping ? 0 : shippingRate.baseRate,
      isFreeShipping,
      freeShippingThreshold: shippingRate.freeShippingThreshold,
      countryName: shippingRate.countryName,
    })
  } catch (error) {
    console.error("Error calculating shipping:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
