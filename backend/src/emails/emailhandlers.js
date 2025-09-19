import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeEmail = async ({ email, name, clientURL }) => {
  try {
    const data = await resendClient.emails.send({
      from: `Chat-Me <${sender.email}>`,
      to: email,
      subject: "Welcome to Chat-Me!",
      html: createWelcomeEmailTemplate(name, clientURL),
    });

    console.log("Welcome Email sent successfully", data);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};
