import { Resend } from "resend";
import { ENV } from "./env";

const resend = new Resend(ENV.resendApiKey);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    const response = await resend.emails.send({
      from: options.from || "noreply@resend.dev",
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (response.error) {
      console.error("[Email] Resend API error:", response.error);
      console.log("[Email] Note: To use custom domain, verify it in Resend dashboard");
      throw new Error(`Email send failed: ${response.error.message}`);
    }

    console.log("[Email] Sent successfully:", response.data?.id);
    return response.data;
  } catch (error) {
    console.error("[Email] Error:", error);
    throw error;
  }
}
