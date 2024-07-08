import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const accounts = pgTable('accounts', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	userId: text('user_id').notNull(),
	plaidId: text('plaid_id'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const insertAccountSchema = createInsertSchema(accounts, {
	name: z.string().min(1, { message: 'Name is required' }),
});

export const categories = pgTable('categories', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	userId: text('user_id').notNull(),
	plaidId: text('plaid_id'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categories, {
	name: z.string().min(1, { message: 'Name is required' }),
});
