import { createZohoTransporter } from "./zoho-config"
import { generateOrderEmailTemplate } from "./templates/order-email-template"
import { generateServiceEmailTemplate } from "./templates/service-email-template"
import type { ItemSummary, AddressProps, ServiceStatus, ServiceType, ContactFormEmailData  } from "@/lib/types/types"
import { generateQuoteRequestEmailTemplate } from "./templates/quote-request-email-template"
import { generateContactEmailTemplate } from "./templates/contact-email-template"
import { generatePasswordResetEmailTemplate } from "./templates/password-reset-email-template"

export interface EmailResponse {
  success: boolean
  messageId?: string
  error?: string
}
interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  orderDate: Date
  totalAmount: number
  orderItems: ItemSummary[]
  shippingAddress: AddressProps
  paymentStatus: boolean
  paymentMethod?: string
  shippingCost?: number
}
interface QuoteRequestNotificationData {
  quoteRequestId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  submissionDate: Date
  items: Array<{
    type: "fastener" | "connector" | "wire"
    categoryName: string
    title: string
    quantity: number
    specifications: Record<string, any>
    image?: string
  }>
  totalItems: number
  notes: string
}
interface ServiceEmailData extends ServiceStatus {
  customerName: string
  customerEmail: string
  customerPhone?: string
}
export interface PasswordResetEmailData {
  userName: string
  userEmail: string
  resetToken: string
  resetUrl: string
  expiresIn: number // minutes
  requestIp?: string
  requestUserAgent?: string
  requestDate: Date
}

export class EmailService {
  private transporter

  constructor() {
    this.transporter = createZohoTransporter()
  }

  async sendOrderNotification(data: OrderEmailData): Promise<boolean> {
    try {
      const htmlContent = generateOrderEmailTemplate(data)

      const mailOptions = {
        from: {
          name: "SGTMake Orders",
          address: process.env.ZOHO_EMAIL!,
        },
        to: process.env.ADMIN_EMAIL || process.env.ZOHO_EMAIL,
        cc: process.env.ADMIN_CC_EMAILS?.split(",").filter(Boolean) || [],
        subject: `🎉 New Order Received - #${data.orderId} (₹${data.totalAmount.toLocaleString()})`,
        html: htmlContent,
    
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log("Order email sent successfully:", result.messageId)
      return true
    } catch (error) {
      console.error("Failed to send order email:", error)
      return false
    }
  }

  async sendServiceNotification(data: ServiceEmailData): Promise<boolean> {
    try {
      const htmlContent = generateServiceEmailTemplate(data)

      const serviceTypeEmojis: Record<string, string> = {
        "cnc-machining": "🔧",
        "laser-cutting": "⚡",
        "3d-printing": "🖨️",
        wiringHarness: "🔌",
        batteryPack: "🔋",
      }

      const emoji = serviceTypeEmojis[data.type] || "🛠️"

      const mailOptions = {
        from: {
          name: "SGTMAKE Services",
          address: process.env.ZOHO_EMAIL!,
        },
        to: process.env.ADMIN_EMAIL || process.env.ZOHO_EMAIL,
        cc: process.env.ADMIN_CC_EMAILS?.split(",").filter(Boolean) || [],
        subject: `${emoji} New Service Request - ${data.type.toUpperCase()} (#${data.id})`,
        html: htmlContent,
        
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log("Service email sent successfully:", result.messageId)
      return true
    } catch (error) {
      console.error("Failed to send service email:", error)
      return false
    }
  }

  async sendCustomNotification(
    to: string,
    subject: string,
    htmlContent: string,
    attachments?: any[],
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: {
          name: "SGTMAKE",
          address: process.env.ZOHO_EMAIL!,
        },
        to,
        subject,
        html: htmlContent,
        attachments: attachments || [],
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log("Custom email sent successfully:", result.messageId)
      return true
    } catch (error) {
      console.error("Failed to send custom email:", error)
      return false
    }
  }

  async sendQuoteRequestNotification(data: QuoteRequestNotificationData): Promise<void> {
    const html = generateQuoteRequestEmailTemplate(data)

    await this.transporter.sendMail({
      from: {
          name: "SGTMAKE Quotes",
          address: process.env.ZOHO_EMAIL!,
      },
      to: process.env.ADMIN_EMAIL || "support@sgtmake.com",
      cc: process.env.ADMIN_CC_EMAILS?.split(",") || [],
      subject: `New Quote Request #${data.quoteRequestId.slice(-8)} from ${data.customerName}`,
      html,
    })
  }
    async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<EmailResponse> {
    try {
      const htmlContent = generatePasswordResetEmailTemplate(data.resetUrl, data.userEmail)

      const mailOptions = {
        from: {
          name: "SGTMake Account Security",
          address: process.env.ZOHO_EMAIL!,
        },
        to: data.userEmail,
        subject: `🔐 Password Reset Request - SGTMake Account`,
        html: htmlContent,
        priority: "high" as "high",
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log("Password reset email sent successfully:", result.messageId)
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error("Failed to send password reset email:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

   async sendContactFormNotification(data: ContactFormEmailData): Promise<EmailResponse> {
    try {
      const htmlContent = generateContactEmailTemplate(data)

      const mailOptions = {
        from: {
          name: "SGTMake Contact Form",
          address: process.env.ZOHO_EMAIL!,
        },
        to: process.env.ADMIN_EMAIL || process.env.ZOHO_EMAIL,
        cc: process.env.ADMIN_CC_EMAILS?.split(",").filter(Boolean) || [],
        subject: `📞 New Contact Form Submission from ${data.customerName} (${data.country})`,
        html: htmlContent,
        replyTo: data.customerEmail,
      }

      const result = await this.transporter.sendMail(mailOptions)
      console.log("Contact form email sent successfully:", result.messageId)
      return { success: true, messageId: result.messageId }
    } catch (error) {
      console.error("Failed to send contact form email:", error)
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify()
      console.log("Zoho email connection verified successfully")
      return true
    } catch (error) {
      console.error("Zoho email connection failed:", error)
      return false
    }
  }
}

// Singleton instance
export const emailService = new EmailService()
