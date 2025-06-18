"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { AuthForm } from "@/components/auth/auth-form"
import { Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@nextui-org/button"

export default function AuthenticationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status } = useSession()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // Get the callbackUrl from the URL
  const callbackUrl = searchParams?.get("callbackUrl") || "/"

  // Check if we're already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      setIsRedirecting(true)
      setMessage("You're already signed in. Redirecting...")

      // Redirect to the callback URL
      setTimeout(() => {
        router.push(callbackUrl)
      }, 1500)
    }
  }, [status, router, callbackUrl])

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      setIsRedirecting(true)
      setMessage("Redirecting to Google sign-in...")

      // Redirect to Google sign-in
      await signIn("google", { callbackUrl })
    } catch (error) {
      console.error("Error signing in:", error)
      setIsRedirecting(false)
      setMessage("An error occurred during sign-in. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" className="flex items-center text-gray-500" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-center">Sign In</h1>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>

          {isRedirecting ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
              <p className="text-gray-600">{message || "Redirecting..."}</p>
            </div>
          ) : (
            <>
              {message && (
                <div className="mb-6 p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-700">{message}</p>
                </div>
              )}

              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h2 className="font-medium text-blue-800 mb-2">Authentication Required</h2>
                <p className="text-sm text-blue-700">
                  Please sign in to continue with your form submission. Your form data will be preserved.
                </p>
              </div>

              <AuthForm onGoogleSignIn={handleGoogleSignIn} />

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>After signing in, you will be redirected back to continue your submission.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
