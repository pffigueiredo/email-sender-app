
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { emailsTable } from '../db/schema';
import { getEmails } from '../handlers/get_emails';

describe('getEmails', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no emails exist', async () => {
    const result = await getEmails();

    expect(result).toEqual([]);
  });

  it('should return all emails', async () => {
    // Insert test emails
    await db.insert(emailsTable)
      .values([
        {
          email: 'test1@example.com',
          subject: 'Test Subject 1',
          body: 'Test body 1',
          status: 'sent'
        },
        {
          email: 'test2@example.com',
          subject: 'Test Subject 2',
          body: 'Test body 2',
          status: 'failed'
        }
      ])
      .execute();

    const result = await getEmails();

    expect(result).toHaveLength(2);
    expect(result[0].email).toEqual('test1@example.com');
    expect(result[0].subject).toEqual('Test Subject 1');
    expect(result[0].body).toEqual('Test body 1');
    expect(result[0].status).toEqual('sent');
    expect(result[0].id).toBeDefined();
    expect(result[0].sent_at).toBeInstanceOf(Date);

    expect(result[1].email).toEqual('test2@example.com');
    expect(result[1].subject).toEqual('Test Subject 2');
    expect(result[1].body).toEqual('Test body 2');
    expect(result[1].status).toEqual('failed');
    expect(result[1].id).toBeDefined();
    expect(result[1].sent_at).toBeInstanceOf(Date);
  });

  it('should return emails ordered by database insertion order', async () => {
    // Insert emails in specific order
    const firstEmail = await db.insert(emailsTable)
      .values({
        email: 'first@example.com',
        subject: 'First Email',
        body: 'First email body',
        status: 'sent'
      })
      .returning()
      .execute();

    const secondEmail = await db.insert(emailsTable)
      .values({
        email: 'second@example.com',
        subject: 'Second Email',
        body: 'Second email body',
        status: 'sent'
      })
      .returning()
      .execute();

    const result = await getEmails();

    expect(result).toHaveLength(2);
    expect(result[0].id).toEqual(firstEmail[0].id);
    expect(result[1].id).toEqual(secondEmail[0].id);
  });

  it('should handle different email statuses', async () => {
    await db.insert(emailsTable)
      .values([
        {
          email: 'sent@example.com',
          subject: 'Sent Email',
          body: 'This email was sent',
          status: 'sent'
        },
        {
          email: 'failed@example.com',
          subject: 'Failed Email',
          body: 'This email failed',
          status: 'failed'
        }
      ])
      .execute();

    const result = await getEmails();

    expect(result).toHaveLength(2);
    const sentEmail = result.find(email => email.status === 'sent');
    const failedEmail = result.find(email => email.status === 'failed');

    expect(sentEmail).toBeDefined();
    expect(sentEmail?.email).toEqual('sent@example.com');
    expect(failedEmail).toBeDefined();
    expect(failedEmail?.email).toEqual('failed@example.com');
  });
});
