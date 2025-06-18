"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { SubmissionProgress } from "@/components/submission-progress"

interface ServiceFormWrapperProps {
  children: React.ReactNode
  onSubmit: (formData: any) => Promise<any>
  isSubmitting: boolean
  setIsSubmitting: (value: boolean) => void
}

export function ServiceFormWrapper({ children, onSubmit, isSubmitting, setIsSubmitting }: ServiceFormWrapperProps) {
  const { status } = useSession()
  const [pendingSubmission, setPendingSubmission] = useState(false)
  const [pendingFormData, setPendingFormData] = useState<any>(null)
  const [submissionStep, setSubmissionStep] = useState<
    "idle" | "authenticating" | "uploading" | "submitting" | "completed" | "error"
  >("idle")
  const [error, setError] = useState<string | null>(null)

  // Clean up old uploads when component mounts


  const handleSubmit = async (formData: any) => {
    if (status === "unauthenticated") {
      // Store that we have a pending submission
      setPendingSubmission(true)
      setPendingFormData(formData)
      // Update submission step
      setSubmissionStep("authenticating")
      return
    }

    // User is authenticated, proceed with submission
    await performSubmission(formData)
  }

  const performSubmission = async (formData: any) => {
    setIsSubmitting(true)
    setSubmissionStep("submitting")
    setError(null)

    try {
      await onSubmit(formData)
      // Reset pending submission state
      setPendingSubmission(false)
      setPendingFormData(null)
      setSubmissionStep("completed")

      // Reset after 2 seconds
      setTimeout(() => {
        setSubmissionStep("idle")
      }, 2000)
    } catch (error: any) {
      console.error("Error submitting form:", error)
      setError(error.message || "An error occurred during submission")
      setSubmissionStep("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // When auth is successful and we have a pending submission
  const handleAuthSuccess = () => {
    if (pendingSubmission && pendingFormData) {
      performSubmission(pendingFormData)
    }
  }

  // Add form data recovery from localStorage
  useEffect(() => {
    // Check if we have pending form data in localStorage
    try {
      const storedFormData = localStorage.getItem("pendingAuthFormData")
      if (storedFormData && status === "authenticated") {
        const parsedData = JSON.parse(storedFormData)
        console.log("Recovered form data from localStorage:", parsedData)

        // Clear the stored data
        localStorage.removeItem("pendingAuthFormData")

        // If we're authenticated and have pending form data, submit it
        if (parsedData) {
          setPendingFormData(parsedData)
          setPendingSubmission(true)
          performSubmission(parsedData)
        }
      }
    } catch (e) {
      console.error("Error recovering form data:", e)
    }
  }, [status])

  return (
    <>
      {/* Combined Progress and Auth Modal */}
      {submissionStep !== "idle" && (
        <SubmissionProgress
          isOpen={true}
          currentStep={submissionStep}
          error={error || undefined}
          onAuthSuccess={handleAuthSuccess}
          pendingFormData={pendingFormData}
        />
      )}

      {/* Wrap the children with a div that provides the submit handler */}
      <div className="service-form-container">
        {React.Children.map(children, (child) => {
          // Pass the handleSubmit function to the child component
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              onFormSubmit: handleSubmit,
            } as any)
          }
          return child
        })}
      </div>
    </>
  )
}
