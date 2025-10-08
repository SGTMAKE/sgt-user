interface QuoteRequestEmailData {
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

export function generateQuoteRequestEmailTemplate(data: QuoteRequestEmailData): string {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Quote Request - SGTMake Admin</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container {  margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e0e0e0; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
            .customer-info { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e; }
            .urgent-notice { background: #fef3c7; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; border: 2px solid #f59e0b; }
            .items-section { margin: 30px 0; }
            .item-card { background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; margin: 10px 0; }
            .action-buttons { text-align: center; margin: 30px 0; }
            .btn { display: inline-block; padding: 15px 30px; margin: 0 10px; text-decoration: none; border-radius: 6px; font-weight: bold; }
            .btn-primary { background: #f97316; color: white; }
            .btn-primary:hover { background: #ea580c; }
            .btn-secondary { background: #6b7280; color: white; }
            .btn-secondary:hover { background: #4b5563; }
            .specifications { background: #f8f9fa; padding: 10px; border-radius: 4px; margin: 5px 0; font-size: 12px; }
            .priority-high { color: #dc2626; font-weight: bold; }
            h1, h2, h3 { margin-top: 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1> New Quote Request Received!</h1>
                <p>Quote ID: #${data.quoteRequestId.slice(-8)}</p>
            </div>
            
            <div class="content">
                <div class="urgent-notice">
                    <h3 style="margin: 0; color: #f59e0b;">⏰ Action Required</h3>
                    <p style="margin: 5px 0 0 0;">A customer is waiting for your quote response. Please review and respond promptly.</p>
                </div>

                <div class="customer-info">
                    <h3>👤 Customer Information</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <div>
                            <strong>Name:</strong><br>
                            ${data.customerName}
                        </div>
                        <div>
                            <strong>Email:</strong><br>
                            <a href="mailto:${data.customerEmail}">${data.customerEmail}</a>
                        </div>
                        ${
                          data.customerPhone
                            ? `
                        <div>
                            <strong>Phone:</strong><br>
                            <a href="tel:${data.customerPhone}">${data.customerPhone}</a>
                        </div>
                        `
                            : ""
                        }
                        <div>
                            <strong>Submitted:</strong><br>
                            ${formatDate(data.submissionDate)}
                        </div>
                    </div>
                </div>

                <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
                    <h3>📊 Quote Summary</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; text-align: center;">
                        <div>
                            <div style="font-size: 24px; font-weight: bold; color: #f97316;">${data.totalItems}</div>
                            <div style="font-size: 12px; color: #666;">Total Items</div>
                        </div>
                        <div>
                            <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${data.items.length}</div>
                            <div style="font-size: 12px; color: #666;">Product Types</div>
                        </div>
                        <div>
                            <div style="font-size: 24px; font-weight: bold; color: #22c55e;">${new Set(data.items.map((item) => item.type)).size}</div>
                            <div style="font-size: 12px; color: #666;">Categories</div>
                        </div>
                    </div>
                </div>

                <div class="items-section">
                    <h3>🔧 Requested Items</h3>
                    ${data.items
                      .map(
                        (item, index) => `
                        <div class="item-card">
                            <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 10px;">
                                <div>
                                    <h4 style="margin: 0; color: #333;">${item.categoryName}</h4>
                                    <span style="background: #e5e7eb; color: #374151; padding: 2px 8px; border-radius: 12px; font-size: 10px; text-transform: uppercase;">${item.type}</span>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-size: 18px; font-weight: bold; color: #f97316;">×${item.quantity}</div>
                                    <div style="font-size: 10px; color: #666;">Quantity</div>
                                </div>
                            </div>
                            
                            <div><strong>Product:</strong> ${item.title}</div>
                            
                            ${
                              Object.keys(item.specifications).length > 0
                                ? `
                                <div class="specifications">
                                    <strong>Specifications:</strong><br>
                                    ${Object.entries(item.specifications)
                                      .filter(([key, value]) => key !== "quantity" && key !== "remarks" && value)
                                      .map(
                                        ([key, value]) =>
                                          `<strong>${key.replace(/_/g, " ").toUpperCase()}:</strong> ${Array.isArray(value) ? value.join(", ") : value}`,
                                      )
                                      .join("<br>")}
                                </div>
                            `
                                : ""
                            }
                        </div>
                    `,
                      )
                      .join("")}
                </div>

                ${
                  data.notes
                    ? `
                    <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                        <h3 style="color: #92400e;">💬 Customer Notes</h3>
                        <p style="color: #92400e;">${data.notes}</p>
                    </div>
                `
                    : ""
                }

                <div class="action-buttons">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://sgt-make-admin.vercel.app"}/dashboard/quote/" class="btn btn-primary">
                        📝 Respond to Quote
                    </a>
                    <a href="mailto:${data.customerEmail}?subject=Quote%20Inquiry%20%23${data.quoteRequestId.slice(-8)}" class="btn btn-secondary">
                        📧 Contact Customer
                    </a>
                </div>

                <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #0ea5e9;">
                    <h4 style="margin: 0 0 10px 0; color: #0c4a6e;">⚡ Quick Actions</h4>
                    <ul style="margin: 0; padding-left: 20px; color: #0c4a6e;">
                        <li>Review customer requirements and specifications</li>
                        <li>Calculate competitive pricing for all items</li>
                        <li>Prepare detailed quote response with delivery timeline</li>
                        <li>Send quote response through admin panel</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>SGTMake Admin Panel</strong></p>
                <p style="font-size: 12px; color: #666;">
                    Quote received on ${formatDate(data.submissionDate)}
                </p>
                <p style="font-size: 12px; color: #666;">
                    Please respond within 24 hours for best customer experience
                </p>
            </div>
        </div>
    </body>
    </html>
  `
}
