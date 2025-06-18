"use client"

// import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { FileText, PrinterIcon as Printer3d, Scissors, Cog, Cable, Battery, ChevronRight } from "lucide-react"

interface Service {
  id: string
  status: string
  createdAt: Date
  formDetails: any
}

interface ServicesListProps {
  services: Service[]
}

export function ServicesList({ services }: ServicesListProps) {
  const getServiceIcon = (type: string) => {
    switch (type) {
      case "cnc-machining":
        return <Cog className="h-5 w-5 text-blue-600" />
      case "laser-cutting":
        return <Scissors className="h-5 w-5 text-orange-600" />
      case "3d-printing":
        return <Printer3d className="h-5 w-5 text-purple-600" />
      case "wiringHarness":
        return <Cable className="h-5 w-5 text-green-600" />
      case "battery-inquiry":
        return <Battery className="h-5 w-5 text-red-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getServiceName = (type: string) => {
    switch (type) {
      case "cnc-machining":
        return "CNC Machining"
      case "laser-cutting":
        return "Laser Cutting"
      case "3d-printing":
        return "3D Printing"
      case "wiringHarness":
        return "Wiring Harness"
      case "battery-inquiry":
        return "Battery Pack"
      default:
        return "Custom Service"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "quote_provided":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "in_production":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <Link key={service.id} href={`/account/services/${service.id}`} className="block">
          <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-gray-100">{getServiceIcon(service.formDetails.type)}</div>
                <div>
                  <h3 className="font-medium">{getServiceName(service.formDetails.type)}</h3>
                  <p className="text-sm text-gray-500">
                    {/* {formatDistanceToNow(new Date(service.createdAt), { addSuffix: true })} */}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={`${getStatusColor(service.status)}`}>{formatStatus(service.status)}</Badge>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
          </div>
        </Link>
      ))}
    </div>
  )
}
