import nodemailer from "nodemailer";
import { ENV } from "./env";

/**
 * SMTP Email Configuration
 * Uses nodemailer to send emails via custom SMTP server
 */

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: ENV.smtpHost,
    port: parseInt(ENV.smtpPort || "587"),
    secure: ENV.smtpPort === "465", // true for 465, false for other ports
    auth: {
      user: ENV.smtpUser,
      pass: ENV.smtpPassword,
    },
  });

  return transporter;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Send email via SMTP
 */
export async function sendSMTPEmail(options: SendEmailOptions) {
  try {
    const transporter = getTransporter();

    const mailOptions = {
      from: ENV.smtpFromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo || ENV.smtpReplyTo,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("[SMTP Email] Sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("[SMTP Email] Error:", error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

/**
 * Send job application confirmation email to applicant
 */
export async function sendApplicationConfirmationEmail(
  applicantEmail: string,
  applicantName: string,
  jobTitle: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0D1B2A 0%, #1a2f4a 100%); color: #22C55E; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
          .button { display: inline-block; background: #22C55E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 15px 0; }
          h1 { margin: 0; font-size: 24px; }
          p { margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Received ✓</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${applicantName}</strong>,</p>
            
            <p>Thank you for applying for the <strong>${jobTitle}</strong> position at Localhost Limited. We're excited to review your application!</p>
            
            <p><strong>What's next?</strong></p>
            <ul>
              <li>Our HR team will carefully review your application</li>
              <li>We'll contact you within 5-7 business days if your profile matches our requirements</li>
              <li>If selected, we'll invite you for an interview</li>
            </ul>
            
            <p>In the meantime, feel free to explore more about Localhost Limited and our services at <a href="https://localhostlimitedafrica.com">localhostlimitedafrica.com</a></p>
            
            <p>If you have any questions, don't hesitate to reach out to us at <a href="mailto:hr@localhostlimitedafrica.com">hr@localhostlimitedafrica.com</a></p>
            
            <p>Best regards,<br><strong>Localhost Limited HR Team</strong></p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Localhost Limited. All rights reserved.</p>
            <p>Nairobi, Kenya | <a href="https://localhostlimitedafrica.com">localhostlimitedafrica.com</a></p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendSMTPEmail({
    to: applicantEmail,
    subject: `Application Received - ${jobTitle} Position`,
    html,
    replyTo: "hr@localhostlimitedafrica.com",
  });
}

/**
 * Send HR notification email
 */
export async function sendHRNotificationEmail(
  applicantName: string,
  applicantEmail: string,
  applicantPhone: string,
  jobTitle: string,
  cvUrl: string,
  coverLetter?: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0D1B2A 0%, #1a2f4a 100%); color: #22C55E; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .info-box { background: white; padding: 15px; border-left: 4px solid #22C55E; margin: 15px 0; }
          .button { display: inline-block; background: #22C55E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 10px 5px 10px 0; }
          h1 { margin: 0; font-size: 24px; }
          h2 { color: #0D1B2A; font-size: 16px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Job Application</h1>
          </div>
          <div class="content">
            <p>A new application has been received for the <strong>${jobTitle}</strong> position.</p>
            
            <div class="info-box">
              <h2>Applicant Information</h2>
              <p><strong>Name:</strong> ${applicantName}</p>
              <p><strong>Email:</strong> <a href="mailto:${applicantEmail}">${applicantEmail}</a></p>
              <p><strong>Phone:</strong> ${applicantPhone}</p>
              <p><strong>Position:</strong> ${jobTitle}</p>
            </div>
            
            ${coverLetter ? `
            <div class="info-box">
              <h2>Cover Letter</h2>
              <p>${coverLetter.substring(0, 500)}${coverLetter.length > 500 ? "..." : ""}</p>
            </div>
            ` : ""}
            
            <div class="info-box">
              <h2>Documents</h2>
              <p><a href="${cvUrl}" class="button">Download CV</a></p>
            </div>
            
            <p>Please review this application in your HR dashboard and update the application status accordingly.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendSMTPEmail({
    to: "hr@localhostlimitedafrica.com",
    subject: `New Application - ${jobTitle} Position from ${applicantName}`,
    html,
  });
}
