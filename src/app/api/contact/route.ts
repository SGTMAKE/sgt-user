import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { emailService } from "@/lib/email/email-service"
import type { ContactFormEmailData } from "@/lib/types/types"

// Validation schema for contact form
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  country: z.string().min(2, "Please enter a valid country"),
  inquiryDetails: z.string().min(10, "Inquiry details must be at least 10 characters"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = contactFormSchema.parse(body)

    // Generate unique contact ID
    const contactId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Get client information
    const userAgent = request.headers.get("user-agent") || undefined
    const forwardedFor = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    const ipAddress = forwardedFor?.split(",")[0] || realIp || undefined

    // Prepare email data
    const emailData: ContactFormEmailData = {
      contactId,
      customerName: validatedData.name,
      customerEmail: validatedData.email,
      company: validatedData.company,
      country: validatedData.country,
      inquiryDetails: validatedData.inquiryDetails,
      submissionDate: new Date(),
      userAgent,
      ipAddress,
    }

    // Send email notification to admin
    const emailResult = await emailService.sendContactFormNotification(emailData)

    if (!emailResult.success) {
      console.error("Failed to send contact form email:", emailResult.error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send notification email",
        },
        { status: 500 },
      )
    }

    // Log the contact form submission
    console.log(`Contact form submitted: ${contactId} from ${validatedData.name} (${validatedData.email})`)

    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
      contactId,
    })
  } catch (error) {
    console.error("Contact form submission error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid form data",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
