import { NextResponse } from "next/server"
import { z } from "zod"
import {db} from "@/lib/prisma"
import { getServerSession } from "next-auth";
import { error404 } from "@/lib/utils";
import { authOptions } from "@/lib/auth";


// Define the schema for validation
const formSchema = z.object({
  chemistry: z.enum(["NCM", "NCA", "LifePO4", "LIPO"]),
  cellBrand: z.string().min(1, "Cell Brand is required"),
  seriesConfig: z.string().min(1, "Series Config is required"),
  parallelConfig: z.string().min(1, "Parallel Config is required"),
  normalDischarge: z.string().min(1, "Normal Discharge is required"),
  peakDischarge: z.string().min(1, "Peak Discharge is required"),
  charging: z.string().min(1, "Charging is required"),
  lifeCycle: z.string().min(1, "Life Cycle is required"),
  packVoltage: z.string().min(1, "Pack Voltage is required"),
  bmsChoice: z.string().min(1, "BMS Choice is required"),
  modulusCount: z.string().min(1, "Modulus Count is required"),
  dimensions: z.object({
    H: z.string().min(1, "Height is required"),
    W: z.string().min(1, "Width is required"),
    L: z.string().min(1, "Length is required"),
  }),
  additionalInfo: z.string().optional(),
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
    const validatedData = formSchema.parse(body)
    const fileData = validatedData.file || {}
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return error404("Missing user ID in the session.", { user: null });
    }
    if (!fileData.url || !fileData.public_id || !fileData.type) {
      throw new Error("Missing file data fields.");
    }
    
    const service = await db.service.create({
      data: {
        userId: session.user.id,
        fileUrl: fileData.url || "",
        filePublicId: fileData.public_id || "",
        fileType: fileData.type || "",
        // Store all battery pack form details in the formDetails JSON field
        formDetails: {
          type: "batteryPack", // Identify the form type
          chemistry: validatedData.chemistry,
          cellBrand: validatedData.cellBrand,
          seriesConfig: validatedData.seriesConfig,
          parallelConfig: validatedData.parallelConfig,
          normalDischarge: validatedData.normalDischarge,
          peakDischarge: validatedData.peakDischarge,
          charging: validatedData.charging,
          lifeCycle: validatedData.lifeCycle,
          packVoltage: validatedData.packVoltage,
          bmsChoice: validatedData.bmsChoice,
          modulusCount: validatedData.modulusCount,
          dimensions: {
            H: validatedData.dimensions.H,
            W: validatedData.dimensions.W,
            L: validatedData.dimensions.L,
          },
          additionalInfo: validatedData.additionalInfo || "",
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

