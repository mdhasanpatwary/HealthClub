import { sendWithRetry, smtpUser, smtpPassword } from "@/lib/mail";
import { logger } from "@/lib/logger";

export interface PartnerApplicationConfirmationEmailOptions {
  to: string;
  orgName: string;
  category: string;
  contactName?: string;
  phone: string;
  address: string;
  discount: string;
  requestId: string;
  loginUrl?: string;
  initialPassword?: string;
}

export async function sendPartnerApplicationConfirmationEmail(
  options: PartnerApplicationConfirmationEmailOptions
): Promise<boolean> {
  const { to, orgName, category, contactName, phone, address, discount, requestId } = options;

  if (!smtpUser || !smtpPassword || smtpPassword.includes("placeholder") || smtpPassword.includes("your-16-char")) {
    logger.info(`[EMAIL SIMULATOR] Partner application confirmation email to ${to} for org ${orgName}`);
    return true;
  }

  const categoryMap: Record<string, string> = {
    hospital: "হাসপাতাল (Hospital)",
    diagnostic: "ডায়াগনস্টিক সেন্টার (Diagnostic Center)",
    pharmacy: "ফার্মেসি (Pharmacy)",
  };
  const categoryBn = categoryMap[category] || category;
  const trackingId = requestId.slice(-8).toUpperCase();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://healthclubfeni.com";
  const loginUrl = options.loginUrl || `${siteUrl}/login/partner`;
  const defaultPassword = options.initialPassword || "123456";

  const mailOptions = {
    from: `"হেলথ ক্লাব (Health Club)" <${smtpUser}>`,
    to,
    subject: `হেলথ ক্লাব পার্টনারশিপ আবেদন প্রাপ্তি ও লগইন তথ্য — ${orgName}`,
    html: `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>হেলথ ক্লাব পার্টনারশিপ আবেদন প্রাপ্তি</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif; -webkit-text-size-adjust: 100%;">
  <div style="background-color: #f1f5f9; padding: 12px 8px; min-height: 100%;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; width: 100%; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      <!-- Header -->
      <tr>
        <td style="background-color: #0f172a; padding: 24px 16px; text-align: center; border-bottom: 3px solid #16a34a;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">
            হেলথ <span style="color: #16a34a;">ক্লাব</span>
          </h1>
          <p style="color: #94a3b8; font-size: 11px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
            Health Club &bull; পার্টনার নেটওয়ার্ক
          </p>
        </td>
      </tr>

      <!-- Body Content -->
      <tr>
        <td style="padding: 20px 16px; color: #334155; line-height: 1.55; font-size: 14px;">
          <!-- Status Badge -->
          <div style="margin-bottom: 14px;">
            <span style="display: inline-block; background-color: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px;">
              ✓ আবেদন সফলভাবে গৃহীত
            </span>
          </div>

          <p style="font-size: 15px; margin: 0 0 12px 0; color: #0f172a;">
            প্রিয় <strong>${contactName || orgName}</strong>,
          </p>
          <p style="font-size: 14px; margin: 0 0 18px 0; color: #334155;">
            হেলথ ক্লাবের পার্টনার নেটওয়ার্কে যুক্ত হওয়ার আগ্রহ প্রকাশের জন্য ধন্যবাদ। <strong>${orgName}</strong>-এর পার্টনারশিপ আবেদনটি সফলভাবে গৃহীত হয়েছে।
          </p>

          <!-- Partner Panel Login Card (Full Width, Mobile First) -->
          <div style="border: 2px solid #16a34a; border-radius: 10px; background-color: #f0fdf4; padding: 16px; margin: 0 0 20px 0;">
            <div style="font-weight: 700; font-size: 15px; color: #15803d; margin-bottom: 8px;">
              🔐 পার্টনার প্যানেল লগইন তথ্য
            </div>
            <div style="font-size: 13px; color: #334155; margin-bottom: 12px; line-height: 1.5;">
              আপনার প্রতিষ্ঠানের জন্য পার্টনার অ্যাকাউন্ট প্রস্তুত করা হয়েছে। আপনি নিচের তথ্য ব্যবহার করে এখনই পার্টনার পোর্টালে লগইন করতে পারবেন:
            </div>

            <!-- Credentials Box -->
            <div style="background-color: #ffffff; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
              <div style="margin-bottom: 10px;">
                <span style="font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase;">লগইন আইডি / ইউজারনেম:</span>
                <div style="font-size: 14px; color: #0f172a; font-weight: 700; font-family: monospace; word-break: break-all; margin-top: 2px;">
                  ${to}
                </div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">(অথবা মোবাইল নম্বর: <strong>${phone}</strong>)</div>
              </div>

              <div>
                <span style="font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase;">প্রাথমিক পাসওয়ার্ড:</span>
                <div style="margin-top: 2px;">
                  <code style="display: inline-block; font-size: 16px; font-weight: 700; color: #0f172a; background-color: #f1f5f9; padding: 3px 10px; border-radius: 6px; letter-spacing: 1px;">${defaultPassword}</code>
                </div>
              </div>
            </div>

            <!-- Password Reset Warning Banner -->
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 10px 12px; border-radius: 0 6px 6px 0; margin-bottom: 14px;">
              <div style="font-size: 12px; font-weight: 700; color: #b91c1c;">
                ⚠️ পাসওয়ার্ড পরিবর্তন / রিসেটের জরুরি নির্দেশনা:
              </div>
              <div style="font-size: 12px; color: #7f1d1d; line-height: 1.45; margin-top: 3px;">
                নিরাপত্তার স্বার্থে পার্টনার পোর্টালে প্রথমবার লগইন করার পর অবিলম্বে ড্যাশবোর্ডের <strong>"প্রোফাইল ও পাসওয়ার্ড সেটিংস"</strong> থেকে অথবা লগইন পেজের <strong>"পাসওয়ার্ড ভুলে গেছেন?"</strong> লিংক ব্যবহার করে পাসওয়ার্ড পরিবর্তন করে নিন।
              </div>
            </div>

            <!-- Login Action Button -->
            <div style="text-align: center;">
              <a href="${loginUrl}" style="display: block; width: 100%; box-sizing: border-box; background-color: #16a34a; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 16px; border-radius: 8px; text-align: center;">
                পার্টনার পোর্টালে লগইন করুন &rarr;
              </a>
              <div style="font-size: 11px; color: #64748b; margin-top: 6px; word-break: break-all;">
                সরাসরি লিংক: <a href="${loginUrl}" style="color: #16a34a;">${loginUrl}</a>
              </div>
            </div>
          </div>

          <!-- Application Summary (Single Column Stacked Layout, 100% Mobile Width) -->
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc; overflow: hidden; margin-bottom: 18px;">
            <div style="background-color: #f1f5f9; padding: 10px 14px; font-weight: 700; font-size: 13px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">
              আবেদনের বিবরণ সারসংক্ষেপ
            </div>

            <div style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0;">
              <div style="font-size: 11px; color: #64748b; font-weight: 600;">আবেদন ট্র্যাকিং আইডি</div>
              <div style="font-size: 13px; color: #0f172a; font-weight: 700; font-family: monospace; margin-top: 2px;">#${trackingId}</div>
            </div>

            <div style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0;">
              <div style="font-size: 11px; color: #64748b; font-weight: 600;">প্রতিষ্ঠানের নাম</div>
              <div style="font-size: 13px; color: #0f172a; font-weight: 600; margin-top: 2px;">${orgName}</div>
            </div>

            <div style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0;">
              <div style="font-size: 11px; color: #64748b; font-weight: 600;">ক্যাটাগরি</div>
              <div style="font-size: 13px; color: #0f172a; margin-top: 2px;">${categoryBn}</div>
            </div>

            <div style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0;">
              <div style="font-size: 11px; color: #64748b; font-weight: 600;">যোগাযোগের ব্যক্তি ও ফোন</div>
              <div style="font-size: 13px; color: #0f172a; margin-top: 2px;">${contactName ? `${contactName} (${phone})` : phone}</div>
            </div>

            <div style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0;">
              <div style="font-size: 11px; color: #64748b; font-weight: 600;">প্রতিষ্ঠানের ঠিকানা</div>
              <div style="font-size: 13px; color: #0f172a; margin-top: 2px;">${address}</div>
            </div>

            <div style="padding: 10px 14px;">
              <div style="font-size: 11px; color: #64748b; font-weight: 600;">প্রস্তাবিত ডিসকাউন্ট রেট</div>
              <div style="font-size: 13px; color: #16a34a; font-weight: 700; margin-top: 2px;">${discount}</div>
            </div>
          </div>

          <!-- Next Steps Note -->
          <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 14px; border-radius: 0 6px 6px 0; margin-bottom: 18px;">
            <div style="font-size: 12px; font-weight: 700; color: #1e40af; margin-bottom: 2px;">
              পরবর্তী অনবোর্ডিং পদক্ষেপ:
            </div>
            <div style="font-size: 12px; color: #1e3a8a; line-height: 1.5;">
              আমাদের পার্টনারশিপ রিলেশন প্রতিনিধি আগামী <strong>২৪ ঘণ্টার মধ্যে</strong> আপনার সাথে ফোনে যোগাযোগ করে চুক্তি স্বাক্ষর ও পার্টনার পোর্টালে বিস্তারিত প্রোফাইল সেটআপ সম্পন্ন করবেন।
            </div>
          </div>

          <!-- Hotline Support -->
          <p style="font-size: 12px; color: #64748b; margin: 0; line-height: 1.5;">
            যেকোনো জিজ্ঞাসা বা সহায়তার জন্য আমাদের পার্টনার হটলাইনে যোগাযোগ করুন: <br>
            <strong style="color: #0f172a; font-size: 13px;">+৮৮০ ১৮৮৬৭৬৩৮৪৯</strong> (সকাল ৯:০০ - রাত ৯:০০)
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background-color: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="font-size: 11px; color: #94a3b8; margin: 0; line-height: 1.5;">
            &copy; 2026 হেলথ ক্লাব। সর্বস্বত্ব সংরক্ষিত।<br>
            মিজান রোড, ফেনী - ৩৯০০, বাংলাদেশ।
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
    `,
  };

  const result = await sendWithRetry(mailOptions);
  if (result.success) {
    logger.info(`[PARTNER APPLICATION EMAIL SENT] To: ${to}. MessageId: ${result.messageId}`);
  } else {
    logger.error(`[PARTNER APPLICATION EMAIL ERROR] Failed to send to ${to}`);
  }
  return result.success;
}

export interface PartnerApprovalEmailOptions {
  to: string;
  orgName: string;
  phone: string;
  loginUrl?: string;
  initialPassword?: string;
}

export async function sendPartnerApprovalEmail(
  options: PartnerApprovalEmailOptions
): Promise<boolean> {
  const { to, orgName, phone } = options;

  if (!smtpUser || !smtpPassword || smtpPassword.includes("placeholder") || smtpPassword.includes("your-16-char")) {
    logger.info(`[EMAIL SIMULATOR] Partner approval email to ${to} for org ${orgName}`);
    return true;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://healthclubfeni.com";
  const loginUrl = options.loginUrl || `${siteUrl}/login/partner`;
  const defaultPassword = options.initialPassword || "123456";

  const mailOptions = {
    from: `"হেলথ ক্লাব (Health Club)" <${smtpUser}>`,
    to,
    subject: `অভিনন্দন! আপনার পার্টনারশিপ আবেদন অনুমোদিত হয়েছে — ${orgName}`,
    html: `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>পার্টনারশিপ আবেদন অনুমোদিত</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Bengali', Arial, sans-serif; -webkit-text-size-adjust: 100%;">
  <div style="background-color: #f1f5f9; padding: 12px 8px; min-height: 100%;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; width: 100%; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      <!-- Header -->
      <tr>
        <td style="background-color: #0f172a; padding: 24px 16px; text-align: center; border-bottom: 3px solid #16a34a;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">
            হেলথ <span style="color: #16a34a;">ক্লাব</span>
          </h1>
          <p style="color: #94a3b8; font-size: 11px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
            Health Club &bull; অফিসিয়াল পার্টনার পোর্টাল
          </p>
        </td>
      </tr>

      <!-- Content -->
      <tr>
        <td style="padding: 20px 16px; color: #334155; line-height: 1.55; font-size: 14px;">
          <div style="margin-bottom: 14px;">
            <span style="display: inline-block; background-color: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px;">
              ✓ পার্টনারশিপ অনুমোদিত
            </span>
          </div>

          <p style="font-size: 15px; margin: 0 0 12px 0; color: #0f172a;">
            অভিনন্দন <strong>${orgName}</strong>,
          </p>
          <p style="font-size: 14px; margin: 0 0 18px 0; color: #334155;">
            আপনার প্রতিষ্ঠানের পার্টনারশিপ আবেদনটি হেলথ ক্লাব কর্তৃপক্ষ কর্তৃক অনুমোদিত হয়েছে। এখন থেকে আপনি আমাদের পার্টনার পোর্টালে লগইন করে সেবা প্রদান ও মেম্বার ভেরিফিকেশন পরিচালনা করতে পারবেন।
          </p>

          <!-- Login Details Card -->
          <div style="border: 2px solid #16a34a; border-radius: 10px; background-color: #f0fdf4; padding: 16px; margin: 0 0 20px 0;">
            <div style="font-weight: 700; font-size: 15px; color: #15803d; margin-bottom: 8px;">
              🔐 আপনার লগইন ক্রেডেনশিয়াল
            </div>

            <div style="background-color: #ffffff; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
              <div style="margin-bottom: 10px;">
                <span style="font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase;">লগইন আইডি:</span>
                <div style="font-size: 14px; color: #0f172a; font-weight: 700; font-family: monospace; word-break: break-all; margin-top: 2px;">
                  ${to}
                </div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">(অথবা মোবাইল নম্বর: <strong>${phone}</strong>)</div>
              </div>

              <div>
                <span style="font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase;">পাসওয়ার্ড:</span>
                <div style="margin-top: 2px;">
                  <code style="display: inline-block; font-size: 16px; font-weight: 700; color: #0f172a; background-color: #f1f5f9; padding: 3px 10px; border-radius: 6px; letter-spacing: 1px;">${defaultPassword}</code>
                </div>
              </div>
            </div>

            <!-- Password Reset Warning Banner -->
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 10px 12px; border-radius: 0 6px 6px 0; margin-bottom: 14px;">
              <div style="font-size: 12px; font-weight: 700; color: #b91c1c;">
                ⚠️ পাসওয়ার্ড পরিবর্তনের নির্দেশনা:
              </div>
              <div style="font-size: 12px; color: #7f1d1d; line-height: 1.45; margin-top: 3px;">
                নিরাপত্তার স্বার্থে পার্টনার পোর্টালে প্রথমবার লগইন করার পর অবিলম্বে ড্যাশবোর্ডের "প্রোফাইল ও পাসওয়ার্ড সেটিংস" থেকে পাসওয়ার্ড পরিবর্তন করে নিন।
              </div>
            </div>

            <div style="text-align: center;">
              <a href="${loginUrl}" style="display: block; width: 100%; box-sizing: border-box; background-color: #16a34a; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 16px; border-radius: 8px; text-align: center;">
                পার্টনার পোর্টালে লগইন করুন &rarr;
              </a>
              <div style="font-size: 11px; color: #64748b; margin-top: 6px; word-break: break-all;">
                সরাসরি লিংক: <a href="${loginUrl}" style="color: #16a34a;">${loginUrl}</a>
              </div>
            </div>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="background-color: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="font-size: 11px; color: #94a3b8; margin: 0; line-height: 1.5;">
            &copy; 2026 হেলথ ক্লাব। সর্বস্বত্ব সংরক্ষিত।<br>
            মিজান রোড, ফেনী - ৩৯০০, বাংলাদেশ।
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
    `,
  };

  const result = await sendWithRetry(mailOptions);
  if (result.success) {
    logger.info(`[PARTNER APPROVAL EMAIL SENT] To: ${to}. MessageId: ${result.messageId}`);
  } else {
    logger.error(`[PARTNER APPROVAL EMAIL ERROR] Failed to send to ${to}`);
  }
  return result.success;
}
