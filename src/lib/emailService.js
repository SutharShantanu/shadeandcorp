import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const resendEmail = process.env.RESEND_SUPPORT_EMAIL;;

/**
 * Reusable Resend email sender
 * @param {Object} options
 */
export const sendEmail = async ({
  to,
  subject,
  html,
  text,
  from = resendEmail,
  reply_to,
  cc,
  bcc,
  tags = [],
  headers = {},
}) => {
  try {
    const response = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
      reply_to,
      cc,
      bcc,
      tags,
      headers,
    });

    return { success: true, data: response };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
};
