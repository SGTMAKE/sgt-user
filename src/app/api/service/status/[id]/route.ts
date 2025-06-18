import { authOptions } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { error400, error404, error500, success200 } from "@/lib/utils"
import { getServerSession } from "next-auth"
import type { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.id) {
      return error400("Missing user ID in the session.", { service: null })
    }

    const serviceId = params.id
    if (!serviceId) {
      return error400("Missing service ID.", { service: null })
    }

    // Get service data from database
    const service = await db.service.findUnique({
      where: {
        id: serviceId,
        userId: session.user.id,
      },
    })

    // Return if service not found
    if (!service) {
      return error404("Service not found", { service: null })
    }

    // Return service data
    return success200({
      service,
    })
  } catch (error: any) {
    console.error("Error fetching service:", error)
    return error500({ service: null })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.id) {
      return error400("Missing user ID in the session.", { service: null })
    }

    const serviceId = params.id
    if (!serviceId) {
      return error400("Missing service ID.", { service: null })
    }

    // Check if service exists and belongs to user
    const existingService = await db.service.findUnique({
      where: {
        id: serviceId,
        userId: session.user.id,
      },
    })

    if (!existingService) {
      return error404("Service not found", { service: null })
    }

    const updateData = await req.json()

    // Only allow specific fields to be updated by the user
    const allowedUpdates = ["remarks"]
    const filteredUpdateData: Record<string, any> = {}

    Object.keys(updateData).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        filteredUpdateData[key] = updateData[key]
      }
    })
    const safeFormDetails =
    typeof existingService.formDetails === "object" && existingService.formDetails !== null
      ? existingService.formDetails
      : {}
    // Update service
    const updatedService = await db.service.update({
      where: {
        id: serviceId,
      },
      data: {
formDetails: {
  ...safeFormDetails,
  remarks: updateData.remarks ? updateData.remarks: "",
}
      },
    })

    return success200({
      service: updatedService,
    })
  } catch (error: any) {
    console.error("Error updating service:", error)
    return error500({ service: null })
  }
}
