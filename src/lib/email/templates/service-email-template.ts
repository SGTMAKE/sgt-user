import { formateDateString } from "@/lib/utils"
import type { ServiceType } from "@/lib/types/types"
export interface ServiceStatus {
  id: string
  status: string
  createdAt: string | Date
  updatedAt: string | Date
  userId: string
  fileUrl?: string
  filePublicId?: string
  fileType?: string
  type:  string
  formDetails : any
 
}
interface ServiceEmailData extends ServiceStatus {
  customerName: string
  customerEmail: string
  customerPhone?: string
}
export const generateServiceEmailTemplate = (data: ServiceEmailData): string => {
  const { id, customerName, customerEmail, customerPhone, createdAt, formDetails, fileUrl, fileType, type  } = data

  const getServiceTypeDisplay = (serviceType: ServiceType): string => {
    const types: Record<ServiceType, string> = {
      "cnc-machining": "🔧 CNC Machining",
      "laser-cutting": "⚡ Laser Cutting",
      "3d-printing": "🖨️ 3D Printing",
      wiringHarness: "🔌 Wiring Harness",
      batteryPack: "🔋 Battery Pack",
    }
    return types[serviceType] || serviceType
  }

  const formatFieldName = (key: string): string => {
    // Convert camelCase to readable format
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/Id$/, " ID")
      .replace(/Url$/, " URL")
      .replace(/Api$/, " API")
  }

  const formatFieldValue = (value: any): string => {
    if (value === null || value === undefined) {
      return "Not specified"
    }

    if (typeof value === "boolean") {
      return value ? "Yes" : "No"
    }

    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return value.join(", ")
      }

      // Handle nested objects like dimensions
      if (value && typeof value === "object") {
        return Object.entries(value)
          .map(([k, v]) => `${formatFieldName(k)}: ${v}`)
          .join(", ")
      }
    }

    return String(value)
  }

  const renderServiceDetails = (): string => {
    if (!formDetails || typeof formDetails !== "object") {
      return '<div class="service-details"><p>No service details available</p></div>'
    }

    // Filter out common fields that don't need to be displayed or are displayed elsewhere
    const excludeFields = ["type", "remarks", "additionalInfo", "notes"]

    const detailRows = Object.entries(formDetails)
      .filter(([key, value]) => !excludeFields.includes(key) && value !== null && value !== undefined && value !== "")
      .map(
        ([key, value]) => `
        <div class="detail-row">
          <span class="detail-label">${formatFieldName(key)}:</span>
          <span class="detail-value">${formatFieldValue(value)}</span>
        </div>
      `,
      )
      .join("")

    return `
      <div class="service-details">
        ${detailRows || "<p>No specifications provided</p>"}
      </div>
    `
  }

  const renderAdditionalNotes = (): string => {
    // Look for common note fields
    const noteFields = ["remarks", "additionalInfo", "notes", "description"]
    const notes = noteFields
      .map((field) => formDetails[field])
      .filter((note) => note && typeof note === "string" && note.trim().length > 0)

    if (notes.length === 0) {
      return ""
    }

    return `
      <h2 class="section-title">💬 Additional Notes</h2>
      <div class="service-details">
        ${notes.map((note) => `<p style="color: #666; font-style: italic; margin-bottom: 10px;">"${note}"</p>`).join("")}
      </div>
    `
  }

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return formateDateString(dateObj)
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Service Request - ${id}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f8f9fa;
            }
            
            .container {
                max-width: 800px;
                margin: 0 auto;
                background-color: #ffffff;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            
            .header {
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            
            .header h1 {
                font-size: 28px;
                margin-bottom: 10px;
                font-weight: 600;
            }
            
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            
            .content {
                padding: 30px;
            }
            
            .service-summary {
                background-color: #f8f9fa;
                border-radius: 12px;
                padding: 25px;
                margin-bottom: 30px;
                border-left: 4px solid #28a745;
            }
            
            .service-info {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 25px;
            }
            
            .info-item {
                background: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            
            .info-label {
                font-size: 12px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
                font-weight: 600;
            }
            
            .info-value {
                font-size: 16px;
                font-weight: 600;
                color: #333;
            }
            
            .section-title {
                font-size: 20px;
                font-weight: 600;
                color: #333;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 2px solid #e9ecef;
            }
            
            .service-details {
                background: white;
                border-radius: 12px;
                padding: 25px;
                margin-bottom: 30px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            
            .detail-row {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                padding: 12px 0;
                border-bottom: 1px solid #e9ecef;
            }
            
            .detail-row:last-child {
                border-bottom: none;
            }
            
            .detail-label {
                font-weight: 600;
                color: #666;
                flex: 1;
                min-width: 150px;
            }
            
            .detail-value {
                font-weight: 600;
                color: #333;
                flex: 2;
                text-align: right;
                word-break: break-word;
            }
            
            .file-section {
                background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
                color: white;
                padding: 25px;
                border-radius: 12px;
                margin-bottom: 30px;
                text-align: center;
            }
            
            .file-icon {
                font-size: 48px;
                margin-bottom: 15px;
            }
            
            .file-info {
                font-size: 16px;
                margin-bottom: 15px;
            }
            
            .file-link {
                display: inline-block;
                background: rgba(255,255,255,0.2);
                color: white;
                padding: 12px 24px;
                border-radius: 25px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            
            .file-link:hover {
                background: rgba(255,255,255,0.3);
                transform: translateY(-2px);
            }
            
            .action-required {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 30px;
            }
            
            .action-required h3 {
                color: #856404;
                margin-bottom: 10px;
                font-size: 18px;
            }
            
            .action-required p {
                color: #856404;
                margin-bottom: 0;
            }
            
            .customer-section {
                background-color: #f8f9fa;
                border-radius: 12px;
                padding: 25px;
                margin-bottom: 30px;
            }
            
            .customer-details {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            
            .customer-line {
                margin-bottom: 8px;
                color: #333;
            }
            
            .footer {
                background-color: #343a40;
                color: white;
                padding: 30px;
                text-align: center;
            }
            
            .footer p {
                margin-bottom: 10px;
                opacity: 0.8;
            }
            
            .service-type-badge {
                display: inline-block;
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 15px;
            }
            
            @media (max-width: 600px) {
                .container {
                    margin: 0;
                    box-shadow: none;
                }
                
                .content {
                    padding: 20px;
                }
                
                .service-info {
                    grid-template-columns: 1fr;
                }
                
                .detail-row {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 5px;
                }
                
                .detail-value {
                    text-align: left;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🛠️ New Service Request!</h1>
                <p>Request #${id.slice(-8)} • ${formatDate(createdAt)}</p>
            </div>
            
            <div class="content">
                <div class="action-required">
                    <h3>⚡ Action Required</h3>
                    <p>A new service request has been submitted and requires your attention. Please review the specifications and provide a quotation.</p>
                </div>
                
                <div class="service-summary">
                    <div class="service-type-badge">
                        ${getServiceTypeDisplay(type as ServiceType)}
                    </div>
                    <div class="service-info">
                        <div class="info-item">
                            <div class="info-label">Request ID</div>
                            <div class="info-value">#${id.slice(-8)}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Service Type</div>
                            <div class="info-value">${getServiceTypeDisplay(type as ServiceType)}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Submitted Date</div>
                            <div class="info-value">${formatDate(createdAt)}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Status</div>
                            <div class="info-value">🔄 Pending Review</div>
                        </div>
                    </div>
                </div>
                
                <h2 class="section-title">👤 Customer Information</h2>
                <div class="customer-section">
                    <div class="customer-details">
                        <div class="customer-line"><strong>Name:</strong> ${customerName}</div>
                        <div class="customer-line"><strong>Email:</strong> ${customerEmail}</div>
                        ${customerPhone ? `<div class="customer-line"><strong>Phone:</strong> ${customerPhone}</div>` : ""}
                    </div>
                </div>
                
                <h2 class="section-title">📋 Service Specifications</h2>
                ${renderServiceDetails()}
                
                ${renderAdditionalNotes()}
                
                ${
                  fileUrl
                    ? `
                <h2 class="section-title">📎 Attached Files</h2>
                <div class="file-section">
                    <div class="file-icon">📄</div>
                    <div class="file-info">
                        Design file attached (${fileType || "Unknown format"})
                    </div>
                    <a href="${fileUrl}" class="file-link" target="_blank">
                        📥 Download File
                    </a>
                </div>
                `
                    : ""
                }
            </div>
            
            <div class="footer">
                <p><strong>SGTMAKE Admin Panel</strong></p>
                <p>This is an automated notification. Please log in to your admin panel to manage this service request.</p>
                <p>© ${new Date().getFullYear()} SGTMAKE. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `
}
