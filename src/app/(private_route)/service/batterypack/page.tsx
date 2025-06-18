"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { SubmissionProgress } from "@/components/submission-progress"
import { useFormSubmission } from "@/hooks/use-form-submission"
import { ProtectedButton } from "@/components/protected-button"
import Image from "next/image"

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const ALLOWED_FILE_TYPES = ["application/pdf", "application/vnd.ms-excel", "application/msword", "image/", "model/step"]

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
})

type FormData = z.infer<typeof formSchema>

interface BatteryPackFormProps {
  onFormSubmit?: (formData: any) => Promise<void>
}

export default function Page() {
  return <BatteryPackForm />
}

function BatteryPackForm(props: BatteryPackFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const session = useSession()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const FormFields = [
    { name: "cellBrand", label: "Cell Brand" },
    { name: "seriesConfig", label: "Series Config" },
    { name: "parallelConfig", label: "Parallel Config" },
    { name: "normalDischarge", label: "Normal Discharge" },
    { name: "peakDischarge", label: "Peak Discharge" },
    { name: "charging", label: "Charging" },
    { name: "lifeCycle", label: "Life Cycle" },
    { name: "packVoltage", label: "Pack Voltage" },
    { name: "bmsChoice", label: "BMS Choice" },
    { name: "modulusCount", label: "No. of Modules" },
  ]

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
    const response = await fetch("/api/service/battery-inquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        file: fileData,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Error submitting form")
    }

    return await response.json()
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

  const onSubmit = async (data: FormData) => {
    if (!file) {
      setErrorMessage("Please upload a file before submitting")
      return
    }

    setErrorMessage(null)

    // Prepare the complete form data including the file
    const completeFormData = {
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
            if (key === "dimensions") {
              // Handle nested dimensions object
              Object.entries(value as Record<string, string>).forEach(([dimKey, dimValue]) => {
                setValue(`dimensions.${dimKey}` as any, dimValue)
              })
            } else {
              setValue(key as any, value as any)
            }
          })

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
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Battery Packs Inquiry</h1>

      {/* Submission Progress Modal with Auth */}
      <SubmissionProgress
        isOpen={submissionStep !== "idle"}
        currentStep={submissionStep === "idle" ? "authenticating" : submissionStep}
        error={error || undefined}
        onAuthSuccess={handleAuthSuccess}
      />

      {formSuccess ? (
        <div className="bg-green-50 p-6 rounded-xl border border-green-200 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-medium text-green-800 mb-2">Inquiry Submitted Successfully</h2>
          <p className="text-green-700 mb-4">
            Thanks {session.data?.user?.name} for your inquiry. We will get back to you soon.
          </p>
          <button
            onClick={() => {
              setFormSuccess(false)
              setFile(null)
              reset()
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Submit Another Inquiry
          </button>
        </div>
      ) : (
        <>
          {/* File Upload */}
          <div className="my-2">
            <Image src="/services/Battery-Packs.png" width={1000} className="w-full h-96 " alt="services image" height={300} />
          </div>
          <div className="border border-gray-300 h-56 md:h-96 rounded-xl text-center bg-[#f5f3f3] mb-6 flex flex-col items-center justify-center">
            <input
              ref={fileInputRef}
              type="file"
              id="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.xls,.xlsx,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp,.stp"
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
                <p className="mt-2 text-sm text-gray-500">
                  Supported formats: PDF, Excel, Word, Images, STP (Max 100MB)
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                <p className="text-gray-600 mb-2">File selected</p>
                <p className="text-sm text-gray-500">{file.name}</p>
                <button
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

          {/* Form Fields */}
          <form id="batteryPackForm" ref={formRef} onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <label className="block font-medium">Chemistry</label>
                <div className="flex gap-2 flex-wrap mt-1">
                  {["NCM", "NCA", "LifePO4", "LIPO"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`px-6 py-3 border rounded-md text-sm bg-[#FAFAFA] ${watch("chemistry") === type ? "bg-orange-500 text-white" : ""}`}
                      onClick={() => {
                        setValue("chemistry", type as FormData["chemistry"])
                        trigger("chemistry")
                      }}
                      disabled={isSubmitting}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {errors.chemistry && <p className="text-red-500 text-sm">{errors.chemistry.message}</p>}
              </div>

              {FormFields.map((field) => (
                <div key={field.name}>
                  <label className="block font-medium">{field.label}</label>
                  <input
                    {...register(field.name as keyof FormData)}
                    className="w-full border p-3 rounded-md mt-1 bg-[#FAFAFA]"
                    placeholder="Write here"
                    disabled={isSubmitting}
                  />
                  {errors[field.name as keyof FormData] && (
                    <p className="text-red-500 text-sm">{errors[field.name as keyof FormData]?.message}</p>
                  )}
                </div>
              ))}

              {/* Dimensions */}
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <label className="block font-medium mt-3">Dimensions (mm)</label>
                <div className="flex gap-2 flex-wrap mt-1">
                  {["H", "W", "L"].map((dim) => (
                    <div key={dim} className="flex flex-col">
                      <input
                        {...register(`dimensions.${dim}` as `dimensions.${keyof FormData["dimensions"]}`)}
                        className="border p-2 rounded-md max-w-[7rem] w-full bg-[#FAFAFA]"
                        placeholder={dim}
                        disabled={isSubmitting}
                      />
                      {errors.dimensions?.[dim as keyof FormData["dimensions"]] && (
                        <p className="text-red-500 text-sm">
                          {errors.dimensions[dim as keyof FormData["dimensions"]]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4">
              <label className="block font-medium">Additional Information</label>
              <textarea
                {...register("additionalInfo")}
                className="w-full border p-2 rounded-md mt-1 bg-[#FAFAFA]"
                placeholder="Write here"
                rows={3}
                disabled={isSubmitting}
              ></textarea>
            </div>

            {/* Protected Submit Button */}
            <ProtectedButton
              type="submit"
              className="mt-6 bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
              formId="batteryPackForm"
            >
              {isSubmitting ? (
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
