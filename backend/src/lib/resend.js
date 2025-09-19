import { Resend } from 'resend';
import { ENV } from './env.js';

// Initialise the Resend client
export const resendClient = new Resend(ENV.RESEND_API_KEY);

// Sender details
export const sender = {
  email: ENV.EMAIL_FROM, // Must be verified in Resend
  name: ENV.EMAIL_FROM_NAME,
};
