import type { Metadata } from "next"
import ForgotPasswordForm from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot Password - SGTMake",
  description: "Reset your SGTMake account password securely",
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
