import crypto from "crypto"
import bcrypt from "bcrypt"
import { db } from "@/lib/prisma"

export interface PasswordResetToken {
  id: string
  token: string
  userId: string
  expires: Date
  createdAt: Date
}

export class PasswordResetService {
  private static readonly TOKEN_EXPIRY_HOURS = 1
  private static readonly TOKEN_LENGTH = 32

  /**
   * Generate a secure random token
   */
  private static generateSecureToken(): string {
    return crypto.randomBytes(this.TOKEN_LENGTH).toString("hex")
  }

  /**
   * Create a password reset token for a user
   */
  static async createResetToken(email: string): Promise<{ token: string; user: any } | null> {
    try {
      // Find user by email
      const user = await db.user.findUnique({
        where: { email: email.toLowerCase() },
      })

      if (!user) {
        return null
      }

      // Delete any existing tokens for this user
      await db.passwordResetToken.deleteMany({
        where: { userId: user.id },
      })

      // Generate new token
      const token = this.generateSecureToken()
      const hashedToken = await bcrypt.hash(token, 12)

      // Calculate expiry time
      const expires = new Date()
      expires.setHours(expires.getHours() + this.TOKEN_EXPIRY_HOURS)

      // Save token to database
      await db.passwordResetToken.create({
        data: {
          token: hashedToken,
          userId: user.id,
          expires,
        },
      })

      return { token, user }
    } catch (error) {
      console.error("Error creating reset token:", error)
      throw new Error("Failed to create reset token")
    }
  }

  /**
   * Verify and consume a reset token
   */
  static async verifyResetToken(token: string): Promise<{ userId: string } | null> {
    try {
      // Get all non-expired tokens
      const resetTokens = await db.passwordResetToken.findMany({
        where: {
          expires: {
            gt: new Date(),
          },
        },
      })

      // Check each token (since we hash them)
      for (const resetToken of resetTokens) {
        const isValid = await bcrypt.compare(token, resetToken.token)

        if (isValid) {
          // Token is valid, delete it (one-time use)
          await db.passwordResetToken.delete({
            where: { id: resetToken.id },
          })

          return { userId: resetToken.userId }
        }
      }

      return null
    } catch (error) {
      console.error("Error verifying reset token:", error)
      throw new Error("Failed to verify reset token")
    }
  }

  /**
   * Reset user password
   */
  static async resetPassword(userId: string, newPassword: string): Promise<boolean> {
    try {
      // Validate password strength
      if (!this.isPasswordStrong(newPassword)) {
        throw new Error("Password does not meet security requirements")
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12)

      // Update user password
      await db.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      })

      // Clean up any remaining tokens for this user
      await db.passwordResetToken.deleteMany({
        where: { userId },
      })

      return true
    } catch (error) {
      console.error("Error resetting password:", error)
      throw new Error("Failed to reset password")
    }
  }

  /**
   * Clean up expired tokens
   */
  static async cleanupExpiredTokens(): Promise<void> {
    try {
      await db.passwordResetToken.deleteMany({
        where: {
          expires: {
            lt: new Date(),
          },
        },
      })
    } catch (error) {
      console.error("Error cleaning up expired tokens:", error)
    }
  }

  /**
   * Validate password strength
   */
  private static isPasswordStrong(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const minLength = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)

    return minLength && hasUpper && hasLower && hasNumber
  }

  /**
   * Get password strength score
   */
  static getPasswordStrength(password: string): {
    score: number
    feedback: string[]
  } {
    const feedback: string[] = []
    let score = 0

    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push("Use at least 8 characters")
    }

    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push("Include uppercase letters")
    }

    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push("Include lowercase letters")
    }

    if (/\d/.test(password)) {
      score += 1
    } else {
      feedback.push("Include numbers")
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1
      if (score === 5) feedback.push("Excellent password!")
    } else {
      feedback.push("Consider adding special characters")
    }

    return { score, feedback }
  }
}
