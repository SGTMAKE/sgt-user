import Container from "@/components/container"
import { ServiceDetails } from "@/components/services/service-details"
import { ServiceStatusStepper } from "@/components/services/service-status-stepper"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { notFound, redirect } from "next/navigation"

export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/authentication")

  const service = await db.service.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!service) {
    notFound()
  }

  return (
    <Container className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Service Details</h1>
        <p className="text-gray-500">Track the status of your service request</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <ServiceStatusStepper status={service.status} serviceType={service.type || "Unknown"} />
      </div>

      <ServiceDetails service={{ ...service, fileType: service.fileType ?? undefined }} />
    </Container>
  )
}
