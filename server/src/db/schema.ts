
import { serial, text, pgTable, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Email status enum
export const emailStatusEnum = pgEnum('email_status', ['sent', 'failed']);

export const emailsTable = pgTable('emails', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  sent_at: timestamp('sent_at').defaultNow().notNull(),
  status: emailStatusEnum('status').notNull()
});

// TypeScript types for the table schema
export type Email = typeof emailsTable.$inferSelect;
export type NewEmail = typeof emailsTable.$inferInsert;

// Export all tables for proper query building
export const tables = { emails: emailsTable };
