"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { SubmissionProgress } from "@/components/submission-progress"
import { useFormSubmission } from "@/hooks/use-form-submission"
import { ProtectedButton } from "@/components/protected-button"

// Define allowed file types and max size
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/jpg",
  "text/csv",
]

// Define the form schema
const formSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),
})

type FormData = z.infer<typeof formSchema>

interface WiringHarnessFormProps {
  onFormSubmit?: (formData: any) => Promise<void>
}

export default function Page() {
  return <WiringHarnessForm />
}

function WiringHarnessForm(props: WiringHarnessFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)
  const [submittedServiceId, setSubmittedServiceId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const session = useSession()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    trigger,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 1,
      description: "",
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Check file type
      const isAllowedType = ALLOWED_FILE_TYPES.includes(selectedFile.type)

      if (!isAllowedType || selectedFile.size > MAX_FILE_SIZE) {
        setErrorMessage("Invalid file type or size exceeds 100MB")
        return
      }

      setFile(selectedFile)
      setErrorMessage(null)
    }
  }

  const submitFormToServer = async (formData: any, fileData: any) => {
    const response = await fetch("/api/service/wiring-harness", {
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
            setValue(key as any, value as any)
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
      {/* Header Image */}
      <div className="w-full h-48 md:h-64 mb-6 relative rounded-xl overflow-hidden">
        <Image src="/wireHarnessBanner.jpg" alt="Wiring Harness Header" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Wiring Harness</h1>
        </div>
      </div>

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
          <h2 className="text-2xl font-medium text-green-800 mb-2">
            Thanks {session.data?.user?.name || "for your order"}
          </h2>
          <p className="text-green-700 mb-2">We will get back to you soon with a quote.</p>
          {submittedServiceId && <p className="text-green-700 mb-4">Service ID: {submittedServiceId}</p>}
          <button
            onClick={() => {
              setFormSuccess(false)
              setFile(null)
              reset()
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Submit Another Order
          </button>
        </div>
      ) : (
        <>
          {/* File Upload */}
          <div className="border border-gray-300 h-56 md:h-96 rounded-xl text-center bg-[#f5f3f3] mb-6 flex flex-col items-center justify-center">
            <input
              ref={fileInputRef}
              type="file"
              id="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".docx,.pdf,.jpg,.jpeg,.png,.xls,.xlsx,.csv"
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
                <div className="mt-2 text-sm text-gray-500 max-w-md px-4">
                  <p className="mb-2">Support uploading cable pictures, cable drawings, and cable specifications</p>
                  <p>Supports .docx, .pdf, .jpg, .jpeg, .png, .xls, .xlsx, and .csv</p>
                </div>
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

          {/* Our Process */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 ">Our Process</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 font-semibold">
              <div className="bg-[#FAFAFA] py-5 sm:py-10 rounded-lg border text-center ">
                <div className="flex justify-center mb-2">
                  <Image src="/customcable.png" alt="Custom Cables" width={60} height={60} />
                </div>
                <p className="text-sm">Custom Cables</p>
              </div>
              <div className=" py-5 sm:py-10 bg-[#FAFAFA] rounded-lg border text-center">
                <div className="flex justify-center mb-2">
                  <Image src="/confirmplan.png" alt="Confirm Plan" width={60} height={60} />
                </div>
                <p className="text-sm">Confirm Plan</p>
              </div>
              <div className=" py-5 sm:py-10 bg-[#FAFAFA] rounded-lg border text-center">
                <div className="flex justify-center mb-2">
                  <Image src="/production.png" alt="In Production" width={60} height={60} />
                </div>
                <p className="text-sm">In Production</p>
              </div>
              <div className=" py-5 sm:py-10 bg-[#FAFAFA] rounded-lg border text-center">
                <div className="flex justify-center mb-2">
                  <Image src="/transpot.png" alt="Transportation" width={60} height={60} />
                </div>
                <p className="text-sm">Transportation</p>
              </div>
              <div className=" py-5 sm:py-10 bg-[#FAFAFA] rounded-lg border text-center">
                <div className="flex justify-center mb-2">
                  <Image src="/delivered.png" alt="Delivered" width={60} height={60} />
                </div>
                <p className="text-sm">Delivered</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <form id="wiringHarnessForm" ref={formRef} onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white p-6 rounded-lg border mb-6">
              <h2 className="text-xl font-semibold mb-4">Notes:</h2>
              <div className="mb-6 text-gray-700">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Upload the file in above section</li>
                  <li>.xls or .xlsx file is most preferred with images for proper understanding</li>
                  <li>Mention Connector names for left and right side in the description box</li>
                  <li>For only connector on one side and wire end at other side mention clearly</li>
                  <li>Mention wire length and color coding in the file you upload</li>
                  <li>Mention Quantity of set of harness required in description box</li>
                  <li>Type of electrical tape required on harness mention in Description box or in file</li>
                  <li>Extra requirement you can mention in the description box below</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Description Box</h3>
                <textarea
                  {...register("description")}
                  className="w-full border p-3 rounded-md bg-[#FAFAFA]"
                  rows={6}
                  placeholder="Describe your harness specification and other requirements here."
                  disabled={isSubmitting}
                ></textarea>
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium mb-2">Quantity</h3>
                  <input
                    type="number"
                    {...register("quantity", { valueAsNumber: true })}
                    min="1"
                    className="w-24 border p-2 rounded-md bg-[#FAFAFA]"
                    disabled={isSubmitting}
                  />
                  {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
                </div>

                <ProtectedButton
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                  formId="wiringHarnessForm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </ProtectedButton>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
