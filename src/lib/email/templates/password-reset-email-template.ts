export function generatePasswordResetEmailTemplate(resetUrl: string, userEmail: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - SGTMake</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .logo {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 10px;
            color: white;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
        }
        
        .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: transform 0.2s ease;
        }
        
        .reset-button:hover {
            transform: translateY(-2px);
        }
        
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        
        .security-notice {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 20px;
            margin: 30px 0;
            border-radius: 6px;
        }
        
        .security-notice h3 {
            color: #92400e;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .security-notice p {
            color: #78350f;
            font-size: 14px;
            margin-bottom: 8px;
        }
        
        .expiry-info {
            background-color: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        
        .expiry-info .time {
            font-size: 24px;
            font-weight: 700;
            color: #f97316;
            display: block;
        }
        
        .expiry-info .label {
            font-size: 14px;
            color: #6b7280;
            margin-top: 4px;
        }
        
        .alternative-link {
            background-color: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .alternative-link p {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 10px;
        }
        
        .alternative-link code {
            background-color: #e5e7eb;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 12px;
            word-break: break-all;
            display: block;
            margin-top: 8px;
        }
        
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer p {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
        }
        
        .footer .company {
            font-weight: 600;
            color: #f97316;
        }
        
        .social-links {
            margin-top: 20px;
        }
        
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #9ca3af;
            text-decoration: none;
            font-size: 14px;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            
            .header, .content, .footer {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .reset-button {
                display: block;
                width: 100%;
                padding: 18px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">SGTMake</div>
            <h1>🔐 Password Reset</h1>
            <p>Secure access to your SGTMake account</p>
        </div>
        
        <div class="content">
            <div class="greeting">Hello there!</div>
            
            <div class="message">
                We received a request to reset the password for your SGTMake account associated with <strong>${userEmail}</strong>.
                <br><br>
                If you made this request, click the button below to create a new password. If you didn't request this, you can safely ignore this email.
            </div>
            
            <div class="expiry-info">
                <span class="time">60 Minutes</span>
                <div class="label">This link will expire in</div>
            </div>
            
            <div class="button-container">
                <a href="${resetUrl}" class="reset-button">Reset My Password</a>
            </div>
            
            <div class="security-notice">
                <h3>🛡️ Security Notice</h3>
                <p>• This link can only be used once</p>
                <p>• It will expire in 1 hour for your security</p>
                <p>• Never share this link with anyone</p>
                <p>• If you didn't request this, please contact our support team</p>
            </div>
            
            <div class="alternative-link">
                <p><strong>Having trouble with the button?</strong> Copy and paste this link into your browser:</p>
                <code>${resetUrl}</code>
            </div>
        </div>
        
        <div class="footer">
            <p>This email was sent by <span class="company">SGTMake</span></p>
            <p>Your trusted partner for manufacturing solutions</p>
            
            <div class="social-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Contact Support</a>
            </div>
        </div>
    </div>
</body>
</html>
  `
}
