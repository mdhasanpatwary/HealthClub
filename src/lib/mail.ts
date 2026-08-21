import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;

let _transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPassword ? smtpPassword.replace(/\s+/g, "") : "",
      },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }
  return _transporter;
}

export async function sendOtpEmail(email: string, otp: string, name: string): Promise<boolean> {
  // If SMTP credentials are not configured or are placeholder values, fall back to console logging
  if (!smtpUser || !smtpPassword || smtpPassword.includes("placeholder") || smtpPassword.includes("your-16-char")) {
    console.log(`[EMAIL SIMULATOR] (SMTP Credentials Not Set) Verification email to ${email} with code: ${otp}`);
    return true;
  }

  const mailOptions = {
    from: `"হেলথ ক্লাব (Health Club)" <${smtpUser}>`,
    to: email,
    subject: `হেলথ ক্লাব ইমেইল ভেরিফিকেশন কোড: ${otp}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 10px; margin: 0; min-height: 100%;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); overflow: hidden; border-collapse: collapse; margin: 0 auto;">
          <!-- Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 30px 40px; text-align: center; border-bottom: 3px solid #16a34a;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">
                হেলথ <span style="color: #16a34a;">ক্লাব</span>
              </h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px; color: #334155; line-height: 1.6;">
              <p style="font-size: 16px; margin-top: 0; margin-bottom: 20px;">
                প্রিয় <strong>${name}</strong>,
              </p>
              <p style="font-size: 15px; margin-bottom: 25px;">
                হেলথ ক্লাবে (Health Club) আপনাকে স্বাগতম! আপনার অ্যাকাউন্টটি সচল করতে এবং ইমেইল ভেরিফিকেশন সম্পন্ন করতে নিচের ৬-সংখ্যার ওটিপি (OTP) কোডটি ব্যবহার করুন:
              </p>
              
              <!-- OTP Box -->
              <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; background-color: #f0fdf4; border: 2px dashed #16a34a; border-radius: 8px; color: #15803d; font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; padding: 12px 30px;">
                  ${otp}
                </span>
              </div>
              
              <p style="font-size: 14px; color: #64748b; margin-bottom: 0;">
                এই কোডটি আগামী ১৫ মিনিটের জন্য কার্যকর থাকবে। আপনি যদি এই অনুরোধটি না করে থাকেন, তবে অনুগ্রহ করে এই ইমেইলটি উপেক্ষা করুন।
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 20px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5;">
                &copy; 2026 হেলথ ক্লাব। সর্বস্বত্ব সংরক্ষিত।<br>
                Feni, Bangladesh.
              </p>
            </td>
          </tr>
        </table>
      </div>
    `,
  };

  try {
    const info = await getTransporter().sendMail(mailOptions);
    console.log(`[EMAIL SENT] OTP successfully sent to ${email}. MessageId: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send OTP to ${email}:`, error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, otp: string, name: string): Promise<boolean> {
  // If SMTP credentials are not configured or are placeholder values, fall back to console logging
  if (!smtpUser || !smtpPassword || smtpPassword.includes("placeholder") || smtpPassword.includes("your-16-char")) {
    console.log(`[EMAIL SIMULATOR] (SMTP Credentials Not Set) Password reset email to ${email} with code: ${otp}`);
    return true;
  }

  const mailOptions = {
    from: `"হেলথ ক্লাব (Health Club)" <${smtpUser}>`,
    to: email,
    subject: `হেলথ ক্লাব পাসওয়ার্ড রিসেট কোড: ${otp}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 10px; margin: 0; min-height: 100%;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); overflow: hidden; border-collapse: collapse; margin: 0 auto;">
          <!-- Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 30px 40px; text-align: center; border-bottom: 3px solid #ef4444;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">
                হেলথ <span style="color: #16a34a;">ক্লাব</span>
              </h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px; color: #334155; line-height: 1.6;">
              <p style="font-size: 16px; margin-top: 0; margin-bottom: 20px;">
                প্রিয় <strong>${name}</strong>,
              </p>
              <p style="font-size: 15px; margin-bottom: 25px;">
                আপনার হেলথ ক্লাব অ্যাকাউন্টের পাসওয়ার্ড রিসেট করার জন্য একটি অনুরোধ পাওয়া গেছে। পাসওয়ার্ড রিসেট সম্পন্ন করতে নিচের ৬-সংখ্যার ওটিপি (OTP) কোডটি ব্যবহার করুন:
              </p>
              
              <!-- OTP Box -->
              <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; background-color: #fef2f2; border: 2px dashed #ef4444; border-radius: 8px; color: #b91c1c; font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; padding: 12px 30px;">
                  ${otp}
                </span>
              </div>
              
              <p style="font-size: 14px; color: #64748b; margin-bottom: 0;">
                এই কোডটি আগামী ১৫ মিনিটের জন্য কার্যকর থাকবে। আপনি যদি এই পাসওয়ার্ড পরিবর্তনের অনুরোধ না করে থাকেন, তবে অনুগ্রহ করে সুরক্ষিত থাকার জন্য অবিলম্বে আপনার পাসওয়ার্ড পরিবর্তন করুন অথবা আমাদের জানান।
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 20px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5;">
                &copy; 2026 হেলথ ক্লাব। সর্বস্বত্ব সংরক্ষিত।<br>
                Feni, Bangladesh.
              </p>
            </td>
          </tr>
        </table>
      </div>
    `,
  };

  try {
    const info = await getTransporter().sendMail(mailOptions);
    console.log(`[EMAIL SENT] Password reset OTP successfully sent to ${email}. MessageId: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send password reset OTP to ${email}:`, error);
    return false;
  }
}

