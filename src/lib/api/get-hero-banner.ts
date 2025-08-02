import axios from "@/config/axios.config"
import type { HeroBanner } from "@prisma/client"

export async function getHeroBanner(): Promise<HeroBanner[] | null> {
  try {
    const { data } = await axios.get("/api/product/hero-banner", {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })

    if (data && data.banners) {
      return data.banners as HeroBanner[]
    }
    return null
  } catch (error) {
    console.error("Failed to fetch hero banners:", error)
    return null
  }
}
