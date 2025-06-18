"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { Upload, CheckCircle, AlertCircle, Plus, Minus, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { SubmissionProgress } from "@/components/submission-progress"
import { useFormSubmission } from "@/hooks/use-form-submission"
import { ProtectedButton } from "@/components/protected-button"
import Image from "next/image"

// Define allowed file types and max size
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/msword",
  "image/",
  "model/step",
  "model/stl",
  "application/octet-stream",
]

// Define the base form schema
const baseFormSchema = z.object({
  material: z.string().min(1, "Material is required"),
  surfaceFinish: z.boolean(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  remarks: z.string().optional(),
})

// Service-specific schema extensions
const designingSchema = baseFormSchema.extend({
  printType: z.enum(["fdm", "sla"]),
  color: z.string(),
})

// Service options
const serviceOptions = [
  { id: "cnc-machining", label: "CNC Machining",image:"/services/CNC-Machining.png" },
  { id: "laser-cutting", label: "Laser Cutting" ,image:"/services/laser-cutting.png" },
  { id: "3d-printing", label: "3D Printing" ,image:"/services/threeD-printing.png" },
]

// Material options
const materialOptions = [
  { value: "ms-steel", label: "MS Steel" },
  { value: "aluminium", label: "Aluminium" },
  { value: "copper", label: "Copper" },
  { value: "plastic", label: "Plastic" },
]

interface ManufacturingServicesProps {
  onFormSubmit?: (formData: any) => Promise<void>
}

export default function Page() {
  return <ManufacturingServices />
}

function ManufacturingServices(props: ManufacturingServicesProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceParam = searchParams.get("service") || "cnc-machining"

  const [activeService, setActiveService] = useState(serviceParam)
  const [file, setFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submittedServiceId, setSubmittedServiceId] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const session = useSession()

  // Determine which schema to use based on active service
  const getFormSchema = () => {
    switch (activeService) {
      case "3d-printing":
        return designingSchema
      default:
        return baseFormSchema
    }
  }

  // Get default values based on active service
  const getDefaultValues = () => {
    const baseDefaults = {
      material: "",
      surfaceFinish: false,
      quantity: 1,
      remarks: "",
    }

    switch (activeService) {
      case "cnc-machining":
        return {
          ...baseDefaults,
          tolerance: "",
          threadingRequired: false,
        }
      case "laser-cutting":
        return {
          ...baseDefaults,
          thickness: "",
          cutType: "standard" as const,
        }
      case "3d-printing":
        return {
          ...baseDefaults,
          printType: "fdm" as const,
          color: "black",
        }
      default:
        return baseDefaults
    }
  }

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    trigger,
    formState: { errors },
    getValues,
  } = useForm<z.infer<typeof designingSchema>>({
    resolver: zodResolver(getFormSchema()),
    defaultValues: getDefaultValues(),
  })

  // Reset form when service changes
  useEffect(() => {
    reset(getDefaultValues())
    // Update URL when service changes
    router.push(`/service?service=${activeService}`, { scroll: false })
  }, [activeService, reset, router])

  const handleServiceChange = (service: string) => {
    setActiveService(service)
    setFile(null);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Check file type
      const isAllowedType = ALLOWED_FILE_TYPES.some(
        (type) => selectedFile.type.includes(type) || (type.endsWith("/") && selectedFile.type.startsWith(type)),
      )

      if (!isAllowedType || selectedFile.size > MAX_FILE_SIZE) {
        setErrorMessage("Invalid file type or size exceeds 100MB")
        return
      }

      setFile(selectedFile)
      setErrorMessage(null)
    }
  }

  const submitFormToServer = async (formData: any, fileData: any) => {
    const response = await fetch("/api/service", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serviceType: activeService,
        ...formData,
        file: fileData,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Error submitting form")
    }

    const result = await response.json()
    setSubmittedServiceId(result.data.id)
    return result
  }

  const {
    submissionStep,
    handleSubmit: handleFormSubmit,
    handleAuthSuccess,
    error,
    isSubmitting,
  } = useFormSubmission({
    onSubmitForm: submitFormToServer,
    onSuccess: () => {
      setFormSuccess(true)
    },
  })

  // Update the onSubmit function to use the improved authentication flow
  const onSubmit = async (data: any) => {
    if (!file) {
      setErrorMessage("Please upload a file before submitting")
      return
    }

    setErrorMessage(null)

    // Prepare the complete form data including the file and service type
    const completeFormData = {
      serviceType: activeService,
      ...data,
      file: file,
    }

    // Use the onFormSubmit function passed from ServiceFormWrapper if available
    if (props?.onFormSubmit) {
      await props.onFormSubmit(completeFormData)
      return
    }

    // Otherwise use the local form submission logic
    await handleFormSubmit(data, file)
  }

  const renderImage = () => {
    switch (activeService) {
      case "cnc-machining":
        return "/services/CNC-Machining.png"
      case "laser-cutting":
        return "/services/laser-cutting.png"
      case "3d-printing":
       return "/services/threeD-printing.png"
      default:
        return ""
    }
  }
  // Render service-specific form fields
  const renderServiceFields = () => {
    switch (activeService) {
      case "cnc-machining":
        return ""
      case "laser-cutting":
        return ""
      case "3d-printing":
        const printType = watch("printType")
        const materialOptions =
          printType === "fdm"
            ? [
                { value: "pla", label: "PLA" },
                { value: "petg", label: "PETG" },
                { value: "abs", label: "ABS" },
              ]
            : [{ value: "resin", label: "Resin" }]

        const colorOptions =
          printType === "fdm"
            ? [
                { value: "black", label: "Black" },
                { value: "white", label: "White" },
              ]
            : [{ value: "white", label: "White" }]

        return (
          <div className="my-6 max-w-6xl mx-auto ">
            <h3 className="text-lg font-medium mb-4">3D Printing Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Print Type</label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="fdm"
                      checked={printType === "fdm"}
                      onChange={() => {
                        setValue("printType", "fdm")
                        setValue("material", "pla")
                        setValue("color", "black")
                      }}
                      className="mr-2"
                    />
                    FDM
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="sla"
                      checked={printType === "sla"}
                      onChange={() => {
                        setValue("printType", "sla")
                        setValue("material", "resin")
                        setValue("color", "white")
                      }}
                      className="mr-2"
                    />
                    SLA
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Material</label>
                <div className="flex flex-wrap gap-2">
                  {materialOptions.map((material) => (
                    <button
                      key={material.value}
                      type="button"
                      onClick={() => {
                        setValue("material", material.value)
                        errors.material ? trigger("material") : ""
                      }}
                      className={`px-4 py-2 rounded-md border ${
                        watch("material") === material.value
                          ? "bg-gray-200 border-gray-400"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {material.label}
                    </button>
                  ))}
                </div>
                {errors.material && <p className="text-red-500 text-xs mt-1">{errors.material.message as string}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setValue("color", color.value)}
                      className={`px-4 py-2 rounded-md border ${
                        watch("color") === color.value ? "bg-gray-200 border-gray-400" : "bg-white border-gray-300"
                      }`}
                    >
                      {color.label}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Note: If specific color required, please specify in remarks.
                </p>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  // Check for stored form data on component mount
  useEffect(() => {
    try {
      const storedFormPage = localStorage.getItem("pendingFormPage")
      const currentPath = window.location.pathname
      
      // Only restore data if we're on the same page that stored it
      if (storedFormPage === currentPath) {
        const storedFormData = localStorage.getItem("pendingFormData")
        const hadFile = localStorage.getItem("hadPendingFile") === "true"
        
        if (storedFormData) {
          console.log("Found stored form data for current page:", currentPath)
          const parsedData = JSON.parse(storedFormData)
          
          // Restore the form data
          Object.entries(parsedData).forEach(([key, value]) => {
            setValue(key as any, value as any)
          })
          
          // If service type was stored, set it
          if (parsedData.serviceType) {
            setActiveService(parsedData.serviceType)
          }
          
          // If we had a file, show a message to re-select it
          if (hadFile) {
            setErrorMessage("Please re-select your file to complete your submission")
          }
          
          // Clear the stored data
          localStorage.removeItem("pendingFormData")
          localStorage.removeItem("pendingFormPage")
          localStorage.removeItem("hadPendingFile")
          
          // Trigger validation
          trigger()
        }
      }
    } catch (e) {
      console.error("Error checking for stored form data:", e)
    }
  }, [setValue, trigger])

  return (
    <div>
      {/* Submission Progress Modal with Auth */}
      <SubmissionProgress
        isOpen={submissionStep !== "idle"}
        currentStep={submissionStep === "idle" ? "authenticating" : submissionStep}
        error={error || undefined}
        onAuthSuccess={handleAuthSuccess}
      />

      {formSuccess ? (
        <div className="bg-green-50 my-6 max-w-6xl mx-auto p-6 rounded-xl border border-green-200 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-medium text-green-800 mb-2">Order Submitted Successfully</h2>
          <p className="text-green-700 mb-2">
            Thanks {session.data?.user?.name} for your order. We will get back to you soon with a quote.
          </p>
          {submittedServiceId && <p className="text-green-700 mb-4">Service ID: {submittedServiceId}</p>}
          <button
            onClick={() => {
              setFormSuccess(false)
              setFile(null)
              reset(getDefaultValues())
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Submit Another Order
          </button>
        </div>
      ) : (
        <>
          {/* Service Selection */}
          <div className="flex flex-wrap gap-4 my-6 max-w-5xl mx-auto px-3 md:px-6">
            {serviceOptions.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceChange(service.id)}
                className={`px-[clamp(1rem,3vw,4rem)] py-[clamp(1rem,1.5vw,2rem)] rounded-md text-lg transition-colors bg-[#FAFAFA] ${
                  activeService === service.id
                    ? "bg-orange-500 text-white border-2 border-orange-500"
                    : " text-gray-700 border-2 border-gray-300 hover:border-gray-400"
                }`}
              >
                {service.label}
              </button>
            ))}
          </div>

         

          <form id="serviceForm" ref={formRef} onSubmit={handleSubmit(onSubmit)} className="my-6 max-w-5xl mx-auto px-3 md:px-6 pb-20">
            {/* File Upload */}
            <div className="my-2">
            <Image src={renderImage()} width={1000} className="w-full h-96 " alt="services image" height={300} />
          </div>
            <div className="border border-gray-300 h-56 md:h-96 rounded-xl text-center bg-[#f5f3f3] mb-6 flex flex-col items-center justify-center">
              <input
                ref={fileInputRef}
                type="file"
                id="file"
                className="hidden"
                onChange={handleFileChange}
                accept={activeService === "3d-printing" ? ".stl,.obj,.3mf,.x3g" : ".pdf,.igs,.dxf,.dwg"}
                disabled={isSubmitting}
              />

              {!file ? (
                <>
                  <label
                    htmlFor="file"
                    className="cursor-pointer flex items-center justify-center bg-orange-100 px-4 py-2 rounded-full text-orange-600 text-sm w-max"
                  >
                    <Upload className="w-5 h-5 mr-2" /> Select Your File
                  </label>
                  <p className="mt-2 text-sm text-gray-500">Upload your design files, drawings, or specifications</p>
                  <p className="mt-2 text-sm text-gray-500">
                    File type: {activeService === "3d-printing" ? "STL, OBJ, 3MF, X3G" : ".pdf .igs ,.dxf ,.dwg"}
                  </p>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                  <p className="text-gray-600 mb-2">File selected</p>
                  <p className="text-sm text-gray-500">{file.name}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""
                      }
                    }}
                    className="mt-4 text-orange-600 underline text-sm"
                    disabled={isSubmitting}
                  >
                    Select a different file
                  </button>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-red-600">
                <p className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Service-specific fields */}
            {renderServiceFields()}

            {/* Material */}
            {activeService !== "3d-printing" && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Material</h3>
                <div className="flex flex-wrap gap-2">
                  {materialOptions.map((material) => (
                    <button
                      key={material.value}
                      type="button"
                      onClick={() => setValue("material", material.value)}
                      className={`px-4 py-2 rounded-md border ${
                        watch("material") === material.value
                          ? "bg-gray-200 border-gray-400"
                          : "bg-white border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    >
                      {material.label}
                    </button>
                  ))}
                </div>
                {errors.material && <p className="text-red-500 text-xs mt-1">{errors.material.message as string}</p>}
              </div>
            )}

            {/* Surface Finish */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Surface Finish</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setValue("surfaceFinish", true)}
                  className={`px-4 py-2 rounded-md border ${
                    watch("surfaceFinish") === true ? "bg-gray-200 border-gray-400" : "bg-white border-gray-300"
                  }`}
                  disabled={isSubmitting}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setValue("surfaceFinish", false)}
                  className={`px-4 py-2 rounded-md border ${
                    watch("surfaceFinish") === false ? "bg-gray-200 border-gray-400" : "bg-white border-gray-300"
                  }`}
                  disabled={isSubmitting}
                >
                  No
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Quantity (pcs)</h3>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    const currentValue = watch("quantity")
                    if (currentValue > 1) {
                      setValue("quantity", currentValue - 1)
                    }
                  }}
                  className="border rounded-md p-2"
                  disabled={watch("quantity") <= 1 || isSubmitting}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  {...register("quantity", { valueAsNumber: true })}
                  min="1"
                  className="w-16 text-center mx-2 border rounded-md p-2"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => {
                    const currentValue = watch("quantity")
                    setValue("quantity", currentValue + 1)
                  }}
                  className="border rounded-md p-2"
                  disabled={isSubmitting}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message as string}</p>}
            </div>

            {/* Remarks */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Remarks</h3>
              <textarea
                {...register("remarks")}
                className="w-full border p-3 rounded-md bg-[#FAFAFA]"
                rows={4}
                placeholder="Write here"
                disabled={isSubmitting}
              ></textarea>
            </div>

            <ProtectedButton
              type="submit"
              className="mt-6 bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed mb-10"
              disabled={isSubmitting}
              formId="serviceForm"
              formData={{ ...getValues(), serviceType: activeService }}
            >{isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Submit"
            )}
          </ProtectedButton>
        </form>
      </>
    )}
  </div>
)
}

