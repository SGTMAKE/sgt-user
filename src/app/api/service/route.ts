import { NextResponse } from "next/server";
import { z } from "zod";
import {db} from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { error404 } from "@/lib/utils";
import { authOptions } from "@/lib/auth";
import { emailService } from "@/lib/email/email-service";
// import { emailService } from "@/lib/email/email-service"
// ----------------------
// Zod Schemas
// ----------------------
const fileSchema = z.object({
  url: z.string().optional(),
  public_id: z.string().optional(),
  name: z.string().optional(),
  type: z.string().optional(),
  size: z.number().optional(),
});

const baseSchema = z.object({
  serviceType: z.enum(["cnc-machining", "laser-cutting", "3d-printing"]),
  material: z.string().min(1, "Material is required"),
  surfaceFinish: z.boolean(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  remarks: z.string().optional(),
  file: fileSchema.nullable().optional(),
});





const designingSchema = baseSchema.extend({
  printType: z.enum(["fdm", "sla"]),
  color: z.string(),
  material: z.string(),
});

// ----------------------
// Type Inference from Schemas
// ----------------------
type BaseFormData = z.infer<typeof baseSchema>;

type DesignFormData = z.infer<typeof designingSchema>;

// Union type for all supported forms
type ServiceFormData = DesignFormData | BaseFormData;

// ----------------------
// API Route Handler
// ----------------------
export async function POST(request: Request) {
  try {
    const body = await request.json();
     const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.id) {
          return error404("Missing user ID in the session.", { user: null });
        }
    let validatedData:ServiceFormData;

    // Dynamically validate based on serviceType
    switch (body.serviceType) {
      case "3d-printing":
        validatedData = designingSchema.parse(body);
        break;
      default:
        validatedData = baseSchema.parse(body)
    }

    const fileData = validatedData?.file || {} ;

    const service = await db.service.create({
      data: {
        userId: session.user.id , // Replace with real user id from session/auth
        fileUrl: fileData?.url || undefined,
        filePublicId: fileData?.public_id || undefined,
        fileType: fileData?.type || undefined,
        type:validatedData.serviceType,
        formDetails: {
          type: validatedData.serviceType,
          material: validatedData.material,
          surfaceFinish: validatedData.surfaceFinish,
          quantity: validatedData.quantity,
          remarks: validatedData.remarks || "",

          ...(validatedData.serviceType === "3d-printing" && "printType" in validatedData && {
            printType: validatedData.printType,
            color: validatedData.color,
            material: validatedData.material,
          }),
        },
      },
    });

    try {
      await emailService.sendServiceNotification({
        ...service,
        customerName: session.user.name || "Unknown Customer",
        customerEmail: session.user.email ?? "",
        filePublicId: service.filePublicId || undefined,
        fileUrl: service.fileUrl || undefined,
        fileType: service.fileType || undefined,
      })
    } catch (emailError) {
      console.error("Failed to send service notification email:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    console.error("Error submitting form:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: "Error submitting form" }, { status: 500 });
  }
}
