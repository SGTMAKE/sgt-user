"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { AuthForm } from "@/components/auth/auth-form"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

interface EnhancedAuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  pendingFormData?: any
}

export function EnhancedAuthModal({ isOpen, onClose, onSuccess, pendingFormData }: EnhancedAuthModalProps) {
  const { status } = useSession()
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [googleAuthUrl, setGoogleAuthUrl] = useState("")

  // Listen for messages from the popup window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify the origin of the message
      if (event.origin !== window.location.origin) return

      if (event.data.type === "AUTH_SUCCESS") {
        setIsAuthenticating(false)
        // Short delay to allow the session to be updated
        setTimeout(() => {
          onSuccess()
        }, 500)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [onSuccess])

  // Close modal and trigger success callback when user becomes authenticated
  useEffect(() => {
    if (status === "authenticated" && isOpen) {
      onClose()
      onSuccess()
    }
  }, [status, isOpen, onClose, onSuccess])

  // Generate Google auth URL with state parameter to store form data
  useEffect(() => {
    if (isOpen && pendingFormData) {
      // Encode form data in state parameter
      const state = encodeURIComponent(JSON.stringify({ formData: pendingFormData }))
      setGoogleAuthUrl(`/api/auth/google-signin?state=${state}`)
    }
  }, [isOpen, pendingFormData])

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

  return (
    <Dialog  open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="relative ">
          {/* Hidden iframe for Google auth */}
          <iframe ref={iframeRef} className="hidden" title="Google Auth" />

          {isAuthenticating ? (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">Authenticating...</h2>
                <p className="text-gray-500 text-center max-w-xs">
                  Please complete the authentication process in the popup window.
                </p>
                <button
                  onClick={() => setIsAuthenticating(false)}
                  className="mt-6 text-sm text-orange-600 hover:text-orange-700"
                >
                  Cancel
                </button>
              </motion.div>
            </div>
          ) : (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-center mb-4">Sign in to continue</h2>
              <p className="text-sm text-gray-500 text-center mb-6">
                Please sign in or create an account to submit your form
              </p>

              {/* Pass custom Google sign-in handler to AuthForm */}
              <AuthForm onGoogleSignIn={handleGoogleSignIn} />

              {pendingFormData && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-700">Your form data will be preserved during sign in.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
