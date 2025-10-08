import axios from "@/config/axios.config"
import type { MarqueeOffersRes } from "../types/types"

export async function getMarqueeOffers(): Promise<MarqueeOffersRes | null> {
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/offers/marquee`, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })

    if (data) {
      return data as MarqueeOffersRes
    }
    return null
  } catch (error) {
    console.error("Failed to fetch marquee offers:", error)
    return null
  }
}
