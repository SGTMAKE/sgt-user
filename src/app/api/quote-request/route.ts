import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { emailService } from "@/lib/email/email-service"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { items, notes  } = body

    console.log({ items, notes  })

    // Validate request data
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "No items provided" }, { status: 400 })
    }

    // Validate each item
    for (const item of items) {
      if (!item.type || !item.categoryName || !item.specifications || !item.quantity) {
        return NextResponse.json({ success: false, error: "Invalid item data" }, { status: 400 })
      }
    }

    // Get user information
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    // Create quote request in database
    const quoteRequest = await db.quoteRequest.create({
      data: {
        userId: user.id,
        items: items,
        notes: notes || "",
        totalItems:  items.reduce((sum: any, item: any) => sum + item.quantity, 0),
        status: "PENDING",
        emailSent: false,
        emailOpened: false,
        responseReceived: false,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    // Send email notification to admin
    try {
      await emailService.sendQuoteRequestNotification({
        quoteRequestId: quoteRequest.id,
        customerName: user.name || "Unknown Customer",
        customerEmail: user.email,
        customerPhone: user.phone || "",
        submissionDate: quoteRequest.createdAt,
        items: items,
        totalItems: quoteRequest.totalItems,
        notes: notes || "",
      })

      // Update email sent status
      await db.quoteRequest.update({
        where: { id: quoteRequest.id },
        data: { emailSent: true },
      })

      console.log("Quote request notification email sent successfully")
    } catch (emailError) {
      console.log("Failed to send quote request notification email:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      quoteId: quoteRequest.id,
      message: "Quote request submitted successfully",
    })
  } catch (error) {
    console.log("Quote request error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const quoteRequests = await db.quoteRequest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        items: true,
        notes: true,
        totalItems: true,
        status: true,
        emailSent: true,
        emailOpened: true,
        responseReceived: true,
        adminResponse: true,
        quotedPrice: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      quotes: quoteRequests,
    })
  } catch (error) {
    console.error("Get quote requests error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
