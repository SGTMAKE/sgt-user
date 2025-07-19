import type { ContactFormEmailData } from "@/lib/types/types"

// Common email styling and branding
const getEmailStyles = () => `
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      margin: 0; 
      padding: 0; 
      background-color: #f8fafc;
    }
    .email-container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: white; 
      border-radius: 12px; 
      overflow: hidden; 
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header { 
      background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%); 
      color: white; 
      padding: 30px 20px; 
      text-align: center; 
    }
    .header h1 { 
      margin: 0; 
      font-size: 28px; 
      font-weight: 700; 
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    .header p { 
      margin: 8px 0 0 0; 
      opacity: 0.9; 
      font-size: 16px; 
    }
    .content { 
      padding: 30px; 
    }
    .info-card { 
      background: #f8fafc; 
      border-left: 4px solid #ea580c; 
      padding: 20px; 
      margin: 20px 0; 
      border-radius: 0 8px 8px 0; 
    }
    .spec-table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 20px 0; 
      background: white; 
      border-radius: 8px; 
      overflow: hidden; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .spec-table th, .spec-table td { 
      padding: 12px 16px; 
      text-align: left; 
      border-bottom: 1px solid #e2e8f0; 
    }
    .spec-table th { 
      background: #f1f5f9; 
      font-weight: 600; 
      color: #475569; 
    }
    .spec-table tr:last-child td { 
      border-bottom: none; 
    }
    .action-button { 
      display: inline-block; 
      background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%); 
      color: white; 
      padding: 12px 24px; 
      text-decoration: none; 
      border-radius: 8px; 
      font-weight: 600; 
      margin: 10px 0; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.2); 
      transition: all 0.3s ease;
    }
    .action-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }
    .footer {
      background: #1e293b;
      color: #cbd5e1;
      padding: 30px;
      text-align: center;
    }
    .footer h3 {
      color: #ea580c;
      margin: 0 0 15px 0;
      font-size: 20px;
    }
    .footer p {
      margin: 5px 0;
      font-size: 14px;
    }
    .footer a {
      color: #ea580c;
      text-decoration: none;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-new { background: #dbeafe; color: #1e40af; }
    .status-urgent { background: #fee2e2; color: #991b1b; }
    .highlight { background: #fef3c7; padding: 2px 6px; border-radius: 4px; }
    .inquiry-content {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin: 15px 0;
      font-style: italic;
      line-height: 1.7;
    }
  </style>
`

const getEmailHeader = (title: string, subtitle: string) => `
  <div class="header">
    <h1>🔧 SGTMake</h1>
    <p>${subtitle}</p>
  </div>
`

const getEmailFooter = () => `
  <div class="footer">
    <h3>SGTMake</h3>
    <p>Your trusted partner for premium fasteners & electronic components</p>
    <p>📧 <a href="mailto:support@sgtmake.com">support@sgtmake.com</a> | 📞 +91 94622 23735</p>
    <p>🌐 <a href="https://sgtmake.com">www.sgtmake.com</a></p>
    <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
      This is an automated notification from SGTMake contact form.
    </p>
  </div>
`

export function generateContactEmailTemplate(data: ContactFormEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission - SGTMake</title>
      ${getEmailStyles()}
    </head>
    <body>
      <div class="email-container">
        ${getEmailHeader("New Contact Form Submission", `📞 Contact Inquiry from ${data.customerName}`)}
        
        <div class="content">
          <div class="info-card">
            <h2 style="margin: 0 0 15px 0; color: #ea580c;">📋 Contact Details</h2>
            <p><strong>Contact ID:</strong> <span class="highlight">#${data.contactId.slice(-8).toUpperCase()}</span></p>
            <p><strong>Submission Date:</strong> ${data.submissionDate.toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}</p>
            <p><strong>Status:</strong> <span class="status-badge status-new">📩 New Inquiry</span></p>
          </div>

          <div class="info-card">
            <h2 style="margin: 0 0 15px 0; color: #ea580c;">👤 Customer Information</h2>
            <table class="spec-table">
              <tbody>
                <tr>
                  <td><strong>Name:</strong></td>
                  <td>${data.customerName}</td>
                </tr>
                <tr>
                  <td><strong>Email:</strong></td>
                  <td><a href="mailto:${data.customerEmail}" style="color: #ea580c;">${data.customerEmail}</a></td>
                </tr>
                ${
                  data.company
                    ? `
                <tr>
                  <td><strong>Company:</strong></td>
                  <td>${data.company}</td>
                </tr>
                `
                    : ""
                }
                <tr>
                  <td><strong>Country:</strong></td>
                  <td>${data.country}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="info-card">
            <h2 style="margin: 0 0 15px 0; color: #ea580c;">💬 Inquiry Details</h2>
            <div class="inquiry-content">
              "${data.inquiryDetails}"
            </div>
          </div>

          ${
            data.userAgent || data.ipAddress
              ? `
          <div class="info-card">
            <h3 style="margin: 0 0 10px 0; color: #ea580c;">🔍 Technical Details</h3>
            ${data.ipAddress ? `<p><strong>IP Address:</strong> ${data.ipAddress}</p>` : ""}
            ${data.userAgent ? `<p><strong>User Agent:</strong> <small>${data.userAgent}</small></p>` : ""}
          </div>
          `
              : ""
          }

          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${data.customerEmail}?subject=${encodeURIComponent("Re: Your inquiry to SGTMake")}&body=${encodeURIComponent("Dear ${data.customerName},%0D%0A%0D%0AThank you for contacting SGTMake. We have received your inquiry and will respond within 24 hours.%0D%0A%0D%0ABest regards,%0D%0ASGTMake Team")}" class="action-button">
              📧 Reply to Customer
            </a>
          </div>

          <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #0369a1;">⚡ Recommended Actions:</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Review the customer's inquiry and requirements</li>
              <li>Respond within 24 hours with relevant information</li>
              <li>If applicable, prepare product recommendations or quotes</li>
              <li>Add customer to CRM system for follow-up</li>
              <li>Schedule a call if the inquiry requires detailed discussion</li>
            </ul>
          </div>

          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              <strong>⏰ Response Time Goal:</strong> Please respond to this inquiry within 24 hours to maintain our excellent customer service standards.
            </p>
          </div>
        </div>

        ${getEmailFooter()}
      </div>
    </body>
    </html>
  `
}
