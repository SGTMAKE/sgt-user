import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { error404 } from "@/lib/utils"
import { authOptions } from "@/lib/auth"
// Define the schema for validation
const formSchema = z.object({
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  file: z
    .object({
      url: z.string().optional(),
      public_id: z.string().optional(),
      name: z.string().optional(),
      type: z.string().optional(),
      size: z.number().optional(),
    })
    .optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const session = await getServerSession(authOptions)
    if (!session || !session.user || !session.user.id) {
      return error404("Missing user ID in the session.", { user: null })
    }
    // Validate the request body
    const validatedData = formSchema.parse(body)

    // Extract file data
    const fileData = validatedData.file || {}

    // Create a new record in the database using the Service model
    const service = await db.service.create({
      data: {
        userId: session.user.id ,
        fileUrl: fileData.url || "",
        filePublicId: fileData.public_id || "",
        fileType: fileData.type || "",
        // Store wiring harness form details in the formDetails JSON field
        formDetails: {
          type: "wiringHarness", // Identify the form type
          description: validatedData.description,
          quantity: validatedData.quantity,
        },
      },
    })

    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    console.error("Error submitting form:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Error submitting form" }, { status: 500 })
  }
}
