import { Hono } from 'hono';
import { and, eq, inArray } from 'drizzle-orm';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { db } from '@/db/drizzle';
import { accounts, insertAccountSchema } from '@/db/schema';

const app = new Hono()
	.get('/', clerkMiddleware(), async ctx => {
		const auth = getAuth(ctx);

		if (!auth?.userId) {
			throw new HTTPException(401, { res: ctx.json({ error: 'Unauthorized' }, 401) });
		}

		const data = await db
			.select({ id: accounts.id, name: accounts.name })
			.from(accounts)
			.where(eq(accounts.userId, auth.userId));
		return ctx.json({ data });
	})
	.get(
		'/:id',
		clerkMiddleware(),
		// Route params are of type string, so we have to convert it to a number
		zValidator('param', z.object({ id: z.coerce.number().int().positive().optional() })),
		async ctx => {
			const auth = getAuth(ctx);

			if (!auth?.userId) {
				throw new HTTPException(401, { res: ctx.json({ error: 'Unauthorized' }, 401) });
			}

			const { id } = ctx.req.valid('param');

			if (!id) {
				return ctx.json({ error: 'ID missing' }, 400);
			}

			const [account] = await db
				.select({ id: accounts.id, name: accounts.name })
				.from(accounts)
				.where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)));

			if (!account) {
				return ctx.json({ error: 'Account not found' }, 404);
			}

			return ctx.json({ data: account });
		},
	)
	.post(
		'/',
		clerkMiddleware(),
		zValidator('json', insertAccountSchema.pick({ name: true })),
		async ctx => {
			const auth = getAuth(ctx);

			if (!auth?.userId) {
				throw new HTTPException(401, { res: ctx.json({ error: 'Unauthorized' }, 401) });
			}

			const values = ctx.req.valid('json');

			const [newAccount] = await db
				.insert(accounts)
				.values({ userId: auth.userId, ...values })
				.returning();

			return ctx.json({ data: newAccount }, 201);
		},
	)
	.post(
		'/bulk-delete',
		clerkMiddleware(),
		zValidator('json', z.object({ ids: z.array(z.number()) })),
		async ctx => {
			const auth = getAuth(ctx);

			if (!auth?.userId) {
				throw new HTTPException(401, { res: ctx.json({ error: 'Unauthorized' }, 401) });
			}

			const values = ctx.req.valid('json');

			const data = await db
				.delete(accounts)
				.where(and(eq(accounts.userId, auth.userId), inArray(accounts.id, values.ids)))
				.returning({ id: accounts.id });

			return ctx.json({ data });
		},
	)
	.patch(
		'/:id',
		clerkMiddleware(),
		zValidator('param', z.object({ id: z.coerce.number().int().positive().optional() })),
		zValidator('json', insertAccountSchema.pick({ name: true })),
		async ctx => {
			const auth = getAuth(ctx);

			if (!auth?.userId) {
				throw new HTTPException(401, { res: ctx.json({ error: 'Unauthorized' }, 401) });
			}

			const { id } = ctx.req.valid('param');

			if (!id) {
				return ctx.json({ error: 'ID missing' }, 400);
			}

			const values = ctx.req.valid('json');

			const [updatedAccount] = await db
				.update(accounts)
				.set(values)
				.where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
				.returning({ id: accounts.id, name: accounts.name });

			if (!updatedAccount) {
				return ctx.json({ error: 'Account not found' }, 404);
			}

			return ctx.json({ data: updatedAccount });
		},
	)
	.delete(
		'/:id',
		clerkMiddleware(),
		zValidator('param', z.object({ id: z.coerce.number().int().positive().optional() })),
		async ctx => {
			const auth = getAuth(ctx);

			if (!auth?.userId) {
				throw new HTTPException(401, { res: ctx.json({ error: 'Unauthorized' }, 401) });
			}

			const { id } = ctx.req.valid('param');

			if (!id) {
				return ctx.json({ error: 'ID missing' }, 404);
			}

			const [data] = await db
				.delete(accounts)
				.where(and(eq(accounts.userId, auth.userId), eq(accounts.id, id)))
				.returning({ id: accounts.id });

			if (!data) {
				return ctx.json({ error: 'Account not found' }, 404);
			}

			return ctx.json({ data });
		},
	);

export default app;
