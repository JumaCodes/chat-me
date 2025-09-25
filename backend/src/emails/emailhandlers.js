import { resendClient, sender } from "../lib/resend.js";
import { createVerificationEmailTemplate } from "./emailTemplates.js";

export const sendVerificationEmail = async ({ email, name, verifyUrl }) => {
  try {
    const data = await resendClient.emails.send({
      from: `Chat-Me <${sender.email}>`,
      to: email,
      subject: "Verify your email - Chat-Me",
      html: createVerificationEmailTemplate(name, verifyUrl),
    });

    console.log("Verification email sent successfully", data);
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw new Error("Failed to send verification email");
  }
};
