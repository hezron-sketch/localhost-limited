/**
 * Email Service — Localhost Limited
 * Handles sending contact form confirmation and notification emails
 * Uses Resend API for reliable email delivery
 */

import { ENV } from "./_core/env";
import { COMPANY_INFO, HR_EMAIL } from "@shared/company";

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

const FROM_EMAIL = "noreply@localhostlimitedafrica.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY;

/**
 * Send email via Resend API
 * Requires RESEND_API_KEY environment variable
 */
export async function sendEmail({ to, subject, html, from = FROM_EMAIL }: EmailParams) {
  if (!RESEND_API_KEY) {
    console.warn("[Email] RESEND_API_KEY not configured. Email not sent.");
    return { success: false, message: "Email service not configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("[Email] Resend API error:", error);
      return { success: false, message: "Failed to send email" };
    }

    const data = await response.json();
    console.log("[Email] Sent successfully:", data.id);
    return { success: true, id: data.id };
  } catch (error) {
    console.error("[Email] Failed to send email:", error);
    return { success: false, message: "Email service error" };
  }
}

/**
 * Send contact form confirmation email to user
 */
export async function sendContactConfirmationEmail(name: string, email: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0D1B2A 0%, #0F2035 100%); color: #22C55E; padding: 30px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { color: #666; font-size: 12px; margin-top: 20px; }
          a { color: #22C55E; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">We've Received Your Message</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for reaching out to Localhost Limited. We've received your message and our team will review it shortly.</p>
            <p>We typically respond within 24 hours during business days. If your inquiry is urgent, feel free to call us at <strong>${COMPANY_INFO.contact.phoneDisplay}</strong>.</p>
            <p style="margin-top: 30px; color: #666;">
              Best regards,<br>
              <strong>The Localhost Limited Team</strong><br>
              ${COMPANY_INFO.office.fullAddress}
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Localhost Limited. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: "We've Received Your Message — Localhost Limited",
    html,
  });
}

/**
 * Send contact form notification email to owner
 */
export async function sendContactNotificationEmail(
  name: string,
  email: string,
  message: string,
  ownerEmail: string | string[]
) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0D1B2A 0%, #0F2035 100%); color: #22C55E; padding: 30px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .message-box { background: white; border-left: 4px solid #22C55E; padding: 15px; margin: 20px 0; }
          .footer { color: #666; font-size: 12px; margin-top: 20px; }
          .badge { display: inline-block; background: #22C55E; color: #0D1B2A; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">New Contact Form Submission</h1>
          </div>
          <div class="content">
            <p><span class="badge">NEW</span></p>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <div class="message-box">
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, "<br>")}</p>
            </div>
            <p style="margin-top: 20px;">
              <a href="https://localhostlimitedafrica.com/admin/submissions" style="background: #22C55E; color: #0D1B2A; padding: 10px 20px; border-radius: 4px; text-decoration: none; font-weight: bold;">View in Dashboard</a>
            </p>
          </div>
          <div class="footer">
            <p>© 2024 Localhost Limited. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Send to multiple emails if array is provided
  const emailAddresses = Array.isArray(ownerEmail) ? ownerEmail : [ownerEmail];
  
  // Send to all email addresses
  const emailPromises = emailAddresses.map(email => 
    sendEmail({
      to: email,
      subject: `New Contact: ${name}`,
      html,
    })
  );
  
  return Promise.all(emailPromises);
}
