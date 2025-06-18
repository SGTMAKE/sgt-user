"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

type SubmissionStep = "idle" | "authenticating" | "uploading" | "submitting" | "completed" | "error"

interface UseFormSubmissionProps {
  onSubmitForm: (formData: any, fileData: any) => Promise<any>
  onSuccess?: (result: any) => void
}

export function useFormSubmission({ onSubmitForm, onSuccess }: UseFormSubmissionProps) {
  const { status } = useSession()
  const [submissionStep, setSubmissionStep] = useState<SubmissionStep>("idle")
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingFormData, setPendingFormData] = useState<any>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [uploadedFileData, setUploadedFileData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async (formData: any, file: File | null) => {
    setError(null)

    // Check authentication
    if (status !== "authenticated") {
      setSubmissionStep("authenticating")
      setPendingFormData(formData)
      setPendingFile(file)
      setShowAuthModal(true)
      return
    }

    // Start submission process
    await processSubmission(formData, file)
  }

  const processSubmission = async (formData: any, file: File | null) => {
    try {
      // Upload file if provided
      let fileData = null
      if (file) {
        setSubmissionStep("uploading")
        fileData = await uploadFile(file)
        setUploadedFileData(fileData)
      }

      // Submit form
      setSubmissionStep("submitting")
      const result = await onSubmitForm(formData, fileData)
      setResult(result)

      // Complete
      setSubmissionStep("completed")

      if (onSuccess) {
        onSuccess(result)
      }

      // Reset after 2 seconds
      setTimeout(() => {
        setSubmissionStep("idle")
      }, 2000)

      return result
    } catch (err: any) {
      setError(err.message || "An error occurred during submission")
      setSubmissionStep("error")
      throw err
    }
  }

  const uploadFile = async (file: File): Promise<any> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/service/upload", {
      method: "POST",
      headers: {
        // No Content-Type header for FormData
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Error uploading file")
    }

    return await response.json()
  }

  const handleAuthSuccess = async () => {
    setShowAuthModal(false)

    // Wait a moment for the session to be updated
    setTimeout(async () => {
      // Check if the user is now authenticated
      if (status === "authenticated" && pendingFormData) {
        await processSubmission(pendingFormData, pendingFile)
      }
    }, 500)
  }

  return {
    submissionStep,
    showAuthModal,
    setShowAuthModal,
    handleSubmit,
    handleAuthSuccess,
    error,
    result,
    pendingFormData,
    isSubmitting: submissionStep !== "idle" && submissionStep !== "completed" && submissionStep !== "error",
  }
}
