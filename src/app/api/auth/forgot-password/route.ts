import { NextResponse } from "next/server"
import { PasswordResetService } from "@/lib/auth/password-reset"
import { generatePasswordResetEmailTemplate } from "@/lib/email/templates/password-reset-email-template"
import { emailService } from "@/lib/email/email-service"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Create reset token
    const result = await PasswordResetService.createResetToken(email)

    // Always return success to prevent email enumeration attacks
    // But only send email if user exists
    if (result) {
      const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${result.token}`

      const emailTemplate = generatePasswordResetEmailTemplate(resetUrl, email)

      await emailService.sendCustomNotification(
        email,
        "Reset Your SGTMake Password - Secure Link Inside",
        emailTemplate
      )

      console.log(`Password reset email sent to: ${email}`)
    }

    // Clean up expired tokens
    await PasswordResetService.cleanupExpiredTokens()

    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, we have sent a password reset link.",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}
