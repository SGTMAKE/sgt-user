"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { Upload, CheckCircle, AlertCircle, Plus, Minus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { SubmissionProgress } from "@/components/submission-progress"
import { useFormSubmission } from "@/hooks/use-form-submission"
import { ProtectedButton } from "@/components/protected-button"
import Image from "next/image"
import { Button } from "@/components/ui/button"

// Define allowed file types and max size
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
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
  { id: "cnc-machining", label: "CNC Machining", image: "/services/CNC-Machining.png" },
  { id: "laser-cutting", label: "Laser Cutting", image: "/services/laser-cutting.png" },
  { id: "3d-printing", label: "3D Printing", image: "/services/threeD-printing.png" },
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
  const [quantity, setQuantity] = useState(1)



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

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, Math.min(10000, quantity + change))
    setQuantity(newQuantity)
    setValue("quantity", newQuantity)
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
  useEffect(() => {
    reset(getDefaultValues())
    const service = searchParams.get("service") || "cnc-machining"
    setActiveService(service)
  }, [searchParams, reset])



  const handleServiceChange = (service: string) => {
    setActiveService(service)
    setFile(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Check file size
      if (selectedFile.size > MAX_FILE_SIZE) {
        setErrorMessage("File size exceeds 10MB")
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
    // uploadProgress,
  } = useFormSubmission({
    onSubmitForm: submitFormToServer,
    onSuccess: () => {
      setFormSuccess(true)
    },
  })

  // Update the onSubmit function to use the improved authentication flow
  const onSubmit = async (data: any) => {
    setErrorMessage(null)

    const completeFormData = {
      serviceType: activeService,
      ...data,
      // We do not send the raw file; the upload (if any) happens in the hook and returns fileData
    }

    if (props?.onFormSubmit) {
      await props.onFormSubmit(completeFormData)
      return
    }

    await handleFormSubmit(data, file) // file can be null; the hook will skip upload
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
          <div className="my-6 max-w-6xl mx-auto">
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
        // uploadProgress={uploadProgress}
      />

      {formSuccess ? (
        <div className="bg-green-50 my-6 max-w-6xl mx-auto p-6 rounded-xl border border-green-200 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-medium text-green-800 mb-2">Inquiry Submitted Successfully</h2>
          <p className="text-green-700 mb-4">
            Thanks {session.data?.user?.name} for your inquiry. We will get back to you soon.
          </p>
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

          <form
            id="serviceForm"
            ref={formRef}
            onSubmit={handleSubmit(onSubmit)}
            className="my-6 max-w-5xl mx-auto px-3 md:px-6 pb-20"
          >
            {/* File Upload */}
            <div className="my-2">
              <Image
                src={renderImage() || "/placeholder.svg"}
                width={1000}
                className="w-full h-96"
                alt="services image"
                height={300}
              />
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
                  <div className="inline-flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-700">Design Files</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">Optional</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">Upload your design files, drawings, or specifications</p>
                  <p className="mt-1 text-xs text-gray-500">
                    File type: {activeService === "3d-printing" ? "STL, OBJ, 3MF, X3G" : ".PDF, .IGS, .DXF, .DWG"} • Max
                    10MB
                  </p>
                  <label
                    htmlFor="file"
                    className="cursor-pointer flex items-center justify-center bg-orange-100 px-4 py-2 rounded-full text-orange-600 text-sm w-max my-3 shadow-sm hover:bg-orange-200"
                  >
                    <Upload className="w-5 h-5 mr-2" /> Select file
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    For larger files, email us at{" "}
                    <a href="mailto:support@sgtmake.com" className="text-orange-600 underline">
                      support@sgtmake.com
                    </a>
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
            <div>
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Quantity (pcs)</h4>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <input
                        type="number"
                        className="px-4 py-2 border rounded w-24 text-center dark:bg-gray-800 dark:border-gray-600"
                        value={quantity}
                        {...register("quantity", { valueAsNumber: true })}
                        onChange={(e) => {
                          const value = Number.parseInt(e.target.value)
                          if (!isNaN(value) && value >= 1 && value <= 10000) {
                            setQuantity(value)
                            setValue("quantity", value)
                          }
                        }}
                        min="1"
                        max="10000"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= 10000}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {errors.quantity && (
                      <p className="text-red-500 text-sm mt-2">{errors.quantity.message as string}</p>
                    )}
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
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  <span className="bg-gradient-to-r from-white/90 to-white/60 bg-clip-text text-transparent">
                    Sending your request...
                  </span>
                </div>
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
