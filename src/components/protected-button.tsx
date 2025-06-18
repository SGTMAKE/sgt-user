"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@nextui-org/button"

interface ProtectedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  formData?: any
  formId?: string
  preserveFormData?: boolean
}

export function ProtectedButton({
  children,
  onClick,
  className,
  disabled = false,
  type = "button",
  variant = "default",
  formData,
  formId,
  preserveFormData = true,
}: ProtectedButtonProps) {
  const { status } = useSession()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (status !== "authenticated") {
      e.preventDefault()
      setIsRedirecting(true)

      if (preserveFormData) {
        if (typeof window !== "undefined") {
          const currentUrl = window.location.href
          localStorage.setItem("authRedirectUrl", currentUrl)

          if (formData) {
            localStorage.setItem("pendingFormData", JSON.stringify(formData))
            localStorage.setItem("pendingFormPage", window.location.pathname)
          } else if (formId) {
            const form = document.getElementById(formId) as HTMLFormElement
            if (form) {
              const formDataObj = new FormData(form)
              const formDataJson: Record<string, any> = {}

              formDataObj.forEach((value, key) => {
                if (key.includes(".")) {
                  const [parent, child] = key.split(".")
                  if (!formDataJson[parent]) {
                    formDataJson[parent] = {}
                  }
                  formDataJson[parent][child] = value
                } else {
                  formDataJson[key] = value
                }
              })

              localStorage.setItem("pendingFormData", JSON.stringify(formDataJson))
              localStorage.setItem("pendingFormPage", window.location.pathname)
            }
          }

          const fileInputs = document.querySelectorAll('input[type="file"]')
          if (fileInputs.length > 0) {
            for (const input of Array.from(fileInputs)) {
              if ((input as HTMLInputElement).files && (input as HTMLInputElement).files!.length > 0) {
                localStorage.setItem("hadPendingFile", "true")
                break
              }
            }
          }
        }
      }

      router.push(`/auth?callbackUrl=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "/")}`)
    } else if (onClick) {
      onClick()
    }
  }

  useEffect(() => {
    if (status === "authenticated" && isRedirecting) {
      setIsRedirecting(false)
    }
  }, [status, isRedirecting])

  return (
    <Button
      onClick={handleClick}
      className={className}
      disabled={disabled || isRedirecting || status === "loading"}
      type={type}
    >
      {isRedirecting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Redirecting...
        </>
      ) : (
        children
      )}
    </Button>
  )
}
