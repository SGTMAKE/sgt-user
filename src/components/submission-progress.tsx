"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CheckCircle, Loader2, UserCheck, Upload, Send } from "lucide-react"
import { motion } from "framer-motion"
import { AuthForm } from "@/components/auth/auth-form"

interface SubmissionProgressProps {
  isOpen: boolean
  currentStep: "authenticating" | "uploading" | "submitting" | "completed" | "error"
  error?: string
  onAuthSuccess?: () => void
  pendingFormData?: any
}

export function SubmissionProgress({
  isOpen,
  currentStep,
  error,
  onAuthSuccess,
  pendingFormData,
}: SubmissionProgressProps) {
  const [progress, setProgress] = useState(0)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  // Animate progress based on current step
  useEffect(() => {
    if (currentStep === "authenticating") {
      setProgress(0)
    } else if (currentStep === "uploading") {
      setProgress(33)
    } else if (currentStep === "submitting") {
      setProgress(66)
    } else if (currentStep === "completed") {
      setProgress(100)
    }
  }, [currentStep])

  // Custom handler for Google sign-in
  const handleGoogleSignIn = () => {
    setIsAuthenticating(true)

    // Open Google auth in a popup window
    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    const popup = window.open(
      `/api/auth/google-signin${pendingFormData ? `?state=${encodeURIComponent(JSON.stringify({ formData: pendingFormData }))}` : ""}`,
      "GoogleSignIn",
      `width=${width},height=${height},left=${left},top=${top}`,
    )

    // Check if popup was blocked
    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      setIsAuthenticating(false)
      alert("Popup blocked. Please allow popups for this website.")
    }
  }

  // Listen for messages from the popup window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify the origin of the message
      if (event.origin !== window.location.origin) return

      if (event.data.type === "AUTH_SUCCESS") {
        setIsAuthenticating(false)
        // Short delay to allow the session to be updated
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess()
        }, 500)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [onAuthSuccess])

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="flex flex-col items-center justify-center p-6">
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
            <motion.div
              className="h-full bg-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          {currentStep === "authenticating" && !isAuthenticating ? (
            <div className="w-full">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium">Authentication Required</h3>
                <p className="text-sm text-gray-500 mt-2 mb-6">Please sign in to continue with your submission</p>
              </div>

              {/* Authentication Form */}
              {/* <AuthForm onGoogleSignIn={handleGoogleSignIn} /> */}

              {pendingFormData && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-700">Your form data will be preserved during sign in.</p>
                </div>
              )}
            </div>
          ) : currentStep === "authenticating" && isAuthenticating ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserCheck className="w-10 h-10 text-blue-500" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                </div>
              </div>
              <h3 className="text-lg font-medium">Authenticating...</h3>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Please complete the authentication process in the popup window.
              </p>
              <button
                onClick={() => setIsAuthenticating(false)}
                className="mt-6 text-sm text-blue-600 hover:text-blue-700"
              >
                Cancel
              </button>
            </motion.div>
          ) : currentStep === "uploading" ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                  <Upload className="w-10 h-10 text-orange-500" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full">
                  <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                </div>
              </div>
              <h3 className="text-lg font-medium mt-4">Uploading File...</h3>
              <p className="text-sm text-gray-500 mt-2">Uploading your file to our servers</p>
            </motion.div>
          ) : currentStep === "submitting" ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
                  <Send className="w-10 h-10 text-purple-500" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full">
                  <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                </div>
              </div>
              <h3 className="text-lg font-medium mt-4">Submitting Form...</h3>
              <p className="text-sm text-gray-500 mt-2">Processing your request</p>
            </motion.div>
          ) : currentStep === "completed" ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-lg font-medium mt-4">Submission Complete!</h3>
              <p className="text-sm text-gray-500 mt-2">Your form has been successfully submitted</p>
            </motion.div>
          ) : currentStep === "error" ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-500 text-2xl font-bold">!</span>
              </div>
              <h3 className="text-lg font-medium text-red-500 mt-4">Submission Failed</h3>
              <p className="text-sm text-red-400 mt-2 text-center">{error || "An error occurred during submission"}</p>
            </motion.div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
