import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const accounts = pgTable('accounts', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	userId: text('user_id').notNull(),
	plaidId: text('plaid_id'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const insertAccountSchema = createInsertSchema(accounts);
