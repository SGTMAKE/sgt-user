import Container from "@/components/container"
import { ServicesList } from "@/components/services/services-list"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/prisma"

export default async function ServicesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/authentication")

  // Fetch all services for the user
  const services = await db.service.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <Container className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">My Services</h1>
      {services.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700">No services found</h3>
          <p className="text-gray-500 mt-2">You have not requested any services yet.</p>
        </div>
      ) : (
        <ServicesList services={services} />
      )}
    </Container>
  )
}
