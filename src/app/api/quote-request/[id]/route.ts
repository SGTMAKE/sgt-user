import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { error400, error500, success200 } from "@/lib/utils"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.id) {
      return error400("Unauthorized", { quote: null })
    }

    const { id } = params

    const quote = await db.quoteRequest.findUnique({
      where: {
        id: id,
        userId: session.user.id, // Ensure user can only access their own quotes
      },
    })

    if (!quote) {
      return error400("Quote not found", { quote: null })
    }

    return success200({
      quote: {
        ...quote,
        items: quote.items || [],
      },
    })
  } catch (error) {
    console.error("Error fetching quote:", error)
    return error500({ quote: null })
  }
}
