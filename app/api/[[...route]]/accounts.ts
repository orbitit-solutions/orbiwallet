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
	);

export default app;
