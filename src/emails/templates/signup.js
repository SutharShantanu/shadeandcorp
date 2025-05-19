export function baseTemplate({
  title,
  message,
  subject,
  date,
  ctaLink,
  ctaText,
}) {
  return `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 8px;">
          <h2 style="color: #333;">${title || subject}</h2>
          <p style="color: #555;">${message}</p>
          ${
            ctaLink
              ? `
            <a href="${ctaLink}" style="
              display: inline-block;
              margin-top: 20px;
              padding: 10px 20px;
              background-color: #0070f3;
              color: white;
              text-decoration: none;
              border-radius: 5px;
            ">
              ${ctaText || "Click Here"}
            </a>
          `
              : ""
          }
          ${date ? `<p style="color: #999; font-size: 12px; margin-top: 20px;">${new Date(date).toLocaleString()}</p>` : ""}
        </div>
        <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
          If you did not request this, please ignore this email.
        </p>
      </div>
    `;
}
