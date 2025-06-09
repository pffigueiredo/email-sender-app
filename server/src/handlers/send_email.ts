
import { db } from '../db';
import { emailsTable } from '../db/schema';
import { type SendEmailInput, type SendEmailResponse } from '../schema';

export const sendEmail = async (input: SendEmailInput): Promise<SendEmailResponse> => {
  try {
    // Simulate email sending logic
    const isEmailSent = Math.random() > 0.2; // 80% success rate for simulation
    
    const status = isEmailSent ? 'sent' : 'failed';
    const subject = 'hey';
    const body = 'Hey there!';

    // Insert email record
    const result = await db.insert(emailsTable)
      .values({
        email: input.email,
        subject: subject,
        body: body,
        status: status
      })
      .returning()
      .execute();

    const emailRecord = result[0];

    if (isEmailSent) {
      return {
        success: true,
        message: 'Email sent successfully',
        emailId: emailRecord.id
      };
    } else {
      return {
        success: false,
        message: 'Failed to send email',
        emailId: emailRecord.id
      };
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};
