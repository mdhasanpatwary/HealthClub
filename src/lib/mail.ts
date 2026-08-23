import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { logger } from "@/lib/logger";

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
    logger.info(`[EMAIL SIMULATOR] (SMTP Credentials Not Set) Verification email to ${email}`);
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
    logger.info(`[EMAIL SENT] OTP successfully sent to ${email}. MessageId: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`[EMAIL ERROR] Failed to send OTP to ${email}:`, error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, otp: string, name: string): Promise<boolean> {
  // If SMTP credentials are not configured or are placeholder values, fall back to console logging
  if (!smtpUser || !smtpPassword || smtpPassword.includes("placeholder") || smtpPassword.includes("your-16-char")) {
    logger.info(`[EMAIL SIMULATOR] (SMTP Credentials Not Set) Password reset email to ${email}`);
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
    logger.info(`[EMAIL SENT] Password reset OTP successfully sent to ${email}. MessageId: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`[EMAIL ERROR] Failed to send password reset OTP to ${email}:`, error);
    return false;
  }
}

export interface BroadcastEmailOptions {
  to: string;
  recipientName?: string;
  subject: string;
  title: string;
  message: string;
  badge?: string;
  actionUrl?: string;
  actionText?: string;
}

export async function sendBroadcastEmail(options: BroadcastEmailOptions): Promise<boolean> {
  const { to, recipientName, subject, title, message, badge, actionUrl, actionText } = options;

  if (!smtpUser || !smtpPassword || smtpPassword.includes("placeholder") || smtpPassword.includes("your-16-char")) {
    logger.info(`[EMAIL SIMULATOR] Broadcast email to ${to} | Subject: ${subject}`);
    return true;
  }

  // Format message lines into HTML paragraphs
  const formattedMessage = message
    .split("\n\n")
    .map((block) => `<p style="font-size: 15px; line-height: 1.7; margin: 0 0 16px 0; color: #334155;">${block.replace(/\n/g, "<br>")}</p>`)
    .join("");

  const actionButtonHtml = actionUrl && actionText ? `
    <div style="text-align: center; margin: 35px 0 25px 0;">
      <a href="${actionUrl}" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25);">
        ${actionText} &rarr;
      </a>
    </div>
  ` : "";

  const badgeHtml = badge ? `
    <div style="margin-bottom: 12px;">
      <span style="display: inline-block; background-color: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 4px 12px; border-radius: 9999px;">
        ${badge}
      </span>
    </div>
  ` : "";

  const mailOptions = {
    from: `"হেলথ ক্লাব (Health Club)" <${smtpUser}>`,
    to,
    subject,
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 10px; margin: 0; min-height: 100%;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); overflow: hidden; border-collapse: collapse; margin: 0 auto;">
          <!-- Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 32px 40px; text-align: center; border-bottom: 4px solid #16a34a;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">
                হেলথ <span style="color: #22c55e;">ক্লাব</span>
              </h1>
              <p style="color: #94a3b8; font-size: 12px; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                Health Club &bull; ডিজিটাল স্বাস্থ্যসেবা ও ডিসকাউন্ট নেটওয়ার্ক
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 36px 40px 30px 40px;">
              ${badgeHtml}
              
              <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin: 0 0 18px 0; line-height: 1.4;">
                ${title}
              </h2>

              ${recipientName ? `<p style="font-size: 15px; font-weight: 600; color: #1e293b; margin: 0 0 16px 0;">প্রিয় ${recipientName},</p>` : ""}

              ${formattedMessage}

              ${actionButtonHtml}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 13px; font-weight: 600; color: #475569; margin: 0 0 6px 0;">
                হেলথ ক্লাব — স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী
              </p>
              <p style="font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.6;">
                হটলাইন: +৮৮০ ১৮৮৬৭৬৩৮৪৯ &bull; মিজান রোড, ফেনী - ৩৯০০<br>
                &copy; 2026 হেলথ ক্লাব। সর্বস্বত্ব সংরক্ষিত।
              </p>
            </td>
          </tr>
        </table>
      </div>
    `,
  };

  try {
    const info = await getTransporter().sendMail(mailOptions);
    logger.info(`[BROADCAST EMAIL SENT] To: ${to}. MessageId: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`[BROADCAST EMAIL ERROR] Failed to send to ${to}:`, error);
    return false;
  }
}

export async function sendBulkBroadcastEmails(
  recipients: Array<{ email: string; name?: string }>,
  campaign: Omit<BroadcastEmailOptions, "to" | "recipientName">,
  batchSize = 10
): Promise<{ total: number; sent: number; failed: number }> {
  const validRecipients = recipients.filter((r) => r.email && r.email.includes("@"));
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < validRecipients.length; i += batchSize) {
    const batch = validRecipients.slice(i, i + batchSize);
    const promises = batch.map(async (r) => {
      const ok = await sendBroadcastEmail({
        ...campaign,
        to: r.email,
        recipientName: r.name,
      });
      if (ok) sent++;
      else failed++;
    });
    await Promise.all(promises);
  }

  return {
    total: validRecipients.length,
    sent,
    failed,
  };
}


