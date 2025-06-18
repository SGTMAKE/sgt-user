import { authOptions } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { error400, error500, success200 } from "@/lib/utils"
import { getServerSession } from "next-auth"
import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.id) {
      return error400("Missing user ID in the session.", { services: [] })
    }

    const userId = session.user.id

    // Get all services for the user
    const services = await db.service.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Return services data
    return success200({
      services,
    })
  } catch (error: any) {
    console.error("Error fetching services:", error)
    return error500({ services: [] })
  }
}
