
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { emailsTable } from '../db/schema';
import { type SendEmailInput } from '../schema';
import { sendEmail } from '../handlers/send_email';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: SendEmailInput = {
  email: 'test@example.com'
};

describe('sendEmail', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should send email and return success response', async () => {
    const result = await sendEmail(testInput);

    // Should return response object
    expect(result.success).toBeDefined();
    expect(result.message).toBeDefined();
    expect(result.emailId).toBeDefined();
    expect(typeof result.emailId).toBe('number');
  });

  it('should save email to database with correct content', async () => {
    const result = await sendEmail(testInput);

    // Query database to verify email was saved
    const emails = await db.select()
      .from(emailsTable)
      .where(eq(emailsTable.id, result.emailId!))
      .execute();

    expect(emails).toHaveLength(1);
    expect(emails[0].email).toEqual('test@example.com');
    expect(emails[0].subject).toEqual('hey');
    expect(emails[0].body).toEqual('Hey there!');
    expect(emails[0].status).toMatch(/^(sent|failed)$/);
    expect(emails[0].sent_at).toBeInstanceOf(Date);
  });

  it('should handle different email addresses', async () => {
    const differentInput: SendEmailInput = {
      email: 'another@test.com'
    };

    const result = await sendEmail(differentInput);

    // Verify email was saved with correct address
    const emails = await db.select()
      .from(emailsTable)
      .where(eq(emailsTable.id, result.emailId!))
      .execute();

    expect(emails[0].email).toEqual('another@test.com');
    expect(emails[0].subject).toEqual('hey');
    expect(emails[0].body).toEqual('Hey there!');
  });

  it('should set status as either sent or failed', async () => {
    const result = await sendEmail(testInput);

    // Query database to verify status
    const emails = await db.select()
      .from(emailsTable)
      .where(eq(emailsTable.id, result.emailId!))
      .execute();

    expect(['sent', 'failed']).toContain(emails[0].status);
    
    // Response success should match database status
    if (emails[0].status === 'sent') {
      expect(result.success).toBe(true);
      expect(result.message).toEqual('Email sent successfully');
    } else {
      expect(result.success).toBe(false);
      expect(result.message).toEqual('Failed to send email');
    }
  });
});
