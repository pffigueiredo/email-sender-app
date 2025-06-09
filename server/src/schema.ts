
import { z } from 'zod';

// Email schema
export const emailSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  subject: z.string(),
  body: z.string(),
  sent_at: z.coerce.date(),
  status: z.enum(['sent', 'failed'])
});

export type Email = z.infer<typeof emailSchema>;

// Input schema for sending email
export const sendEmailInputSchema = z.object({
  email: z.string().email()
});

export type SendEmailInput = z.infer<typeof sendEmailInputSchema>;

// Response schema for send email
export const sendEmailResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  emailId: z.number().optional()
});

export type SendEmailResponse = z.infer<typeof sendEmailResponseSchema>;
