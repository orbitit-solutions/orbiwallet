import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';

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
	);

export default app;
