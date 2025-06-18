"use client"

// import { format } from "date-fns"
import { FileText, Download, ExternalLink } from "lucide-react"
// import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@nextui-org/button"
interface ServiceDetailsProps {
  service: {
    id: string
    status: string
    createdAt: Date
    updatedAt: Date
    fileUrl: string
    fileType: string
    formDetails:any
    quotation?: any
    timeline?:any
  }
}

export function ServiceDetails({ service }: ServiceDetailsProps) {
  const formatServiceType = (type: string) => {
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
  function DetailItem({ label, value }: { label: string; value: any }) {
    return (
      <div>
        <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        <p className="text-sm mt-1">{value?.toString() || "N/A"}</p>
      </div>
    )
  }
  const renderFormDetails = () => {
    const { type } = service.formDetails

    if (type === "batteryPack") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem label="Chemistry" value={service.formDetails.chemistry} />
          <DetailItem label="Cell Brand" value={service.formDetails.cellBrand} />
          <DetailItem label="Series Config" value={service.formDetails.seriesConfig} />
          <DetailItem label="Parallel Config" value={service.formDetails.parallelConfig} />
          <DetailItem label="Normal Discharge" value={service.formDetails.normalDischarge} />
          <DetailItem label="Peak Discharge" value={service.formDetails.peakDischarge} />
          <DetailItem label="Charging" value={service.formDetails.charging} />
          <DetailItem label="Life Cycle" value={service.formDetails.lifeCycle} />
          <DetailItem label="Pack Voltage" value={service.formDetails.packVoltage} />
          <DetailItem label="BMS Choice" value={service.formDetails.bmsChoice} />
          <DetailItem label="Modulus Count" value={service.formDetails.modulusCount} />
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Dimensions</h3>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <p className="text-sm">H: {service.formDetails.dimensions?.H}</p>
              <p className="text-sm">W: {service.formDetails.dimensions?.W}</p>
              <p className="text-sm">L: {service.formDetails.dimensions?.L}</p>
            </div>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Additional Info</h3>
            <p className="text-sm mt-1">{service.formDetails.additionalInfo || "N/A"}</p>
          </div>
        </div>
      )
    } else if (type === "wiringHarness") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem label="Quantity" value={service.formDetails.quantity} />
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="text-sm mt-1">{service.formDetails.description || "N/A"}</p>
          </div>
        </div>
      )
    } else if (type.includes("cnc") || type.includes("laser") || type.includes("3d-printing")) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem label="Service Type" value={service.formDetails.type} />
          <DetailItem label="Material" value={service.formDetails.material} />
          <DetailItem label="Surface Finish" value={service.formDetails.surfaceFinish ? "Yes" : "No"} />
          <DetailItem label="Quantity" value={service.formDetails.quantity} />

          {service.formDetails.type === "3d-printing" && (
            <>
              <DetailItem label="PrintType" value={service.formDetails.printType} />
            </>
          )}

          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500">Remarks</h3>
            <p className="text-sm mt-1">{service.formDetails.remarks || "N/A"}</p>
          </div>
        </div>
      )
    }

    return (
      <div className="text-sm">
        <pre className="bg-gray-100 p-4 rounded-md overflow-auto">{JSON.stringify(service.formDetails, null, 2)}</pre>
      </div>
    )
  }
  const renderServiceSpecificDetails = () => {
    const { type } = service.formDetails

    switch (type) {
      case "3d-printing":
        return (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Print Type</p>
                <p>{service.formDetails.printType?.toUpperCase() || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Color</p>
                <p>{service.formDetails.color || "N/A"}</p>
              </div>
            </div>
          </>
        )
      case "wiring-harness":
        return (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Connector Type</p>
                <p>{service.formDetails.connectorType || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Wire Gauge</p>
                <p>{service.formDetails.wireGauge || "N/A"}</p>
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Service Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Service ID</p>
              <p>{service.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Service Type</p>
              <p>{formatServiceType(service.formDetails.type)}</p>
            </div>
            {/* <div>
              <p className="text-sm font-medium text-gray-500">Date Requested</p>
              <p>{format(new Date(service.createdAt), "PPP")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p>{format(new Date(service.updatedAt), "PPP")}</p>
            </div> */}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technical Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          

          {renderFormDetails()}

          {service.formDetails.remarks && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">Remarks</p>
              <p className="mt-1 whitespace-pre-wrap">{service.formDetails.remarks}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {service.fileUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded File</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-blue-100">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Design File</p>
                  <p className="text-sm text-gray-500">{service.fileType}</p>
                </div>
              </div>
              
            </div>
          </CardContent>
        </Card>
      )}

      {service.quotation && (
        <Card>
          <CardHeader>
            <CardTitle>Quotation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Amount</p>
                <p className="text-xl font-bold">
                  {service.quotation.currency} {service.quotation.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Valid Until</p>
                {/* <p>{format(new Date(service.quotation.validUntil), "PPP")}</p> */}
              </div>
            </div>
            {service.quotation.details && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Details</p>
                <p className="mt-1 whitespace-pre-wrap">{service.quotation.details}</p>
              </div>
            )}
            {service.status === "quote_provided" && (
              <div className="mt-6 flex space-x-4">
                <Button className="bg-green-600 hover:bg-green-700">Accept Quote</Button>
                <Button>Request Changes</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {service.timeline && (
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Estimated Completion</p>
                {/* <p>{format(new Date(service.timeline.estimatedCompletion), "PPP")}</p> */}
              </div>
              {service.timeline.productionStartDate && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Production Start Date</p>
                  {/* <p>{format(new Date(service.timeline.productionStartDate), "PPP")}</p> */}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
