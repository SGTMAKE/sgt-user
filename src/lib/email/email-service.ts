import { createZohoTransporter } from "./zoho-config"
import { generateOrderEmailTemplate } from "./templates/order-email-template"
import { generateServiceEmailTemplate } from "./templates/service-email-template"
import type { ItemSummary, AddressProps, ServiceStatus } from "@/lib/types/types"
import { generateQuoteRequestEmailTemplate } from "./templates/quote-request-email-template"

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
          address: process.env.ZOHO_EMAIL_USER!,
        },
        to: process.env.ADMIN_EMAIL || process.env.ZOHO_EMAIL_USER,
        cc: process.env.ADMIN_CC_EMAILS?.split(",").filter(Boolean) || [],
        subject: `🎉 New Order Received - #${data.orderId} (₹${data.totalAmount.toLocaleString()})`,
        html: htmlContent,
        attachments: [
          {
            filename: "ezyzip-logo.png",
            path: process.env.NEXT_PUBLIC_IMAGE_URL + "/logo.png",
            cid: "logo",
          },
        ],
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

      const emoji = serviceTypeEmojis[data.formDetails.type] || "🛠️"

      const mailOptions = {
        from: {
          name: "SGTMAKE Services",
          address: process.env.ZOHO_EMAIL_USER!,
        },
        to: process.env.ADMIN_EMAIL || process.env.ZOHO_EMAIL_USER,
        cc: process.env.ADMIN_CC_EMAILS?.split(",").filter(Boolean) || [],
        subject: `${emoji} New Service Request - ${data.formDetails.type.toUpperCase()} (#${data.id})`,
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
          address: process.env.ZOHO_EMAIL_USER!,
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
      to: process.env.ADMIN_EMAIL || "admin@sgtmake.com",
      cc: process.env.ADMIN_CC_EMAILS?.split(",") || [],
      subject: `New Quote Request #${data.quoteRequestId.slice(-8)} from ${data.customerName}`,
      html,
    })
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
