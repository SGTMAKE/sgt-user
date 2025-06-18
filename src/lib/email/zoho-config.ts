import nodemailer from "nodemailer"

// Zoho Mail SMTP Configuration
const createZohoTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.zoho.in', // or 'smtp.zoho.com' if needed
    port: 465,
    secure: true,
    auth: {
      user: process.env.ZOHO_EMAIL as string,
      pass: process.env.ZOHO_PASSWORD as string,
    },
  })
}

export { createZohoTransporter }
