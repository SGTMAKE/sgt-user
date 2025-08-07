import { NextResponse } from "next/server"
import { PasswordResetService } from "@/lib/auth/password-reset"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
    }

    // Validate password strength
    const { score, feedback } = PasswordResetService.getPasswordStrength(password)
    if (score < 4) {
      return NextResponse.json(
        {
          error: "Password is too weak",
          feedback,
        },
        { status: 400 },
      )
    }

    // Verify token and get user ID
    const tokenResult = await PasswordResetService.verifyResetToken(token)

    if (!tokenResult) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    // Reset password
    await PasswordResetService.resetPassword(tokenResult.userId, password)

    console.log(`Password successfully reset for user: ${tokenResult.userId}`)

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully",
    })
  } catch (error) {
    console.error("Reset password error:", error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: "An error occurred while resetting your password" }, { status: 500 })
  }
}
