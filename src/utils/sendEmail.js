import path from "path";
import dotenv from "dotenv";
import { Resend } from "resend";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../config.env") });

const resend = new Resend(process.env.RESEND_API_KEY);

function getMessage(token) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickQuack - Password Reset</title>
    <style>
        body { font-family: 'Poppins', sans-serif; background: #f5f7fa; }
        .otp-box {
    background: #f0f4ff;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    margin: 25px 0;
    border: 1px dashed #3b82f6;
    word-break: break-all;  /* Breaks long strings */
    overflow-wrap: break-word;  /* Prevents overflow */
    max-width: 100%;  /* Ensures box doesn't exceed container */
  }
  .otp {
    font-size: 24px;  /* Slightly smaller font */
    font-weight: 700;
    color: #1e40af;
    font-family: monospace;  /* Fixed-width font for alignment */
    line-height: 1.4;  /* Better spacing */
  }
        .email-container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px; text-align: center; }
        .logo { color: white; font-size: 28px; font-weight: 700; }
        .content { padding: 30px; }
        .otp-box { background: #f0f4ff; border-radius: 8px; padding: 15px; text-align: center; margin: 25px 0; border: 1px dashed #3b82f6; }
        .otp { font-size: 32px; font-weight: 700; color: #1e40af; letter-spacing: 3px; }
        .button { background: #3b82f6; color: white; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-weight: 600; display: flex; justify-content: center }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">QuickQuack</div>
        </div>
        
        <div class="content">
            <h1>Password Reset Request</h1>
            <p>Hello there,</p>
            <p>We received a request to reset your QuickQuack account password. Here's your OTP:</p>
            
            <div class="otp-box">
                <div class="otp">${token}</div>
                <p>This OTP expires in 10 minutes.</p>
            </div>
            
            <p>If you didn't request this, please ignore this email.</p>
            <a href="https://quickquack.com/reset-password?token=token" class="button">Reset Password Now</a>
            
            <p>For security, never share this OTP.</p>
            <p>Happy Quacking!<br>— The QuickQuack Team</p>
        </div>
        
        <div class="footer">
            <p>© 2025 QuickQuack. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
}

async function sendEmail(options) {
  const emailOptions = {
    from: "QuickQuack <onboarding@resend.dev>",
    to: options.email,
    subject: "🔐 QuickQuack Password Reset OTP",
    html: getMessage(options.token),
  };

  try {
    const response = await resend.emails.send(emailOptions);
  } catch (error) {
    throw new Error("Error Sending Email..");
  }
}

export default sendEmail;
