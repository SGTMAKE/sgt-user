import { createZohoTransporter } from "./zoho-config"
import { generateOrderEmailTemplate } from "./templates/order-email-template"
import { generateServiceEmailTemplate } from "./templates/service-email-template"
import type { ItemSummary, AddressProps, ServiceStatus } from "@/lib/types/types"

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
          name: "ezyZip Services",
          address: process.env.ZOHO_EMAIL_USER!,
        },
        to: process.env.ADMIN_EMAIL || process.env.ZOHO_EMAIL_USER,
        cc: process.env.ADMIN_CC_EMAILS?.split(",").filter(Boolean) || [],
        subject: `${emoji} New Service Request - ${data.formDetails.type.toUpperCase()} (#${data.id})`,
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
          name: "ezyZip",
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
